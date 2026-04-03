import whisper
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip
import os

def generate_subtitles(video_path, output_path):
    """Transcribes audio and overlays high-energy animated subtitles."""
    # 1. Load Whisper Model (Base is fast and good for clear speech)
    model = whisper.load_model("base")
    
    # 2. Transcribe
    result = model.transcribe(video_path)
    segments = result['segments']
    
    video = VideoFileClip(video_path)
    subtitle_clips = []
    
    for segment in segments:
        text = segment['text'].strip().upper()
        start = segment['start']
        end = segment['end']
        duration = end - start
        
        # 3. Create High-Energy Text Clip (Hormozi Style)
        txt_clip = (TextClip(text, fontsize=70, color='yellow', font='Helvetica-Bold', 
                            stroke_color='black', stroke_width=2, method='caption', size=video.size)
                    .set_start(start)
                    .set_duration(duration)
                    .set_position(('center', 'center'))) # Middle of screen for max impact
        
        subtitle_clips.append(txt_clip)
    
    # 4. Composite and Export
    result_video = CompositeVideoClip([video] + subtitle_clips)
    result_video.write_videofile(output_path, codec="libx264", audio_codec="aac")
    return output_path
