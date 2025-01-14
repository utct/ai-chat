from flask import Flask, request, jsonify
from flask_cors import CORS
from query_data import query_data  
import os

app = Flask(__name__)
CORS(app)  

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    query_text = data.get("query")
    if not query_text:
        return jsonify({"error": "Query text is required"}), 400

    try:
        response = query_data(query_text) 
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/", methods=["GET"])
def index():
    return "Chatbot backend is running!", 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
