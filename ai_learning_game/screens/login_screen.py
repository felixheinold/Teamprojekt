from kivy.uix.screenmanager import Screen
from kivy.app import App
from utils.user import User

class LoginScreen(Screen):
    def create_account(self, username):
        username = username.strip()
        if username:
            app = App.get_running_app()
            app.user = User(username=username, icon_path="assets/icons/default_user.png")
            print(f"Benutzer erstellt: {username}, Icon: {app.user.icon_path}")
            self.manager.current = "topic"  # Achte darauf, dass es einen Screen namens "topic" gibt
        else:
            print("Bitte Benutzername eingeben!")  # Oder nutze ein Popup oder Label für Rückmeldung
