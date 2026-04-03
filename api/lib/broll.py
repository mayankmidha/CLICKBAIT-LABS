import requests
import os

def fetch_broll(keyword, api_key):
    """Searches Pexels for stock video and returns the best download URL."""
    if not api_key:
        return None
        
    url = f"https://api.pexels.com/videos/search?query={keyword}&per_page=1"
    headers = {"Authorization": api_key}
    
    try:
        response = requests.get(url, headers=headers)
        data = response.json()
        if data['videos']:
            # Get the best quality mobile-friendly video (9:16)
            video_files = data['videos'][0]['video_files']
            # Sort by width, ideally around 720-1080
            best_link = video_files[0]['link']
            return best_link
    except Exception as e:
        print(f"B-Roll Fetch Error: {e}")
    return None

def download_clip(url, filename):
    """Downloads the video clip locally."""
    save_path = os.path.expanduser(f"~/ClickbaitLabsAI/broll/{filename}.mp4")
    try:
        r = requests.get(url, stream=True)
        with open(save_path, 'wb') as f:
            for chunk in r.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
        return save_path
    except Exception as e:
        print(f"Download Error: {e}")
    return None
