import os
from openai import OpenAI
from dotenv import load_dotenv

# Load API key from your .env file
load_dotenv()
api_key = os.getenv("7107bc6f625cf9b2765c4299e6a1af60a8eadc6ed26ef135240bd225957f2d58")

# --- IMPORTANT ---
# If your API key is NOT from Together.ai, you MUST change the base_url.
# If you don't know the URL, check your provider's documentation.
client = OpenAI(
    api_key=api_key,
    base_url="https://api.together.xyz/v1",
)

# --- ACTION REQUIRED: TRY DIFFERENT MODEL NAMES HERE ---
# Using a serverless model that should be available on Together.ai
# This is from their official serverless models list
MODEL_TO_TEST = "meta-llama/Llama-3.3-70B-Instruct-Turbo"
# ----------------------------------------------------

try:
    print(f"--- Testing model: {MODEL_TO_TEST} ---")
    completion = client.chat.completions.create(
        model=MODEL_TO_TEST,
        messages=[{"role": "user", "content": "Say 'Hello!'"}]
    )
    print("\nSUCCESS! This model works.")
    print("Response:", completion.choices[0].message.content)
except Exception as e:
    print("\nFAILED. This model did not work.")
    print("Error:", e)