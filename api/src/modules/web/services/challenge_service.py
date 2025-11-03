from src.models.challenge import Challenge
from src.models.user_challenge import UserChallenge
from src.models.user import User
from src.models.evaluation import Evaluation
from datetime import datetime
import random


class ChallengeService:
    """Service for challenge-related operations"""
    
    @staticmethod
    def get_or_create_daily_challenge(user_id):
        """
        Get today's challenge for user or create one if doesn't exist
        
        Args:
            user_id: User ID
            
        Returns:
            dict: Challenge data with user_challenge info
        """
        user = User.get_by_id(user_id)
        if not user:
            raise ValueError("User not found")
        
        # Check if challenge already exists for current day
        user_challenge = UserChallenge.get_user_challenge_for_day(user_id, user.current_day)
        
        if not user_challenge:
            # Generate new challenge
            challenge = ChallengeService._generate_personalized_challenge(user)
            
            # Create user_challenge record
            user_challenge = UserChallenge(
                user_id=user_id,
                challenge_id=challenge.id,
                day=user.current_day,
                status='pending',
                assigned_at=datetime.now()
            )
            user_challenge.save()
        
        # Get challenge details
        challenge = Challenge.get_by_id(user_challenge.challenge_id)
        
        return {
            'user_challenge_id': user_challenge.id,
            'day': user_challenge.day,
            'status': user_challenge.status,
            'challenge': {
                'id': challenge.id,
                'difficulty': challenge.difficulty,
                'prompt_text': challenge.prompt_text,
                'prompt_type': challenge.prompt_type,
                'target_duration': challenge.target_duration,
                'criteria': challenge.criteria
            }
        }
    
    @staticmethod
    def _generate_personalized_challenge(user):
        """
        Generate a challenge tailored to user's progress
        
        Args:
            user: User object
            
        Returns:
            Challenge: Generated challenge
        """
        # Get user's recent evaluations
        recent_evaluations = Evaluation.get_by_user(user.id, limit=5)
        
        # Determine difficulty
        difficulty = ChallengeService._calculate_difficulty(user.current_day, recent_evaluations)
        
        # Get or create challenge
        # In production, you'd use LLM to generate custom challenges
        # For now, we'll get a random challenge of the appropriate difficulty
        challenge = Challenge.get_random_by_difficulty(difficulty)
        
        if not challenge:
            # Create a default challenge if none exist
            challenge = ChallengeService._create_default_challenge(difficulty, user.current_day)
        
        return challenge
    
    @staticmethod
    def _calculate_difficulty(current_day, recent_evaluations):
        """
        Calculate appropriate difficulty level
        
        Args:
            current_day: Current day in program
            recent_evaluations: List of recent evaluations
            
        Returns:
            int: Difficulty level (1-5)
        """
        # Base difficulty on day progression
        if current_day <= 7:
            base_difficulty = 1
        elif current_day <= 14:
            base_difficulty = 3
        else:
            base_difficulty = 5
        
        # Adjust based on performance
        if recent_evaluations:
            avg_score = sum(e.overall_score for e in recent_evaluations) / len(recent_evaluations)
            
            if avg_score >= 85:
                base_difficulty = min(5, base_difficulty + 1)
            elif avg_score < 60:
                base_difficulty = max(1, base_difficulty - 1)
        
        return base_difficulty
    
    @staticmethod
    def _create_default_challenge(difficulty, day):
        """Create a default challenge"""
        prompt_types = ['storytelling', 'explanation', 'opinion', 'description', 'debate']
        
        prompts = {
            1: [
                "Tell me about your favorite childhood memory.",
                "Describe your morning routine.",
                "What is your favorite hobby and why?"
            ],
            2: [
                "Explain how to make your favorite meal.",
                "Describe a place you'd love to visit.",
                "Tell me about a book or movie that impacted you."
            ],
            3: [
                "Share your opinion on remote work vs office work.",
                "Explain a complex topic you're knowledgeable about.",
                "Describe a challenging situation you overcame."
            ],
            4: [
                "Argue for or against social media's impact on society.",
                "Explain your perspective on work-life balance.",
                "Describe your ideal vision for your future."
            ],
            5: [
                "Debate the ethics of artificial intelligence.",
                "Present a persuasive argument about climate change.",
                "Explain a controversial topic with nuance and balance."
            ]
        }
        
        prompt_text = random.choice(prompts.get(difficulty, prompts[3]))
        prompt_type = random.choice(prompt_types)
        
        challenge = Challenge(
            difficulty=difficulty,
            prompt_text=prompt_text,
            prompt_type=prompt_type,
            target_duration=60 + (difficulty * 30),  # 90-210 seconds
            criteria=[
                'Clear articulation',
                'Logical flow of ideas',
                'Appropriate vocabulary',
                'Natural pacing',
                'Minimal filler words'
            ]
        )
        challenge.save()
        
        return challenge