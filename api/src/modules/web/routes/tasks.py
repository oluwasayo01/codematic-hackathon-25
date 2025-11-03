from flask import Blueprint, jsonify

tasks_bp = Blueprint('tasks', __name__)


@tasks_bp.route('/generate-challenges', methods=['POST'])
def trigger_challenge_generation():
    """Endpoint for Cloud Scheduler - generate daily challenges"""
    # TODO: Add verification for Cloud Scheduler requests
    try:
        from src.tasks.daily_tasks import generate_challenges_for_active_users
        generate_challenges_for_active_users()
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@tasks_bp.route('/send-reports', methods=['POST'])
def trigger_email_reports():
    """Endpoint for Cloud Scheduler - send daily reports"""
    try:
        from src.tasks.daily_tasks import send_all_daily_reports
        send_all_daily_reports()
        return jsonify({'status': 'success'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500