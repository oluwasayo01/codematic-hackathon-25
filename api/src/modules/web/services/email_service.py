from flask_mail import Mail, Message
from flask import render_template
from src.config import Config

mail = Mail()


class EmailService:
    """Service for sending emails"""
    
    @staticmethod
    def send_welcome_email(user):
        """Send welcome email to new user"""
        try:
            msg = Message(
                subject="Welcome to Articulate App! 🎙️",
                recipients=[user.email],
                html=render_template(
                    'emails/welcome.html',
                    user=user,
                    frontend_url=Config.FRONTEND_URL
                )
            )
            mail.send(msg)
            return True
        except Exception as e:
            print(f"Failed to send welcome email: {str(e)}")
            return False
    
    @staticmethod
    def send_daily_progress_email(user, evaluation, progress):
        """Send daily progress report email"""
        try:
            msg = Message(
                subject=f"Day {user.current_day}/21 - Your Speaking Progress 🎯",
                recipients=[user.email],
                html=render_template(
                    'emails/daily_progress.html',
                    user=user,
                    evaluation=evaluation,
                    progress=progress,
                    frontend_url=Config.FRONTEND_URL
                )
            )
            mail.send(msg)
            return True
        except Exception as e:
            print(f"Failed to send progress email: {str(e)}")
            return False
    
    @staticmethod
    def send_password_reset_email(email, reset_link):
        """Send password reset email"""
        try:
            msg = Message(
                subject="Reset Your Password",
                recipients=[email],
                html=render_template(
                    'emails/password_reset.html',
                    reset_link=reset_link,
                    frontend_url=Config.FRONTEND_URL
                )
            )
            mail.send(msg)
            return True
        except Exception as e:
            print(f"Failed to send reset email: {str(e)}")
            return False
    
    @staticmethod
    def send_email_verification(email, verification_link):
        """Send email verification"""
        try:
            msg = Message(
                subject="Verify Your Email Address",
                recipients=[email],
                html=render_template(
                    'emails/email_verification.html',
                    verification_link=verification_link,
                    frontend_url=Config.FRONTEND_URL
                )
            )
            mail.send(msg)
            return True
        except Exception as e:
            print(f"Failed to send verification email: {str(e)}")
            return False
    
    @staticmethod
    def send_streak_reminder(user):
        """Send streak reminder email"""
        try:
            msg = Message(
                subject="Don't Break Your Streak!",
                recipients=[user.email],
                html=render_template(
                    'emails/streak_reminder.html',
                    user=user,
                    frontend_url=Config.FRONTEND_URL
                )
            )
            mail.send(msg)
            return True
        except Exception as e:
            print(f"Failed to send streak reminder: {str(e)}")
            return False