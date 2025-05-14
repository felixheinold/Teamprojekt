# AI-Assisted Learning Game

An educational app/video game powered by deep learning, designed to teach concepts from the media industry — or other chosen fields — in an engaging and interactive way.

## 🎯 Project Goal

To develop a 2D or 3D educational game or app that uses artificial intelligence to assist users in the learning process. The game will include a deep learning model, such as a language model or content generator, embedded into the user experience (e.g., as an NPC tutor or in-game assistant).

## 📌 Task Description

This project is part of a university course assignment with the following goals:

- Design and develop an AI-assisted educational application or video game.
- Implement deep learning algorithms (e.g., fine-tuned language models, RAG, etc.) into the application.
- Focus on learning topics relevant to the media industry, or another approved topic.
- Create a dataset for training the model, then fine-tune and integrate the model into the game.
- Ensure the final product works effectively through testing.

## 🧠 Learning Objectives

- App/Game Design (2D or 3D)
- Use of AI models for interaction (e.g., LLMs like BERT variants, GPT)
- Data collection and fine-tuning of deep learning models
- Software development in Python or other preferred languages
- Familiarization with tools like Unity/Unreal Engine or lightweight engines
- Testing and deploying the application

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

