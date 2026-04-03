import os
import json
from instagrapi import Client
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

def post_to_instagram(video_path, caption, session_id):
    """Posts a video as a Reel using a session ID."""
    try:
        cl = Client()
        cl.login_by_sessionid(session_id)
        media = cl.clip_upload(video_path, caption)
        return {"status": "success", "media_id": media.pk}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def post_to_youtube(video_path, title, description, refresh_token):
    """Posts a video as a YouTube Short."""
    # Placeholder for YouTube OAuth logic
    # In a real app, we'd use the refresh_token to get a new access_token
    return {"status": "success", "video_id": "yt_placeholder_id"}

def auto_distribute(video_path, persona_metadata, credentials):
    """Distributes content to all linked platforms for a persona."""
    results = {}
    
    if persona_metadata.get('insta_id') and credentials.get('insta_session_id'):
        results['instagram'] = post_to_instagram(
            video_path, 
            f"{persona_metadata['name']} original. #ai #tech #viral", 
            credentials['insta_session_id']
        )
        
    return results
