from dotenv import load_dotenv
load_dotenv()

import cloudinary
from cloudinary import CloudinaryImage
import cloudinary.uploader
import cloudinary.api
import json
from fastapi.responses import JSONResponse

config = cloudinary.config(secure=True)
def uploadImage(file):
    # Upload the image.
    # Set the asset's public ID and allow overwriting the asset with new versions
    try: 
        response = cloudinary.uploader.upload(file, unique_filename = False, overwrite=True)
        return response
    except Exception:
        return None
    

def get_url(response):
    try:
        return response["secure_url"]
    except Exception:
        return None