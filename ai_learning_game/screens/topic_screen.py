from kivy.uix.screenmanager import Screen
from kivy.app import App

class TopicScreen(Screen):
    def on_enter(self):
        app = App.get_running_app()  # ✅ hinzugefügt
        user = app.user
        if user:
            print(f"Willkommen {user.username}, Icon: {user.icon_path}")
        else:
            print("Kein Benutzer gefunden.")

    def select_module(self, module_name):
        app = App.get_running_app()  # ✅ richtige Einrückung
        if app.user:
            app.selected_module = module_name
            print(f"Modul ausgewählt: {module_name}")
            self.manager.current = "minigame"
        else:
            print("Fehler: Kein Benutzer vorhanden.")
