from src.models.base import BaseModel


class UserChallenge(BaseModel):
    collection_name = 'user_challenges'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_id = kwargs.get('user_id')
        self.challenge_id = kwargs.get('challenge_id')
        self.topic_id = kwargs.get('topic_id')
        self.day = kwargs.get('day')
        self.status = kwargs.get('status', 'pending')  # pending, completed
        self.assigned_at = kwargs.get('assigned_at')
        self.completed_at = kwargs.get('completed_at')
    
    @classmethod
    def get_user_challenge_for_day(cls, user_id, day):
        """Get user's challenge for specific day"""
        challenges = cls.get_all(
            filters=[
                ('user_id', '==', user_id),
                ('day', '==', day)
            ],
            limit=1
        )
        return challenges[0] if challenges else None
    
    @classmethod
    def get_user_challenges(cls, user_id):
        """Get all challenges for a user"""
        return cls.get_all(
            filters=[('user_id', '==', user_id)],
            order_by='day'
        )
    
    def mark_completed(self):
        """Mark challenge as completed"""
        from datetime import datetime
        self.status = 'completed'
        self.completed_at = datetime.now()
        self.save()