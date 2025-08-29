
import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai

app = Flask(__name__)

API_KEY = "YOUR_GOOGLE_API_KEY_HERE"  # Replace with your actual API key

try:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(f"Error configuring Google Generative AI: {e}")

    model = None

@app.route('/')
def home():
    """Renders the main chatbot HTML page."""
    return render_template('index.html')


@app.route('/chat', methods=['POST'])
def chat():
    """Handles the chat logic."""
    if not model:
        return jsonify({'error': 'The generative AI model is not configured. Please check your API key.'}), 500

    try:
        user_message = request.json['message']
        if not user_message:
            return jsonify({'reply': 'Please enter a message.'})

        response = model.generate_content(user_message)
        return jsonify({'reply': response.text})

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'reply': 'Sorry, an error occurred while processing your request.'}), 500


if __name__ == '__main__':
    app.run(debug=True)