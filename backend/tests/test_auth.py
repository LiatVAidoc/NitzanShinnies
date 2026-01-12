import pytest
from app import app
from services.auth_service import AuthService
from plugins.mock_idp_plugin import MockIDPPlugin

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_login_url(client):
    response = client.get('/api/auth/login')
    assert response.status_code == 200
    data = response.get_json()
    assert 'loginUrl' in data
    assert 'mock-idp/authorize' in data['loginUrl']

def test_auth_callback_success(client):
    # Test valid code
    response = client.post('/api/auth/callback', json={'code': 'mock_auth_code'})
    assert response.status_code == 200
    data = response.get_json()
    assert 'session_id' in data
    assert 'user' in data
    assert data['user']['email'] == 'doctor@aidoc.com'

def test_auth_callback_failure(client):
    # Test invalid code
    response = client.post('/api/auth/callback', json={'code': 'invalid_code'})
    assert response.status_code == 400 # Or 500 depending on implementation, let's see. 
    # In my implementation: 
    # result = auth_service.handle_callback(code) -> calls plugin.exchange_code -> raises ValueError
    # app.py catches Exception -> 500.
    
    # Wait, let's update test expectation to match implementation or update implementation to be cleaner.
    # Current implementation returns 500 on generic exception. 
    assert response.status_code == 400

def test_mock_idp_authorize_redirect(client):
    response = client.get('/mock-idp/authorize?state=123')
    assert response.status_code == 302
    assert 'http://localhost:3000/callback' in response.location
