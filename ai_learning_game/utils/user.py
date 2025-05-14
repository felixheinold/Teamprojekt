class User:
    def __init__(self, username, icon_path):
        self.username = username
        self.icon_path = icon_path
        self.progress = {}  # optional für spätere Nutzung
