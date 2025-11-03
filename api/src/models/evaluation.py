from src.models.base import BaseModel


class Evaluation(BaseModel):
    collection_name = 'evaluations'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.submission_id = kwargs.get('submission_id')
        self.user_id = kwargs.get('user_id')
        self.day = kwargs.get('day')
        self.overall_score = kwargs.get('overall_score')  # 0-100
        self.metrics = kwargs.get('metrics', {})  # clarity, fluency, etc.
        self.strengths = kwargs.get('strengths', [])
        self.areas_for_improvement = kwargs.get('areas_for_improvement', [])
        self.specific_feedback = kwargs.get('specific_feedback')
        self.recommendations = kwargs.get('recommendations', [])
        self.evaluated_at = kwargs.get('evaluated_at')
    
    @classmethod
    def get_by_user(cls, user_id, limit=None):
        """Get all evaluations for a user"""
        return cls.get_all(
            filters=[('user_id', '==', user_id)],
            order_by='-day',
            limit=limit
        )
    
    @classmethod
    def get_by_submission(cls, submission_id):
        """Get evaluation for specific submission"""
        evals = cls.get_all(
            filters=[('submission_id', '==', submission_id)],
            limit=1
        )
        return evals[0] if evals else None
    
    @classmethod
    def get_latest_evaluation(cls, user_id):
        """Get user's most recent evaluation"""
        evals = cls.get_by_user(user_id, limit=1)
        return evals[0] if evals else None