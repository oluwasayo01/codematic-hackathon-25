from flask import Blueprint, request, jsonify
from src.shared.middleware import require_auth
from src.models.user_progress import UserProgress
from src.models.evaluation import Evaluation

progress_bp = Blueprint('progress', __name__)


@progress_bp.route('/<user_id>', methods=['GET'])
@require_auth
def get_user_progress(user_id):
    """Get progress for a user"""
    try:
        # Check authorization
        if request.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        progress = UserProgress.get_by_user(user_id)
        
        if not progress:
            # Create initial progress if doesn't exist
            progress = UserProgress.create_for_user(user_id)
        
        return jsonify({
            'user_id': progress.user_id,
            'current_streak': progress.current_streak,
            'completed_days': progress.completed_days,
            'average_score': round(progress.average_score, 2),
            'improvement_rate': round(progress.improvement_rate, 2),
            'metric_trends': progress.metric_trends,
            'milestones': progress.milestones
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500