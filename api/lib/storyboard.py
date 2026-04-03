from google import genai
import json

def generate_storyboard(script, persona_name, api_key):
    """Breaks down a script into timed visual segments with Flux prompts."""
    if not api_key:
        return None
        
    client = genai.Client(api_key=api_key)
    
    prompt = f"""
    You are a professional Storyboard Artist for viral short-form content.
    
    PERSONA: {persona_name}
    SCRIPT: {script}
    
    TASK:
    Break this script into 6-8 logical visual segments (approx 5-7 seconds each).
    For each segment, provide:
    1. Timestamp (e.g., 0:00 - 0:05)
    2. Visual Description (What happens on screen)
    3. Flux Prompt (A hyper-detailed prompt to generate this exact frame)
    
    Ensure the Flux prompts keep the persona's identity consistent.
    
    FORMAT:
    Return a list of objects in JSON format.
    """
    
    try:
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt,
        )
        # Extract JSON from response
        text = response.text
        json_start = text.find('[')
        json_end = text.rfind(']') + 1
        if json_start != -1 and json_end > json_start:
            return json.loads(text[json_start:json_end])
    except Exception as e:
        print(f"Storyboard Generation Error: {e}")
    return None
