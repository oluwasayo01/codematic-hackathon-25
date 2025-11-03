from flask import Blueprint, request, jsonify
from src.shared.middleware import require_auth
from src.models.evaluation import Evaluation

evaluations_bp = Blueprint('evaluations', __name__)


@evaluations_bp.route('/user/<user_id>', methods=['GET'])
@require_auth
def get_user_evaluations(user_id):
    """Get all evaluations for a user"""
    try:
        # Check authorization
        if request.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        evaluations = Evaluation.get_by_user(user_id)
        
        return jsonify({
            'evaluations': [{
                'id': e.id,
                'day': e.day,
                'overall_score': e.overall_score,
                'metrics': e.metrics,
                'strengths': e.strengths,
                'areas_for_improvement': e.areas_for_improvement,
                'specific_feedback': e.specific_feedback,
                'recommendations': e.recommendations,
                'evaluated_at': e.evaluated_at.isoformat() if e.evaluated_at else None
            } for e in evaluations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@evaluations_bp.route('/<evaluation_id>', methods=['GET'])
@require_auth
def get_evaluation(evaluation_id):
    """Get specific evaluation"""
    try:
        evaluation = Evaluation.get_by_id(evaluation_id)
        
        if not evaluation:
            return jsonify({'error': 'Evaluation not found'}), 404
        
        # Check authorization
        if request.user_id != evaluation.user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        return jsonify({
            'id': evaluation.id,
            'submission_id': evaluation.submission_id,
            'day': evaluation.day,
            'overall_score': evaluation.overall_score,
            'metrics': evaluation.metrics,
            'strengths': evaluation.strengths,
            'areas_for_improvement': evaluation.areas_for_improvement,
            'specific_feedback': evaluation.specific_feedback,
            'recommendations': evaluation.recommendations,
            'evaluated_at': evaluation.evaluated_at.isoformat() if evaluation.evaluated_at else None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500