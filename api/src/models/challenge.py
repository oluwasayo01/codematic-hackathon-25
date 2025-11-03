from src.models.base import BaseModel


class Challenge(BaseModel):
    collection_name = 'challenges'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.difficulty = kwargs.get('difficulty')  # 1-5
        self.prompt_text = kwargs.get('prompt_text')
        self.prompt_type = kwargs.get('prompt_type')  # storytelling, explanation, etc.
        self.target_duration = kwargs.get('target_duration')  # seconds
        self.criteria = kwargs.get('criteria', [])
        self.created_at = kwargs.get('created_at')
    
    @classmethod
    def get_by_difficulty(cls, difficulty, limit=10):
        """Get challenges by difficulty level"""
        return cls.get_all(
            filters=[('difficulty', '==', difficulty)],
            limit=limit
        )
    
    @classmethod
    def get_random_by_difficulty(cls, difficulty):
        """Get random challenge by difficulty"""
        import random
        challenges = cls.get_by_difficulty(difficulty, limit=20)
        return random.choice(challenges) if challenges else None