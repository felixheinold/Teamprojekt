import os
import re
import sys
import json
import nltk
import torch
from collections import Counter
from deep_translator import GoogleTranslator
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from nltk.corpus import stopwords
from transformers import pipeline
from huggingface_hub import hf_hub_download
import PyPDF2
from google.cloud import storage

def upload_to_gcs(local_path, bucket_name, dest_path):
    client = storage.Client()
    bucket = client.bucket(bucket_name)
    blob = bucket.blob(dest_path)
    blob.upload_from_filename(local_path)


def lade_nltk_daten():
    download_dir = '/home/ka/ka_stud/ka_uutnq/nltk_data'
    nltk.download('punkt_tab', download_dir=download_dir)
    nltk.download('stopwords', download_dir=download_dir)
    nltk.download('wordnet', download_dir=download_dir)
    nltk.download('omw-1.4', download_dir=download_dir)
    nltk.download('averaged_perceptron_tagger', download_dir=download_dir)
    nltk.download('punkt', download_dir=download_dir, quiet=True)


def lade_pdf_text(pdf_datei):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    pdf_path = os.path.join(script_dir, pdf_datei)

    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        return "".join(page.extract_text() for page in reader.pages)


def finde_rauschende_woerter(text, stop_words, top_n=20, min_len=3):
    text = re.sub(r'[^a-zäöüß ]', '', text.lower())
    tokens = word_tokenize(text)
    tokens = [word for word in tokens if word not in stop_words and len(word) >= min_len]
    return set([w for w, _ in Counter(tokens).most_common(top_n)])


def textverarbeitung(text, eigene_stopwords, max_token_freq=5):
    text = re.sub(r'https?://\S+|www\.\S+', '', text.lower())
    text = re.sub(r'\b[\w\.-]+@[\w\.-]+\.\w+\b', '', text)
    text = re.sub(r'[^a-zäöüß ]', '', text)
    tokens = word_tokenize(text)

    stop_words = set(stopwords.words('german')).union(eigene_stopwords)
    tokens = [w for w in tokens if w not in stop_words and len(w) > 2]

    lemmatizer = WordNetLemmatizer()
    tokens = [lemmatizer.lemmatize(w) for w in tokens]

    token_counts = Counter(tokens)
    tokens = [w for w in tokens if token_counts[w] <= max_token_freq]

    return " ".join(tokens)


def lade_modell(model_id, token):
    filenames = [
        'config.json', 'special_tokens_map.json', 'tokenizer_config.json',
        'model.safetensors', 'added_tokens.json', 'generation_config.json',
        'tokenizer.json', 'tokenizer.model'
    ]

    for fname in filenames:
        hf_hub_download(repo_id=model_id, filename=fname, use_auth_token=token)

    return pipeline(
        "text-generation",
        model=model_id,
        device=-1,
        torch_dtype="auto"
    )


def erstelle_prompt(text):
    return f"""
Lies den folgenden Text und erstelle daraus 20 Single-Choice-Fragen auf Deutsch.  
Jede Frage soll genau **vier Antwortmöglichkeiten** (a–d) enthalten, **von denen nur eine korrekt ist**.  
Formatiere die Ausgabe so:

1. Frage?
a) ...
b) ...
c) ...
d) ...
(Korrekt: b)

Text:
{text}

Fragen:
""".strip()


def parse_question_block(block, index, kapitel, kapitelnummer, modul, modulkürzel, vorlesung, vl):
    lines = [line.strip() for line in block.strip().split("\n") if line.strip()]
    if len(lines) < 2:
        return None

    frage = lines[0]
    antworten = []
    korrekt = None

    for line in lines[1:]:
        if re.match(r'^\s*[-–]?\s*[a-dA-D]\)', line):
            antworten.append(line.strip())
        elif "korrekt" in line.lower():
            match = re.search(r'[:\s]*([a-d])\)?', line.lower())
            if match:
                korrekt = match.group(1)

    answer_objs = []
    for ans in antworten:
        match = re.match(r'^([a-dA-D])\)\s*(.+)', ans)
        if match:
            key, text = match.groups()
            answer_objs.append({
                "text": f"{key.lower()}) {text}",
                "is_correct": key.lower() == korrekt
            })

    return {
        "id": f"{modulkürzel}-{vl}-k{kapitelnummer}-de-q{index + 1}",
        "content": frage,
        "answers": answer_objs,
        "chapter": kapitel,
        "lecture": vorlesung,
        "module": modul,
        "difficulty": None,
        "type": None,
        "language": "deutsch"
    }


def parse_all(text, kapitel, kapitelnummer, modul, modulkürzel, vorlesung, vl):
    blocks = re.split(r'\n(?=\d+\.\s)', text.strip())
    return [
        q for i, block in enumerate(blocks)
        if (q := parse_question_block(block, i, kapitel, kapitelnummer, modul, modulkürzel, vorlesung, vl))
    ]


def translate_questions(questions):
    translated = []
    for q in questions:
        translated_answers = [{
            "text": GoogleTranslator(source="de", target="en").translate(ans["text"]),
            "is_correct": ans["is_correct"]
        } for ans in q["answers"]]

        translated.append({
            "id": q["id"].replace("-de-", "-en-"),
            "content": GoogleTranslator(source="de", target="en").translate(q["content"]),
            "answers": translated_answers,
            "chapter": GoogleTranslator(source="de", target="en").translate(q["chapter"]),
            "lecture": GoogleTranslator(source="de", target="en").translate(q["lecture"]),
            "module": GoogleTranslator(source="de", target="en").translate(q["module"]),
            "difficulty": q["difficulty"],
            "type": q["type"],
            "language": "englisch"
        })
    return translated


if __name__ == "__main__":
    if len(sys.argv) < 8:
        print("Benutzung: python3 quiz.py <pdf> <kapitel> <kapitelnummer> <modul> <modulkürzel> <vorlesung> <vl>")
        sys.exit(1)

    pdf, kapitel, kapitelnummer, modul, modulkürzel, vorlesung, vl = sys.argv[1:8]

    lade_nltk_daten()
    text = lade_pdf_text(pdf)

    eigene_stopwords = {
        'professor', 'prof', 'seite', 'platzhalter', 'bild', 'titelfolie'
    }
    eigene_stopwords.update(finde_rauschende_woerter(text, set(stopwords.words('german'))))

    preprocessed = textverarbeitung(text, eigene_stopwords)

    pipe = lade_modell("google/gemma-3-1b-it", "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")

    prompt = erstelle_prompt(preprocessed)
    output = pipe(prompt, max_new_tokens=1500)
    generated = output[0]["generated_text"]
    questions_only = generated.replace(prompt, "").strip()

    de_questions = parse_all(questions_only, kapitel, kapitelnummer, modul, modulkürzel, vorlesung, vl)
    en_questions = translate_questions(de_questions)

    with open("fragen_de.json", "w", encoding="utf-8") as f:
        json.dump(de_questions, f, ensure_ascii=False, indent=2)

    with open("fragen_en.json", "w", encoding="utf-8") as f:
        json.dump(en_questions, f, ensure_ascii=False, indent=2)

    print("JSON-Dateien gespeichert: fragen_de.json, fragen_en.json")
    
    basename = os.path.splitext(os.path.basename(pdf))[0]
    
    output_json = f"/tmp/{basename}.json"
    upload_to_gcs(
      output_json,
      "edukit-tp.firebasestorage.app",
      f"question-jsons/{os.path.basename(output_json)}"
    )
