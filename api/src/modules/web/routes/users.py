from flask import Blueprint, request, jsonify
from src.shared.middleware import require_auth
from src.models.user import User

users_bp = Blueprint('users', __name__)


@users_bp.route('/<user_id>', methods=['GET'])
@require_auth
def get_user(user_id):
    """Get user by ID"""
    try:
        # Check authorization
        if request.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        user = User.get_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'display_name': user.display_name,
                'photo_url': user.photo_url,
                'current_day': user.current_day,
                'start_date': user.start_date.isoformat() if user.start_date else None,
                'email_verified': user.email_verified
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500