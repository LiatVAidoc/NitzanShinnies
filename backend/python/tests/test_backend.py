from app import app

def test_health_endpoint():
    test_app = app.test_client()
    test_app.testing = True
    
    response = test_app.get('/health')
    assert response.status_code == 200