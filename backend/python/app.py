from flask import Flask, request, jsonify
from dicom_parser import DicomParser

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"message": "The server is running"}), 200

if __name__ == '__main__':
    app.run(debug=True)
