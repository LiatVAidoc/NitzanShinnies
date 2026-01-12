import traceback

from typing import Tuple

from flask import Flask, Response, jsonify, request

from services.dicom_read_service import DicomReadService

app = Flask(__name__)

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
    except Exception as e:
        # Log the full traceback for debugging
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8080) # pragma: no cover
