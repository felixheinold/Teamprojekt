from kivy.app import App
from kivy.uix.screenmanager import ScreenManager
from kivy.lang import Builder
import os

from screens.login_screen import LoginScreen
from screens.topic_screen import TopicScreen
from screens.minigame_selection_screen import MiniGameSelectionScreen

class AIApp(App):
    def build(self):
        self.icon = "assets/icons/default_user.png"
        self.sm = ScreenManager()
        self.user = None  # Benutzerobjekt wird beim Login gesetzt

        self.load_kv_files()

        # Screens registrieren
        screens = [
            LoginScreen(name="login"),
            TopicScreen(name="topic"),
            MiniGameSelectionScreen(name="minigame")
        ]
        for screen in screens:
            self.sm.add_widget(screen)

        self.sm.current = "login"
        return self.sm

    def load_kv_files(self):
        """Lädt alle .kv-Dateien aus dem 'kv'-Verzeichnis."""
        kv_path = os.path.join(os.path.dirname(__file__), 'kv')
        kv_files = [
            "login_screen.kv",
            "topic_screen.kv",
            "minigame_selection.kv"
        ]
        for file in kv_files:
            full_path = os.path.join(kv_path, file)
            if os.path.exists(full_path):
                Builder.load_file(full_path)
            else:
                print(f"[WARNUNG] Konnte Datei nicht laden: {full_path}")

    def change_screen(self, screen_name):
        """Wechsle zu einem existierenden Screen."""
        if self.sm.has_screen(screen_name):
            self.sm.current = screen_name
        else:
            print(f"[FEHLER] Screen '{screen_name}' existiert nicht.")

if __name__ == '__main__':
    AIApp().run()
