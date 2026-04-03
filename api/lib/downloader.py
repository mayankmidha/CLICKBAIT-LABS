from huggingface_hub import hf_hub_download
import os

repo_id = "black-forest-labs/FLUX.1-dev"
filename = "flux1-dev-fp8.safetensors"
local_dir = os.path.expanduser("~/ComfyUI/models/checkpoints")

print(f"🚀 Clickbait Labs: Resuming High-Fidelity Intelligence Download...")
print(f"Target: {filename}")

try:
    path = hf_hub_download(
        repo_id=repo_id,
        filename=filename,
        local_dir=local_dir,
        local_dir_use_symlinks=False,
        resume_download=True
    )
    print(f"✅ SUCCESS: Model downloaded to {path}")
except Exception as e:
    print(f"❌ DOWNLOAD ERROR: {e}")
    # Fallback to a community-mirrored version if the official one is blocked
    print("Attempting fallback mirror...")
    try:
        hf_hub_download(
            repo_id="Kijai/flux-fp8",
            filename="flux1-dev-fp8.safetensors",
            local_dir=local_dir,
            local_dir_use_symlinks=False,
            resume_download=True
        )
        print("✅ SUCCESS: Fallback mirror download complete.")
    except Exception as e2:
        print(f"❌ FALLBACK ERROR: {e2}")
