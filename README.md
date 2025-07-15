### Informationen zu Hosting+Firebase:

- "edukit-tp" stellt ein leeres React-Projekt dar, das aktuell auf der Domain "edukit-tp.me" gehostet wird
- Firebase deployed genau das Projekt, dessen build-Ordner in "firebase.json" hinterlegt ist.
- "edukit-tp" kann später entweder ersetzt oder aber mit entsprechenden Files ergänzt werden
- bei jedem push auf den Branch main wird firebase automatisch durch GitHub redeployed

### Hier kurz der Gameplan aufgelistet für einen groben Überlick

# AI-Assisted Learning Game

An educational app/video game powered by deep learning, designed to teach concepts from the media industry — or another approved field — in an engaging and interactive way.

## 🎯 Project Goal

To develop a 2D or 3D educational game or app that uses artificial intelligence to assist users in the learning process. The game will include a deep learning model, such as a language model or content generator, embedded into the user experience (e.g., as an NPC tutor or in-game assistant).

## 🎮 Game Concepts

This project explores multiple mini-games that support learning through interaction. Below are some initial game design ideas:

### 1. Klassisches Quizduell (Baseline)

- Multiple choice questions with 4 answer options
- Players have a fixed time (e.g., 10 seconds) to respond
- Questions are categorized (e.g., by lecture chapters)
- Scoring: Correct answers and faster response times yield more points
- Answer validation using structured data (e.g., JSON: `"richtig": "C"`)
- Modes: Single-player or versus AI

### 2. Lückentext-Spiel (Fill-in-the-Blank)

- Short educational text with 1–2 missing terms
- Players drag and drop or select correct terms
- Example: “Die Bilanz besteht aus **_ und _**.”
- Validation through comparison with expected terms (e.g., `["Aktiva", "Passiva"]`)

### 3. Memory mit Fachbegriffen (Memory Match Game)

- Classic memory game with a learning twist
- Cards show either a term and its definition, or a question and its correct answer
- Players flip two cards per turn; matched pairs disappear
- Matching logic based on defined pairs (e.g., `"Umlaufvermögen": "Vermögen, das nicht dauerhaft dem Unternehmen dient"`)

More mini-games may be developed based on user testing and feedback.

## 📌 Task Description

This project is part of a university course assignment with the following goals:

- Design and develop an AI-assisted educational application or video game.
- Implement deep learning algorithms (e.g., fine-tuned language models, RAG, etc.) into the application.
- Focus on learning topics relevant to the media industry, or another approved topic.
- Create a dataset for training the model, then fine-tune and integrate the model into the game.
- Ensure the final product works effectively through testing.

## 🚀 Implementation Plan

### 1. Research

- Game mechanics and educational app structure
- Suitable deep learning techniques (LLMs, RAG, transformers, etc.)

### 2. Design

- Define the game concept and educational goals
- Choose between 2D or 3D environment based on complexity and hardware limits

### 3. Development

- Build the basic game structure using chosen game engine or framework
- Implement AI features (e.g., an NPC assistant using a fine-tuned LLM)

### 4. AI Integration

- Create and preprocess a custom dataset
- Fine-tune a deep learning model using the dataset
- Integrate the trained model into the game (via local inference or API)

### 5. Testing

- User and system testing to ensure performance and educational value

## 🔧 Technologies & Tools

- **Programming Language**: Python (for ML components), possibly C#/JavaScript (for game logic)
- **Game Engine**: Unity, Godot, Unreal Engine, or custom-built
- **Deep Learning Frameworks**: PyTorch, Hugging Face Transformers
- **Model Types**: BERT variants, GPT-like models, Retrieval-Augmented Generation (RAG)
- **Platform**: Linux (for training on bwUniCluster), Windows/macOS (for development)

## 📁 Repository Structure

```bash
ai-learning-game/
├── data/                 # Dataset for model training
├── models/               # Fine-tuned model checkpoints
├── game/                 # Game or app source code
├── ai/                   # AI integration (model loading, API)
├── docs/                 # Design documents, notes
├── tests/                # Test scripts
└── README.md             # Project overview
```
