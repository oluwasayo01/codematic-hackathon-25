from flask import Blueprint, request, jsonify
from src.shared.middleware import require_auth
from src.modules.web.services.storage_service import StorageService
from src.models.submission import Submission
from src.models.user import User
from datetime import datetime

submissions_bp = Blueprint('submissions', __name__)


@submissions_bp.route('/upload', methods=['POST'])
@require_auth
def upload_audio():
    """Upload audio submission"""
    try:
        user_id = request.user_id
        
        # Get form data
        challenge_id = request.form.get('challenge_id')
        topic_id = request.form.get('topic_id')
        audio_file = request.files.get('audio')
        
        if (not challenge_id and not topic_id) or not audio_file:
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Get file extension
        filename = audio_file.filename
        file_extension = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'webm'
        
        # Upload to Cloud Storage
        blob_name, audio_url = StorageService.upload_audio(
            user_id=user_id,
            audio_file=audio_file,
            file_extension=file_extension
        )
        
        user = User.get_by_id(user_id)

        # Determine day and persist topic association if provided
        if topic_id:
            existing = Submission.get_by_user_and_topic(user_id, topic_id)
            next_day = (existing[-1].day + 1) if existing else 1
        else:
            next_day = user.current_day

        # Create submission record
        submission = Submission(
            user_id=user_id,
            challenge_id=challenge_id,
            topic_id=topic_id,
            day=next_day,
            audio_url=audio_url,
            audio_blob_name=blob_name,
            transcription='',  # Will be filled by transcription service
            duration=0,  # Will be calculated
            submitted_at=datetime.now()
        )
        submission.save()
        
        return jsonify({
            'submission_id': submission.id,
            'audio_url': audio_url,
            'message': 'Audio uploaded successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@submissions_bp.route('/user/<user_id>', methods=['GET'])
@require_auth
def get_user_submissions(user_id):
    """Get all submissions for a user"""
    try:
        # Check authorization
        if request.user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        submissions = Submission.get_by_user(user_id)
        
        return jsonify({
            'submissions': [{
                'id': s.id,
                'challenge_id': s.challenge_id,
                'day': s.day,
                'audio_url': s.audio_url,
                'duration': s.duration,
                'submitted_at': s.submitted_at.isoformat() if s.submitted_at else None
            } for s in submissions]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500