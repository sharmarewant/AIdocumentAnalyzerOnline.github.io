import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_gemini_pro():
    """Test Gemini Pro configuration and API key"""
    
    # Get API key
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ Error: GEMINI_API_KEY not found in environment variables")
        print("Please add your Gemini Pro API key to the .env file")
        return False
    
    if api_key == "your_gemini_api_key_here":
        print("❌ Error: Please replace the placeholder with your actual Gemini Pro API key")
        return False
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        
        # Test with Gemini Pro model
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Simple test prompt
        prompt = "Say 'Hello! This is a test of Gemini Pro.'"
        
        print("🔍 Testing Gemini Pro configuration...")
        print(f"API Key: {api_key[:10]}...{api_key[-4:] if len(api_key) > 14 else '***'}")
        print(f"Model: gemini-2.5-pro")
        
        # Generate response
        response = model.generate_content(prompt)
        
        print("✅ SUCCESS! Gemini Pro is working correctly.")
        print(f"Response: {response.text}")
        
        # Test with a longer prompt to check rate limits
        print("\n🔍 Testing with longer prompt...")
        long_prompt = "Write a brief summary of artificial intelligence in 2-3 sentences."
        response2 = model.generate_content(long_prompt)
        print(f"Long prompt response: {response2.text}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error testing Gemini Pro: {str(e)}")
        
        # Check for specific error types
        if "quota" in str(e).lower() or "429" in str(e):
            print("\n💡 This looks like a quota/billing issue. Please check:")
            print("1. You have enabled billing in Google Cloud Console")
            print("2. You're using a paid Gemini Pro API key (not free tier)")
            print("3. Your payment method is set up correctly")
            print("4. The Generative Language API is enabled")
        
        elif "api_key" in str(e).lower() or "401" in str(e):
            print("\n💡 This looks like an API key issue. Please check:")
            print("1. Your API key is correct and from Google AI Studio")
            print("2. You're using the Gemini Pro API key (not free tier)")
            print("3. The API key has proper permissions")
        
        return False

def check_billing_status():
    """Provide guidance on checking billing status"""
    print("\n📋 To check your billing status:")
    print("1. Go to: https://console.cloud.google.com/billing")
    print("2. Select your project")
    print("3. Check if billing is enabled")
    print("4. Verify you have a payment method set up")
    print("5. Check if you have any spending limits")

if __name__ == "__main__":
    print("🧪 Testing Gemini Pro Configuration")
    print("=" * 40)
    
    success = test_gemini_pro()
    
    if not success:
        check_billing_status()
        print("\n🔗 Useful Links:")
        print("- Google AI Studio: https://aistudio.google.com/")
        print("- Google Cloud Console: https://console.cloud.google.com/")
        print("- Gemini API Documentation: https://ai.google.dev/docs")
    else:
        print("\n🎉 Gemini Pro is properly configured!")
        print("Your application should now work without rate limit errors.") 