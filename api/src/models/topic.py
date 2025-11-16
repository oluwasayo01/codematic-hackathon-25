from src.models.base import BaseModel
from typing import List, Dict, Optional


class Topic(BaseModel):
    collection_name = 'topics'

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.title: str = kwargs.get('title')
        self.description: Optional[str] = kwargs.get('description')
        # store days as list of {day:int, challenge_id:str}
        self.days: List[Dict] = kwargs.get('days', [])
        self.created_at = kwargs.get('created_at')

    def add_or_update_day(self, day: int, challenge_id: str):
        """Add or update mapping for a specific day to a challenge."""
        updated = False
        for d in self.days:
            if int(d.get('day')) == int(day):
                d['challenge_id'] = challenge_id
                updated = True
                break
        if not updated:
            self.days.append({'day': int(day), 'challenge_id': challenge_id})
        # sort by day for consistency
        self.days = sorted(self.days, key=lambda x: int(x.get('day', 0)))
        self.save()
        return self

    def get_day(self, day: int) -> Optional[Dict]:
        for d in self.days:
            if int(d.get('day')) == int(day):
                return d
        return None

    @classmethod
    def list(cls, limit: Optional[int] = None):
        return cls.get_all(order_by='created_at', limit=limit)
