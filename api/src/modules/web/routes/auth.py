from flask import Blueprint, request, jsonify
from src.modules.web.services.auth_service import AuthService
from src.modules.web.services.email_service import EmailService
from src.shared.middleware import verify_firebase_token
from src.shared.exceptions import ValidationError, ConflictError
from src.shared.utils import validate_email

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Register a new user (called after Firebase authentication)
    
    This endpoint is called from frontend after user signs up with Firebase Auth.
    It creates the user record in Firestore and sends welcome email.
    
    Request Body:
        {
            "firebase_token": "Firebase ID token",
            "display_name": "User Name" (optional)
        }
    
    Returns:
        {
            "user": {user_object},
            "message": "Registration successful"
        }
    """
    try:
        data = request.get_json()
        
        if not data or 'firebase_token' not in data:
            return jsonify({'error': 'Firebase token is required'}), 400
        
        # Verify Firebase token
        decoded_token = verify_firebase_token(data['firebase_token'])
        if not decoded_token:
            return jsonify({'error': 'Invalid Firebase token'}), 401
        
        firebase_uid = decoded_token.get('sub')
        email = decoded_token.get('email')
        email_verified = decoded_token.get('email_verified', False)
        
        # Get optional display name
        display_name = data.get('display_name')
        
        # Create or update user
        user = AuthService.create_or_update_user(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
            auth_provider='email'
        )
        
        # Send welcome email
        EmailService.send_welcome_email(user)
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'display_name': user.display_name,
                'current_day': user.current_day,
                'email_verified': email_verified
            },
            'message': 'Registration successful'
        }), 201
        
    except ValidationError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Registration error: {str(e)}")
        return jsonify({'error': 'Registration failed'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Login user (called after Firebase authentication)
    
    This endpoint is called from frontend after user logs in with Firebase Auth.
    It updates the user's last login time.
    
    Request Body:
        {
            "firebase_token": "Firebase ID token"
        }
    
    Returns:
        {
            "user": {user_object},
            "message": "Login successful"
        }
    """
    try:
        data = request.get_json()
        print(data)
        
        if not data or 'firebase_token' not in data:
            return jsonify({'error': 'Firebase token is required'}), 400
        
        # Verify Firebase token
        decoded_token = verify_firebase_token(data['firebase_token'])
        print("=========================================== ")
        print(decoded_token)
        if not decoded_token:
            return jsonify({'error': 'Invalid Firebase token'}), 401
        
        firebase_uid = decoded_token.get('sub')
        email = decoded_token.get('email')
        
        # Get or create user
        user = AuthService.get_user_by_firebase_uid(firebase_uid)
        
        if not user:
            # User doesn't exist, create them
            user = AuthService.create_or_update_user(
                firebase_uid=firebase_uid,
                email=email,
                auth_provider='email'
            )
        else:
            # Update last login
            user.update_last_login()
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'display_name': user.display_name,
                'current_day': user.current_day,
                'photo_url': user.photo_url
            },
            'message': 'Login successful'
        }), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500


@auth_bp.route('/google-signin', methods=['POST'])
def google_signin():
    """
    Google Sign-In (called after Firebase Google authentication)
    
    Request Body:
        {
            "firebase_token": "Firebase ID token"
        }
    
    Returns:
        {
            "user": {user_object},
            "message": "Sign-in successful"
        }
    """
    try:
        data = request.get_json()
        
        if not data or 'firebase_token' not in data:
            return jsonify({'error': 'Firebase token is required'}), 400
        
        # Verify Firebase token
        decoded_token = verify_firebase_token(data['firebase_token'])
        if not decoded_token:
            return jsonify({'error': 'Invalid Firebase token'}), 401
        
        firebase_uid = decoded_token.get('sub')
        email = decoded_token.get('email')
        display_name = decoded_token.get('name')
        photo_url = decoded_token.get('picture')
        
        # Create or update user
        user = AuthService.create_or_update_user(
            firebase_uid=firebase_uid,
            email=email,
            display_name=display_name,
            photo_url=photo_url,
            auth_provider='google'
        )
        
        # Check if this is first time login
        is_new_user = user.created_at == user.updated_at
        
        if is_new_user:
            EmailService.send_welcome_email(user)
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'display_name': user.display_name,
                'photo_url': user.photo_url,
                'current_day': user.current_day
            },
            'is_new_user': is_new_user,
            'message': 'Sign-in successful'
        }), 200
        
    except Exception as e:
        print(f"Google sign-in error: {str(e)}")
        return jsonify({'error': 'Sign-in failed'}), 500


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """
    Get current user info
    
    Headers:
        Authorization: Bearer {firebase_token}
    
    Returns:
        {
            "user": {user_object}
        }
    """
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        
        # Verify token
        decoded_token = verify_firebase_token(token)
        if not decoded_token:
            return jsonify({'error': 'Invalid token'}), 401
        
        firebase_uid = decoded_token.get('sub')
        
        # Get user
        user = AuthService.get_user_by_firebase_uid(firebase_uid)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user.id,
                'firebase_uid': user.firebase_uid,
                'email': user.email,
                'display_name': user.display_name,
                'photo_url': user.photo_url,
                'current_day': user.current_day,
                'start_date': user.start_date.isoformat() if user.start_date else None,
                'email_verified': user.email_verified,
                'auth_provider': user.auth_provider
            }
        }), 200
        
    except Exception as e:
        print(f"Get current user error: {str(e)}")
        return jsonify({'error': 'Failed to get user'}), 500


@auth_bp.route('/send-password-reset', methods=['POST'])
def send_password_reset():
    """
    Trigger password reset email
    
    Note: Password reset is handled by Firebase Auth on frontend.
    This endpoint is optional and can send additional notifications.
    
    Request Body:
        {
            "email": "user@example.com"
        }
    
    Returns:
        {
            "message": "Password reset email sent"
        }
    """
    try:
        data = request.get_json()
        
        if not data or 'email' not in data:
            return jsonify({'error': 'Email is required'}), 400
        
        email = data['email']
        
        if not validate_email(email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Check if user exists
        user = AuthService.get_user_by_email(email)
        
        # Always return success to prevent email enumeration
        # Frontend should handle actual password reset via Firebase Auth
        
        return jsonify({
            'message': 'If an account exists with this email, a password reset link will be sent.'
        }), 200
        
    except Exception as e:
        print(f"Password reset error: {str(e)}")
        return jsonify({'error': 'Failed to send password reset email'}), 500


@auth_bp.route('/update-profile', methods=['PUT'])
def update_profile():
    """
    Update user profile
    
    Headers:
        Authorization: Bearer {firebase_token}
    
    Request Body:
        {
            "display_name": "New Name",
            "photo_url": "https://..."
        }
    
    Returns:
        {
            "user": {updated_user_object},
            "message": "Profile updated"
        }
    """
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'No token provided'}), 401
        
        token = auth_header.split('Bearer ')[1]
        
        # Verify token
        decoded_token = verify_firebase_token(token)
        if not decoded_token:
            return jsonify({'error': 'Invalid token'}), 401
        
        firebase_uid = decoded_token.get('sub')
        user = AuthService.get_user_by_firebase_uid(firebase_uid)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get update data
        data = request.get_json()
        display_name = data.get('display_name')
        photo_url = data.get('photo_url')
        
        # Update profile
        updated_user = AuthService.update_user_profile(
            user.id,
            display_name=display_name,
            photo_url=photo_url
        )
        
        return jsonify({
            'user': {
                'id': updated_user.id,
                'email': updated_user.email,
                'display_name': updated_user.display_name,
                'photo_url': updated_user.photo_url
            },
            'message': 'Profile updated successfully'
        }), 200
        
    except Exception as e:
        print(f"Update profile error: {str(e)}")
        return jsonify({'error': 'Failed to update profile'}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    Logout user
    
    Note: Actual logout is handled by Firebase Auth on frontend.
    This endpoint can be used for additional server-side cleanup.
    
    Returns:
        {
            "message": "Logged out successfully"
        }
    """
    # You can add server-side cleanup here if needed
    # For example, invalidating sessions, clearing caches, etc.
    
    return jsonify({
        'message': 'Logged out successfully'
    }), 200