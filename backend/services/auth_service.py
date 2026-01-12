import secrets
from typing import Dict, Optional

from interfaces import IDPPlugin
from plugins.mock_idp_plugin import MockIDPPlugin

class AuthService:
    def __init__(self, idp_plugin: Optional[IDPPlugin] = None):
        # In a real app, we might load the plugin based on config
        self.idp_plugin = idp_plugin or MockIDPPlugin()
        self.sessions = {} # specific to this instance, simple in-memory session store

    def get_login_url(self) -> str:
        state = secrets.token_urlsafe(16)
        # Store state to verify later if needed, though simple mock might skip strict state validation
        return self.idp_plugin.get_login_url(state)

    def handle_callback(self, code: str) -> Dict:
        user_info = self.idp_plugin.exchange_code(code)
        # Create a session
        session_id = secrets.token_hex(16)
        self.sessions[session_id] = user_info
        return {
            "session_id": session_id,
            "user": user_info
        }

    def get_user_from_session(self, session_id: str) -> Optional[Dict]:
        return self.sessions.get(session_id)

    def logout(self, session_id: str) -> None:
        if session_id in self.sessions:
            del self.sessions[session_id]
