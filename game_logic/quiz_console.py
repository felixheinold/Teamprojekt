import os
from sqlmodel import SQLModel, Field, create_engine, Session, select
from typing import Optional
import random
import json

HIGHSCORE_FILE = "highscore.txt"

# Datenmodell
class Question(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    subject: str
    chapter: str
    type: str
    question: str
    option_a: Optional[str] = ""
    option_b: Optional[str] = ""
    option_c: Optional[str] = ""
    option_d: Optional[str] = ""
    answer: str

# SQLite-Datenbank
engine = create_engine("sqlite:///questions_all.db")
SQLModel.metadata.create_all(engine)

# Fragen aus JSON-Datei importieren
def import_questions_from_json(filename: str):
    with open(filename, "r", encoding="utf-8") as file:
        data = json.load(file)
    with Session(engine) as session:
        existing_questions = session.exec(select(Question.question)).all()
        added_count = 0
        for entry in data:
            if entry["question"] not in existing_questions:
                q = Question(**entry)
                session.add(q)
                added_count += 1
        session.commit()
    print(f"{added_count} neue Fragen aus '{filename}' importiert.")

# Fragen filtern
def get_questions(subject, chapter, q_type):
    with Session(engine) as session:
        stmt = select(Question).where(
            Question.subject.ilike(subject),
            Question.type.ilike(q_type)
        )
        if chapter:
            stmt = stmt.where(Question.chapter.ilike(chapter))
        return session.exec(stmt).all()

# Highscore lade
def load_highscore():
    if not os.path.exists(HIGHSCORE_FILE):
        return 0
    with open(HIGHSCORE_FILE, "r") as f:
        try:
            return int(f.read().strip())
        except ValueError:
            return 0

# Highscore speichern
def save_highscore(score):
    with open(HIGHSCORE_FILE, "w") as f:
        f.write(str(score))

# Quiz starten
def run_quiz():
    print("🎮 Willkommen zum Quiz!")
    
    while True:
        current_highscore = load_highscore()
        print ("\n 🎮 Neue Runde")
        print(f"⭐ Aktueller Highscore: {current_highscore} Punkte")
        subject = input("Fach (z.B. Marketing, Finance, Rechnungswesen): ").strip()
        chapter_input = input("Kapitel (Nummer z.B. 1, 2, 3 oder alle): ").strip()
        chapter = None if chapter_input == "alle" else f"Kapitel {chapter_input}"
        q_type = input("Fragetyp (single-choice / true-false / gap-fill): ").strip().lower()

        # Wähle entsprechende JSON-Datei
        if q_type == "true-false":
            import_questions_from_json("fragen_true_false.json")
        elif q_type == "gap-fill":
            import_questions_from_json("fragen_gap_fill.json")
        elif q_type == "single-choice":
            import_questions_from_json("fragen_single_choice.json")

        questions = get_questions(subject, chapter, q_type)
        if not questions:
            print("⚠️Keine passenden Fragen gefunden.")
            return

        try:
            max_questions = int(input(f"Wieviele Fragen? (Max: {len(questions)}): "))
            max_questions = min(max_questions, len(questions))
        except ValueError:
            max_questions = len(questions)

        score = 0
        for i, q in enumerate(random.sample(questions, max_questions)):
            print(f"\nFrage {i+1}: {q.question}")

            if q.type == "single-choice":
                print(f"A: {q.option_a}")
                print(f"B: {q.option_b}")
                if q.option_c: print(f"C: {q.option_c}")
                if q.option_d: print(f"D: {q.option_d}")
                answer = input("Deine Antwort (A/B/C/D): ").strip().upper()
                correct = (answer == q.answer)

            elif q.type == "true-false":
                print(f"W: {q.option_a}")
                print(f"F: {q.option_b}")
                user_input = input("Antwort (W/F): ").strip().lower()

                if user_input == "w":
                    user_answer = "A"  # W = Wahr = A
                elif user_input == "f":
                    user_answer = "B"  # F = Falsch = B
                else:
                    print("⚠️ Ungültige Eingabe – Frage wird übersprungen.")
                    continue
    
                correct = (user_answer == q.answer.upper())

            elif q.type == "gap-fill":
                user_input = input("Ergänze die Lücke: ").strip().lower()
                correct = (user_input == q.answer.lower())

            else:
                print("Unbekannter Fragetyp.")
                continue

            if correct:
                print("✅ Richtig!")
                score += 10
            else:
                print(f"❌ Falsch. Richtige Antwort: {q.answer}")

        new_total = current_highscore + score
        save_highscore(new_total) 

        print(f"\n🏁 Runde beendet. Punkte: {score}")
        print(f"🎯 Neuer Highscore: {new_total}")

        weiterspielen = input("\n🎲 Weitere Runde spielen? (ja/nein): ").strip().lower()
        if weiterspielen != "ja":
            print("👋 Danke fürs Spielen!")
            break

# Einstiegspunkt
if __name__ == "__main__":
    run_quiz()


