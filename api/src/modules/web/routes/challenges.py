from flask import Blueprint, request, jsonify
from src.shared.middleware import require_auth
from src.modules.web.services.challenge_service import ChallengeService

challenges_bp = Blueprint('challenges', __name__)


@challenges_bp.route('/daily', methods=['GET'])
@require_auth
def get_daily_challenge():
    """Get today's challenge for authenticated user"""
    try:
        user_id = request.user_id
        
        challenge_data = ChallengeService.get_or_create_daily_challenge(user_id)
        
        return jsonify(challenge_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@challenges_bp.route('/<challenge_id>', methods=['GET'])
@require_auth
def get_challenge(challenge_id):
    """Get challenge by ID"""
    try:
        from api.models.challenge import Challenge
        
        challenge = Challenge.get_by_id(challenge_id)
        
        if not challenge:
            return jsonify({'error': 'Challenge not found'}), 404
        
        return jsonify({
            'id': challenge.id,
            'difficulty': challenge.difficulty,
            'prompt_text': challenge.prompt_text,
            'prompt_type': challenge.prompt_type,
            'target_duration': challenge.target_duration,
            'criteria': challenge.criteria
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500