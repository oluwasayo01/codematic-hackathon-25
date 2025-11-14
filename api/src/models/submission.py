from src.models.base import BaseModel


class Submission(BaseModel):
    collection_name = 'submissions'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_id = kwargs.get('user_id')
        self.challenge_id = kwargs.get('challenge_id')
        self.topic_id = kwargs.get('topic_id')
        self.day = kwargs.get('day')
        self.audio_url = kwargs.get('audio_url')
        self.audio_blob_name = kwargs.get('audio_blob_name')  # For Cloud Storage
        self.transcription = kwargs.get('transcription')
        self.duration = kwargs.get('duration')  # seconds
        self.submitted_at = kwargs.get('submitted_at')
    
    @classmethod
    def get_by_user(cls, user_id, limit=None):
        """Get all submissions for a user"""
        return cls.get_all(
            filters=[('user_id', '==', user_id)],
            order_by='-day',
            limit=limit
        )

    @classmethod
    def get_by_user_and_topic(cls, user_id, topic_id, limit=None):
        """Get all submissions for a user within a topic"""
        return cls.get_all(
            filters=[('user_id', '==', user_id), ('topic_id', '==', topic_id)],
            order_by='day',
            limit=limit
        )
    
    @classmethod
    def get_user_submission_for_day(cls, user_id, day):
        """Get user's submission for specific day (global)"""
        submissions = cls.get_all(
            filters=[
                ('user_id', '==', user_id),
                ('day', '==', day)
            ],
            limit=1
        )
        return submissions[0] if submissions else None
