from flask import Blueprint, request, jsonify
from src.shared.middleware import require_auth
from src.models.topic import Topic
from src.models.challenge import Challenge
from src.models.submission import Submission
from src.models.evaluation import Evaluation

topics_bp = Blueprint('topics', __name__)

@topics_bp.route('', methods=['GET'])
@require_auth
def list_topics():
    try:
        topics = Topic.list()
        return jsonify([
            {
                'id': t.id,
                'title': t.title,
                'description': t.description,
                'days': t.days,
                'created_at': t.created_at
            } for t in topics
        ]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@topics_bp.route('', methods=['POST'])
@require_auth
def create_topic():
    try:
        data = request.get_json() or {}
        title = data.get('title')
        description = data.get('description')
        if not title:
            return jsonify({'error': 'title is required'}), 400
        topic = Topic(title=title, description=description, days=[])
        topic.save()
        return jsonify({'id': topic.id, 'title': topic.title, 'description': topic.description, 'days': topic.days}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@topics_bp.route('/<topic_id>', methods=['GET'])
@require_auth
def get_topic(topic_id):
    try:
        topic = Topic.get_by_id(topic_id)
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        return jsonify({'id': topic.id, 'title': topic.title, 'description': topic.description, 'days': topic.days}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@topics_bp.route('/<topic_id>/status', methods=['GET'])
@require_auth
def topic_status(topic_id):
    """Return user-specific status for a topic: current day challenge, history and metrics"""
    try:
        user_id = request.user_id
        topic = Topic.get_by_id(topic_id)
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404

        # Submissions for this topic
        subs = Submission.get_by_user_and_topic(user_id, topic_id) or []
        completed_days = sorted([s.day for s in subs if s.day is not None])
        current_day = min(21, (completed_days[-1] + 1) if completed_days else 1)

        # Today's challenge from mapping, fallback if not set
        day_map = topic.get_day(current_day)
        challenge_payload = None
        if day_map and day_map.get('challenge_id'):
            ch = Challenge.get_by_id(day_map['challenge_id'])
            if ch:
                challenge_payload = {
                    'id': ch.id,
                    'difficulty': ch.difficulty,
                    'prompt_text': ch.prompt_text,
                    'prompt_type': ch.prompt_type,
                    'target_duration': ch.target_duration,
                }

        # Join evaluations with submissions
        history = []
        scores = []
        for s in subs:
            ev = Evaluation.get_by_submission(s.id)
            history.append({
                'day': s.day,
                'submission': {
                    'id': s.id,
                    'audio_url': s.audio_url,
                    'submitted_at': s.submitted_at.isoformat() if s.submitted_at else None,
                },
                'evaluation': ({
                    'id': ev.id,
                    'overall_score': ev.overall_score,
                    'metrics': ev.metrics,
                } if ev else None)
            })
            if ev:
                scores.append(ev.overall_score)

        overall_score = (sum(scores) / len(scores)) if scores else None

        return jsonify({
            'topic': {'id': topic.id, 'title': topic.title, 'description': topic.description},
            'current_day': current_day,
            'today': {'day': current_day, 'challenge': challenge_payload},
            'history': history,
            'metrics': {
                'overall_score': overall_score,
                'days_completed': len(completed_days),
                'scores': scores[-21:],
            }
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@topics_bp.route('/<topic_id>/days', methods=['POST'])
@require_auth
def set_topic_day(topic_id):
    try:
        data = request.get_json() or {}
        day = int(data.get('day', 0))
        challenge_id = data.get('challenge_id')
        if day < 1 or day > 21:
            return jsonify({'error': 'day must be between 1 and 21'}), 400
        if not challenge_id:
            return jsonify({'error': 'challenge_id is required'}), 400
        topic = Topic.get_by_id(topic_id)
        if not topic:
            return jsonify({'error': 'Topic not found'}), 404
        # validate challenge exists
        challenge = Challenge.get_by_id(challenge_id)
        if not challenge:
            return jsonify({'error': 'Challenge not found'}), 404
        topic.add_or_update_day(day, challenge_id)
        return jsonify({'id': topic.id, 'title': topic.title, 'description': topic.description, 'days': topic.days}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
