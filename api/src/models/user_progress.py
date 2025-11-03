from src.models.base import BaseModel
import logging


logger = logging.getLogger(__name__)

class UserProgress(BaseModel):
    collection_name = 'user_progress'
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.user_id = kwargs.get('user_id')
        self.current_streak = kwargs.get('current_streak', 0)
        self.completed_days = kwargs.get('completed_days', 0)
        self.average_score = kwargs.get('average_score', 0.0)
        self.improvement_rate = kwargs.get('improvement_rate', 0.0)
        self.metric_trends = kwargs.get('metric_trends', {})
        self.milestones = kwargs.get('milestones', [])
        self.updated_at = kwargs.get('updated_at')
    
    @classmethod
    def get_by_user(cls, user_id):
        """Get progress for specific user"""
        # Use user_id as document ID for easy lookup
        doc = cls.get_collection().document(user_id).get()
        if doc.exists:
            data = doc.to_dict()
            data['id'] = doc.id
            data['user_id'] = user_id
            return cls(**data)
        return None
    
    @classmethod
    def create_for_user(cls, user_id):
        """Create initial progress for user"""
        progress = cls(user_id=user_id)
        # Use user_id as document ID
        progress.id = user_id
        progress.save()
        return progress
    
    def update_with_evaluation(self, evaluation):
        """Update progress metrics with new evaluation"""
        from src.models.evaluation import Evaluation
        
        self.completed_days += 1
        
        # Update average score
        if self.average_score == 0:
            self.average_score = evaluation.overall_score
        else:
            total = self.average_score * (self.completed_days - 1) + evaluation.overall_score
            self.average_score = total / self.completed_days
        
        # Update streak
        self.current_streak += 1
        
        # Calculate improvement rate
        recent_evals = Evaluation.get_by_user(self.user_id, limit=5)
        if len(recent_evals) >= 2:
            first_avg = sum(e.overall_score for e in recent_evals[-2:]) / 2
            last_avg = sum(e.overall_score for e in recent_evals[:2]) / 2
            if first_avg > 0:
                self.improvement_rate = ((last_avg - first_avg) / first_avg) * 100
        
        # Update metric trends
        for metric, score in evaluation.metrics.items():
            if metric not in self.metric_trends:
                self.metric_trends[metric] = []
            self.metric_trends[metric].append(score)
            # Keep only last 21 entries
            self.metric_trends[metric] = self.metric_trends[metric][-21:]
        
        # Check for milestones
        self._check_milestones()
        
        self.save()
    
    def _check_milestones(self):
        """Check and add milestones"""
        milestones = []
        
        if self.completed_days == 1 and 'first_challenge' not in self.milestones:
            milestones.append('first_challenge')
        
        if self.current_streak == 7 and 'week_warrior' not in self.milestones:
            milestones.append('week_warrior')
        
        if self.completed_days == 21 and 'program_complete' not in self.milestones:
            milestones.append('program_complete')
        
        if self.average_score >= 90 and 'excellence_achieved' not in self.milestones:
            milestones.append('excellence_achieved')
        
        self.milestones.extend(milestones)
    
    def reset_streak(self):
        """Reset user's streak"""
        self.current_streak = 0
        self.save()

    @classmethod
    def create_initial_progress(cls, user_id: str):
        """
        Create Day 1 progress for a new user.
        Safe to call multiple times (idempotent via unique constraint).
        """
        # Optional: check if already exists
        existing = cls.get_all(
            filters=[
                ('user_id', '==', user_id),
                ('day', '==', 1)
            ],
            limit=1
        )
        if existing:
            logger.debug(f"Day 1 progress already exists for user {user_id}")
            return existing[0]

        progress = cls(
            user_id=user_id,
            day=1,
            completed=False,
        )
        progress.save()
        logger.info(f"Created initial progress for user {user_id}")
        return progress

    # Optional: helper to get progress for a day
    @classmethod
    def get_by_user_and_day(cls, user_id: str, day: int):
        results = cls.get_all(
            filters=[
                ('user_id', '==', user_id),
                ('day', '==', day)
            ],
            limit=1
        )
        return results[0] if results else None