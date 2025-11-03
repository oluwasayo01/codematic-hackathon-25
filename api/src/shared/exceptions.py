class AppException(Exception):
    """Base exception class"""
    status_code = 500
    
    def __init__(self, message, status_code=None, payload=None):
        super().__init__()
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload
    
    def to_dict(self):
        rv = dict(self.payload or ())
        rv['error'] = self.message
        return rv


class ValidationError(AppException):
    """Validation error exception"""
    status_code = 400


class AuthenticationError(AppException):
    """Authentication error exception"""
    status_code = 401


class AuthorizationError(AppException):
    """Authorization error exception"""
    status_code = 403


class NotFoundError(AppException):
    """Not found error exception"""
    status_code = 404


class ConflictError(AppException):
    """Conflict error exception"""
    status_code = 409