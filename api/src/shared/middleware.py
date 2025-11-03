from functools import wraps
from flask import request, jsonify
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from src.config import Config
from src.models.user import User




def verify_firebase_token(token):
    """Verify Firebase ID token"""
    print(token[:10])
    print("GCP Project: ", Config.GCP_PROJECT_ID)
    try:
        decoded_token = id_token.verify_firebase_token(
            token,
            google_requests.Request(),
            audience=Config.GCP_PROJECT_ID
        )
        return decoded_token
    except Exception as e:
        print(f"Token verification failed: {str(e)}")
        return None


def require_auth(f):
    """Decorator to require authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        
        decoded_token = verify_firebase_token(token)
        if not decoded_token:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        # Get user from database
        firebase_uid = decoded_token.get('sub')
        user = User.get_by_firebase_uid(firebase_uid)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Attach user info to request
        request.user_id = user.id
        request.user = user
        request.firebase_uid = firebase_uid
        request.user_email = decoded_token.get('email')
        request.email_verified = decoded_token.get('email_verified', False)
        
        return f(*args, **kwargs)
    
    return decorated_function


def require_verified_email(f):
    """Decorator to require verified email"""
    @wraps(f)
    @require_auth
    def decorated_function(*args, **kwargs):
        if not request.email_verified:
            return jsonify({'error': 'Email not verified'}), 403
        return f(*args, **kwargs)
    
    return decorated_function


def optional_auth(f):
    """Decorator for optional authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split('Bearer ')[1]
            decoded_token = verify_firebase_token(token)
            
            if decoded_token:
                firebase_uid = decoded_token.get('sub')
                user = User.get_by_firebase_uid(firebase_uid)
                
                if user:
                    request.user_id = user.id
                    request.user = user
                    request.firebase_uid = firebase_uid
                    request.user_email = decoded_token.get('email')
        
        return f(*args, **kwargs)
    
    return decorated_function