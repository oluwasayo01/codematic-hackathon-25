from flask import Flask, jsonify
from flask_cors import CORS
from flask_mail import Mail
from src.config import config
from src.shared.exceptions import AppException
from src.modules.web.services.email_service import mail


def create_app(config_name='development'):
    """Application factory"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000", "https://your-frontend-domain.com"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    mail.init_app(app)
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register blueprints
    register_blueprints(app)
    
    # Health check endpoint
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'service': 'articulate-backend'
        }), 200
    
    @app.route('/', methods=['GET'])
    def index():
        return jsonify({
            'message': 'Articulate App API',
            'version': '1.0.0',
            'endpoints': {
                'auth': '/api/auth',
                'challenges': '/api/challenges',
                'submissions': '/api/submissions',
                'evaluations': '/api/evaluations',
                'progress': '/api/progress'
            }
        }), 200
    
    return app


def register_blueprints(app):
    """Register Flask blueprints"""
    
    # Web module blueprints
    from src.modules.web.routes.auth import auth_bp
    from src.modules.web.routes.users import users_bp
    from src.modules.web.routes.challenges import challenges_bp
    from src.modules.web.routes.submissions import submissions_bp
    from src.modules.web.routes.evaluations import evaluations_bp
    from src.modules.web.routes.progress import progress_bp
    from src.modules.web.routes.tasks import tasks_bp
    
    # Chat module blueprints
    # from src.modules.chat.routes.llm import llm_bp
    
    # Register with URL prefixes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')
    app.register_blueprint(challenges_bp, url_prefix='/api/challenges')
    app.register_blueprint(submissions_bp, url_prefix='/api/submissions')
    app.register_blueprint(evaluations_bp, url_prefix='/api/evaluations')
    app.register_blueprint(progress_bp, url_prefix='/api/progress')
    app.register_blueprint(tasks_bp, url_prefix='/api/tasks')
    # app.register_blueprint(llm_bp, url_prefix='/api/llm')


def register_error_handlers(app):
    """Register error handlers"""
    
    @app.errorhandler(AppException)
    def handle_app_exception(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Resource not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    @app.errorhandler(Exception)
    def handle_unexpected_error(error):
        app.logger.error(f'Unexpected error: {str(error)}')
        return jsonify({'error': 'An unexpected error occurred'}), 500