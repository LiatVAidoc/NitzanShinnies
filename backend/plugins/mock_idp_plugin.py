from typing import Dict
from interfaces import IDPPlugin

class MockIDPPlugin(IDPPlugin):
    def get_login_url(self, state: str) -> str:
        # In a real OIDC flow, this would point to the IDP's authorization endpoint.
        # For the mock, we'll just redirect back to our callback with a dummy code.
        # We assume the frontend or the "IDP" (us in this case) handles the redirect.
        # Since we are mocking the IDP *interaction*, the "login url" is effectively 
        # a URL that immediately redirects back to the app's callback URL.
        # However, typically the Browser goes to IDP -> User logs in -> IDP redirects to Callback.
        # Here we will simulate: Browser goes to /api/auth/mock-login-page -> Redirects to Callback.
        # But to keep it simple as per requirements "not gonna bother... mock one":
        # We can return a URL that the frontend can follow which immediately "logs them in".
        
        # Actually, let's make it slightly more realistic. 
        # The "Login URL" is a URL on THIS server that sets a mock cookie or just redirects 
        # to the callback with a specific code.
        
        # Let's say we redirect to a special 'mock-idp' route on our server 
        # that simulates the user clicking "Yes I agree" on the IDP.
        # But wait, the interface says `get_login_url`. 
        # If I return `http://localhost:8080/mock-idp/authorize?state=...`, 
        # the user goes there.
        
        return f"http://localhost:8080/mock-idp/authorize?state={state}"

    def exchange_code(self, code: str) -> Dict[str, str]:
        if code == "mock_auth_code":
            return {
                "sub": "mock_user_123",
                "email": "doctor@aidoc.com",
                "name": "Dr. Ai Doc"
            }
        raise ValueError("Invalid mock code")
