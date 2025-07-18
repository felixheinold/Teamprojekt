# 📚 EduKIT-TP

**EduKIT-TP** ist eine interaktive Webanwendung zur spielerischen Prüfungsvorbereitung. Die Plattform basiert auf React (Vite) im Frontend, Node.js im Backend und wird über **Firebase** gehostet und deployed.

---

## 📁 Projektstruktur

```
main/
├── .github/               # GitHub Actions (CI/CD)
├── backend/               # Node.js / Express-API (optional)
├── edukit-tp-v2/          # React-Vite-Frontend
│   ├── public/            # Statische Assets
│   ├── src/               # Hauptcode der App (Pages, Komponenten, Hooks etc.)
│   ├── dist/              # Build-Output (wird automatisch erzeugt)
│   ├── settings.json      # Einstellungen und Modul-/Kapitel-Metadaten
│   └── vite.config.ts     # Vite-Konfiguration
├── functions/             # (optional) Firebase Functions (z. B. PDF-Upload)
├── firebase.json          # Firebase Konfiguration (Hosting & Functions)
├── .firebaserc.json       # Firebase Projektzuordnung
├── .gitignore             # Git-Konfig
└── README.md              # Diese Datei
```

---

## 🚀 Hosting & Deployment (Firebase)

- Das Projekt ist unter der Domain **[edukit-tp.me](https://edukit-tp.me)** erreichbar.
- Gehostet und deployed wird über **Firebase Hosting**.
- Das Verzeichnis `edukit-tp-v2/dist` wird automatisch als Root-Build-Ordner verwendet (siehe `firebase.json`).
- Das leere Projekt `edukit-tp` wurde in Firebase erstellt und dient aktuell als Container für das Hosting.
- Bei jedem Push auf den `main`-Branch wird automatisch ein **Redeploy über GitHub Actions** ausgelöst (CI/CD).

### 🔄 Automatisches Deployment

> ✅ Bei jedem Push auf `main` wird Firebase automatisch über GitHub neu deployed.  
> 🔁 Der jeweils aktuelle Build wird direkt auf der Produktionsdomain live geschaltet.

---

## 🧠 Lokale Entwicklung

### 🗃 Frontend starten

```bash
cd edukit-tp-v2
npm install
npm run dev
```

> Die App ist danach unter `http://localhost:5173` erreichbar.

### 🛠 Backend starten (optional)

---

## 🧠 Fragenstruktur

### 📂 Pfad

Alle Fragen liegen unter:

```
/questions/quiz/
```

### 📌 Dateibenennung

```
fragen_<modul>_<vorlesung>_<sprache>.json
```

**Beispiel:**

```bash
fragen_energy_vl1_de.json
fragen_fr_vl2_en.json
```

### 📀 Quiz-Fragenformat (Backend)

```json
{
  "id": "frage-id-123",
  "content": "Was ist die Hauptstadt von Frankreich?",
  "answers": [
    { "text": "Berlin", "is_correct": false },
    { "text": "Madrid", "is_correct": false },
    { "text": "Paris", "is_correct": true },
    { "text": "Rom", "is_correct": false }
  ],
  "lecture": "VL1",
  "module": "energy",
  "chapter": "Kapitel 1",
  "language": "de"
}
```

Diese werden in der App mit `mapToQuizQuestion()` ins Frontend-Format umgewandelt.

---

## 🧹 Features

- ✅ Minigames: Quiz & Gapfill
- 🌍 Mehrsprachigkeit (Deutsch/Englisch via i18n)
- 🧠 Merkliste („Frage später wiederholen“)
- 📈 Fortschrittsstatistiken pro Kapitel
- ⏳ Zeitlimit & Punktevergabe
- 🎵 Sounds & visuelles Feedback
- ↺ Automatischer Redeploy bei Änderungen (`main`)

---

## 📦 Verwendete Technologien

- [React + Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase Hosting](https://firebase.google.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [i18next](https://www.i18next.com/)
- [React Router](https://reactrouter.com/)
