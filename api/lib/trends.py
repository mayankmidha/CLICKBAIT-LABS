from ddgs import DDGS
import json

def get_hot_trends(niche):
    """Scrapes the live web for breaking trends in a specific niche."""
    query = f"breaking trending news and viral topics in {niche} 2026"
    results = []
    
    try:
        with DDGS() as ddgs:
            # We use news search for higher signal-to-noise ratio
            news_results = ddgs.news(query, max_results=5)
            for r in news_results:
                results.append({
                    "title": r['title'],
                    "source": r['source'],
                    "snippet": r['body'],
                    "url": r['url']
                })
    except Exception as e:
        print(f"Trend Engine Error: {e}")
        
    return results

def get_viral_angle(trend_title, api_key):
    """Uses Gemini to find the most 'Clickbait' angle for a trending topic."""
    # This will be integrated into the app.py call
    pass
