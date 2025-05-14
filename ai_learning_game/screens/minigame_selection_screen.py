from kivy.uix.screenmanager import Screen
from kivy.app import App

class MiniGameSelectionScreen(Screen):
    def on_enter(self):
        app = App.get_running_app()
        selected = getattr(app, "selected_module", "Kein Modul ausgewählt")
        self.ids.module_label.text = f"Modul: {selected}"

    def start_game(self, game_type):
        print(f"Spiel gestartet: {game_type}")
