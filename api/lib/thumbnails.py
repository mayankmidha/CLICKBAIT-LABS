import json
from google import genai

def generate_thumbnail_prompt(script_summary, persona_name, api_key):
    """Uses AI to design a high-CTR thumbnail prompt for Flux."""
    if not api_key:
        return None
        
    client = genai.Client(api_key=api_key)
    
    system_prompt = f"""
    You are a world-class YouTube Thumbnail Designer.
    Your goal is to design a high-CTR (Click-Through Rate) visual concept for a video.
    
    PERSONA: {persona_name}
    VIDEO CONTEXT: {script_summary}
    
    DESIGN RULES:
    1. Focus on a "Close-up" of the character with an intense facial expression (Shock, Anger, or Extreme Joy).
    2. Add a "Pattern Interrupt" object (e.g., a glowing phone, a stack of cash, a mysterious black box).
    3. Use "Contrasting Colors" (e.g., Purple neon against a dark background).
    4. Provide a text overlay idea (max 3 words).
    
    OUTPUT: 
    A single hyper-detailed image generation prompt for Flux.1-dev.
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=system_prompt,
        )
        return response.text
    except Exception as e:
        print(f"Thumbnail Prompt Error: {e}")
        return None
