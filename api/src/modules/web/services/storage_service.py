from src.config import storage_bucket, Config
from src.shared.exceptions import ValidationError
from datetime import timedelta
import uuid


class StorageService:
    """Service for handling Cloud Storage operations"""
    
    @staticmethod
    def upload_audio(user_id, audio_file, file_extension='webm'):
        """
        Upload audio file to Cloud Storage
        
        Args:
            user_id: User ID
            audio_file: File object
            file_extension: File extension
            
        Returns:
            tuple: (blob_name, public_url)
        """
        # Validate file extension
        if file_extension not in Config.ALLOWED_AUDIO_FORMATS:
            raise ValidationError(f"Invalid file format. Allowed: {', '.join(Config.ALLOWED_AUDIO_FORMATS)}")
        
        # Generate unique filename
        blob_name = f"audio/{user_id}/{uuid.uuid4()}.{file_extension}"
        
        # Create blob
        blob = storage_bucket.blob(blob_name)
        
        # Upload file
        blob.upload_from_file(
            audio_file,
            content_type=f'audio/{file_extension}'
        )
        
        # Make public (or use signed URLs for private access)
        blob.make_public()
        public_url = blob.public_url
        
        return blob_name, public_url
    
    @staticmethod
    def generate_signed_url(blob_name, expiration_hours=24):
        """
        Generate signed URL for private file access
        
        Args:
            blob_name: Name of the blob
            expiration_hours: URL expiration time in hours
            
        Returns:
            str: Signed URL
        """
        blob = storage_bucket.blob(blob_name)
        
        url = blob.generate_signed_url(
            version="v4",
            expiration=timedelta(hours=expiration_hours),
            method="GET"
        )
        
        return url
    
    @staticmethod
    def delete_audio(blob_name):
        """Delete audio file from storage"""
        try:
            blob = storage_bucket.blob(blob_name)
            blob.delete()
            return True
        except Exception as e:
            print(f"Failed to delete blob {blob_name}: {str(e)}")
            return False
    
    @staticmethod
    def get_file_size(blob_name):
        """Get file size in bytes"""
        blob = storage_bucket.blob(blob_name)
        blob.reload()
        return blob.size