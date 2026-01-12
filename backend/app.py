import traceback

from typing import Tuple

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from interfaces import NotFoundError

from services.dicom_read_service import DicomReadService
from services.auth_service import AuthService

app = Flask(__name__)
CORS(app) # Enable CORS for all routes
auth_service = AuthService()

@app.route('/health', methods=['GET'])
def health() -> Tuple[Response, int]:
    return jsonify({"message": "The server is running"}), 200

@app.route('/api/dicom-metadata', methods=['POST'])
def get_dicom_metadata() -> Tuple[Response, int]:
    try:
        data = request.get_json()
        source_path = data.get('path')
        fields = data.get('fields')
        
        if not source_path:
            return jsonify({"error": "Missing 'path' parameter"}), 400
            
        service = DicomReadService()
        metadata = service.get_metadata(source_path, fields=fields)
        
        return jsonify(metadata), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except NotFoundError as e:
        return jsonify({"error": str(e)}), 404
    except Exception as e:
        # Log the full traceback for debugging
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route('/api/common-fields', methods=['GET'])
def get_common_fields() -> Tuple[Response, int]:
    try:
        service = DicomReadService()
        fields = service.get_common_fields()
        return jsonify(fields), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/login', methods=['GET'])
def login() -> Tuple[Response, int]:
    url = auth_service.get_login_url()
    return jsonify({"loginUrl": url}), 200

@app.route('/api/auth/callback', methods=['POST'])
def auth_callback() -> Tuple[Response, int]:
    try:
        data = request.get_json()
        code = data.get('code')
        if not code:
            return jsonify({"error": "Missing code"}), 400
            
        result = auth_service.handle_callback(code)
        return jsonify(result), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@app.route('/api/auth/logout', methods=['POST'])
def logout() -> Tuple[Response, int]:
    data = request.get_json()
    session_id = data.get('session_id')
    auth_service.logout(session_id)
    return jsonify({"status": "logged out"}), 200

@app.route('/mock-idp/authorize', methods=['GET'])
def mock_idp_authorize() -> Tuple[Response, int]:
    # Simulate IDP redirecting back to the app (frontend callback)
    # The frontend is running on localhost:3000 (usually)
    # This mock IDP immediately authorizes perfectly.
    from flask import redirect
    frontend_callback = "http://localhost:3000/callback?code=mock_auth_code"
    return redirect(frontend_callback)

if __name__ == '__main__':
    app.run(debug=True, port=8080) # pragma: no cover
