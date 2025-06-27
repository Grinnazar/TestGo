import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

app = Flask(__name__)

# Configure the Gemini API
try:
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    if not gemini_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    if gemini_api_key == "YOUR_API_KEY":
        print("WARNING: Please replace 'YOUR_API_KEY' with your actual Gemini API key in the .env file.")
    genai.configure(api_key=gemini_api_key)
    gemini_model_name = os.getenv("GEMINI_MODEL", "gemini-pro") # Default to gemini-pro if not set
    model = genai.GenerativeModel(gemini_model_name)
    print(f"Successfully configured Gemini API with model: {gemini_model_name}")
except ValueError as e:
    print(f"ERROR: {e}")
    model = None
except Exception as e:
    print(f"An unexpected error occurred during Gemini configuration: {e}")
    model = None

@app.route('/')
def index():
    """Serve the main HTML page."""
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages from the user and respond using Gemini API."""
    try:
        user_message = request.json.get('message')
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400

        if model is None:
            return jsonify({'reply': 'Gemini API is not configured. Please check the server logs.'}), 500

        # Basic instruction to the model. This can be expanded.
        # For more complex scenarios, consider using a chat session: `model.start_chat()`
        prompt = f"You are a helpful AI travel planner. The user said: \"{user_message}\". Respond helpfully and concisely."

        try:
            # For simple non-chat prompts, generate_content is preferred.
            # For conversational history, model.start_chat() and chat.send_message() would be used.
            response = model.generate_content(prompt)
            bot_reply = response.text
        except Exception as e:
            app.logger.error(f"Error generating content with Gemini: {e}")
            # Check for specific error types if available from the Gemini SDK
            if "API key not valid" in str(e): # This is a hypothetical error message string
                 return jsonify({'reply': 'Error: The Gemini API key is not valid. Please check your .env file.'}), 500
            return jsonify({'reply': f'Sorry, I encountered an error trying to reach the Gemini API: {str(e)}'}), 500

        return jsonify({'reply': bot_reply})

    except Exception as e:
        app.logger.error(f"Error in /chat endpoint: {e}")
        return jsonify({'error': f'An internal server error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    # Note: For production, use a proper WSGI server like Gunicorn or Waitress.
    # The debug mode should be False in production.
    app.run(debug=True, port=5000)
