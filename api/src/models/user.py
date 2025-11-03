from src.models.base import BaseModel
from datetime import datetime


class User(BaseModel):
    collection_name = 'users'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.firebase_uid = kwargs.get('firebase_uid')  # From Identity Platform
        self.email = kwargs.get('email')
        self.display_name = kwargs.get('display_name')
        self.photo_url = kwargs.get('photo_url')
        self.current_day = kwargs.get('current_day', 1)
        self.start_date = kwargs.get('start_date')
        self.email_verified = kwargs.get('email_verified', False)
        self.auth_provider = kwargs.get('auth_provider', 'email')  # email, google, etc.
        self.created_at = kwargs.get('created_at')
        self.updated_at = kwargs.get('updated_at')
        self.last_login_at = kwargs.get('last_login_at')
    
    @classmethod
    def get_by_email(cls, email):
        """Find user by email"""
        users = cls.get_all(filters=[('email', '==', email)], limit=1)
        return users[0] if users else None
    
    @classmethod
    def get_by_firebase_uid(cls, firebase_uid):
        """Find user by Firebase UID"""
        users = cls.get_all(filters=[('firebase_uid', '==', firebase_uid)], limit=1)
        return users[0] if users else None
    
    def increment_day(self):
        """Move user to next day"""
        if self.current_day < 21:
            self.current_day += 1
            self.save()
        return self.current_day
    
    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login_at = datetime.now()
        self.save()