# EduKIT – GUI

Dieser Branch enthält das **grafische Benutzerinterface** (GUI) für die Lernplattform *EduKIT*.  
Er basiert auf **React**, **Bootstrap**, und bietet grundlegende Seiten und Navigation für das Lernsystem.

## ✨ Features

- 📋 **Registrierungsseite** mit festem Profilbild
- 🧭 Navigation zwischen:
  - Modulauswahl
  - Kapitelübersicht
  - Minigame-Wahl
- 🎨 Layout zentriert mit Bootstrap-Klassen

## 📁 Projektstruktur
src/
├── assets/ # Bilder & Icons
│ └── profile.png
├── pages/ # GUI-Seiten
│ ├── Register.tsx
│ ├── Modules.tsx
│ ├── Chapters.tsx
│ └── Minigames.tsx
├── App.tsx # Routing
├── Layout.tsx # Zentrale Navigation
└── main.tsx

## 🛠️ Lokale Entwicklung starten

```bash
npm install
npm run dev
