import os
from google.cloud import firestore, storage
from google.oauth2 import service_account
from dotenv import load_dotenv

# Load environment variables from api/.env
load_dotenv()


class Config:
    """Base configuration"""
    
    # Flask
    
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-this')
    DEBUG = False
    TESTING = False
    FIRESTORE_DATABASE_NAME = os.getenv('FIRESTORE_DATABASE_NAME', '(default)')
    TIMEZONE = 'Africa/Lagos'
    
    # GCP
    GCP_PROJECT_ID = os.getenv('GCP_PROJECT_ID')
    GCP_CREDENTIALS_PATH = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    STORAGE_BUCKET_NAME = os.getenv('STORAGE_BUCKET_NAME')
    
    # Email
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', 'noreply@articulateapp.com')
    
    # Frontend
    FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    # LLM
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    ANTHROPIC_API_KEY = os.getenv('ANTHROPIC_API_KEY')
    
    # File Upload
    MAX_AUDIO_SIZE_MB = int(os.getenv('MAX_AUDIO_SIZE_MB', 10))
    ALLOWED_AUDIO_FORMATS = os.getenv('ALLOWED_AUDIO_FORMATS', 'webm,mp3,wav,m4a').split(',')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}


def initialize_gcp_services():
    """Initialize Google Cloud Platform services"""
    
    # Load credentials if path provided
    credentials = None
    if Config.GCP_CREDENTIALS_PATH and os.path.exists(Config.GCP_CREDENTIALS_PATH):
        credentials = service_account.Credentials.from_service_account_file(
            Config.GCP_CREDENTIALS_PATH
        )
        print(f"✓ Connected gcp project: {Config.GCP_PROJECT_ID}")
    
    # Initialize Firestore
    if credentials:
        db = firestore.Client(
            project=Config.GCP_PROJECT_ID,
            credentials=credentials,
            database=Config.FIRESTORE_DATABASE_NAME
        )
    else:
        # Use default credentials (for Cloud Run)
        db = firestore.Client(project=Config.GCP_PROJECT_ID)
    print(f"✓ Connected to Firestore database: {Config.FIRESTORE_DATABASE_NAME}")
    
    # Initialize Cloud Storage
    if credentials:
        storage_client = storage.Client(
            project=Config.GCP_PROJECT_ID,
            credentials=credentials
        )
    else:
        storage_client = storage.Client(project=Config.GCP_PROJECT_ID)
    
    bucket = storage_client.bucket(Config.STORAGE_BUCKET_NAME)
    print(f"✓ Connected to Cloud Storage bucket: {Config.STORAGE_BUCKET_NAME}")
    
    return {
        'db': db,
        'storage_client': storage_client,
        'bucket': bucket,
        'credentials': credentials
    }


# Initialize GCP services
gcp_services = initialize_gcp_services()
db = gcp_services['db']
storage_client = gcp_services['storage_client']
storage_bucket = gcp_services['bucket']