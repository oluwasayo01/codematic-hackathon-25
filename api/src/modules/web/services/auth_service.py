# src/services/auth_service.py
from __future__ import annotations

from typing import Optional
from datetime import datetime
import logging

from google.cloud import firestore
from src.models.user import User
from src.models.user_progress import UserProgress
from src.shared.exceptions import ValidationError, ConflictError
from src.shared.utils import validate_email


logger = logging.getLogger(__name__)


class AuthService:
    """Service for authentication operations with Firestore"""

    @staticmethod
    def create_or_update_user(
        firebase_uid: str,
        email: str,
        display_name: Optional[str] = None,
        photo_url: Optional[str] = None,
        auth_provider: str = "email",
    ) -> User:
        """
        Create or update a user after Firebase authentication.
        Idempotent: safe to call multiple times.

        Args:
            firebase_uid: From Firebase `sub` claim
            email: Verified email
            display_name: Optional
            photo_url: Optional
            auth_provider: 'email', 'google', etc.

        Returns:
            User instance

        Raises:
            ValidationError: Invalid input
            ConflictError: Email already used by another account
        """
        # ----------------------- Validation -----------------------
        if not firebase_uid:
            raise ValidationError("firebase_uid is required")
        if not email:
            raise ValidationError("email is required")
        if not validate_email(email):
            raise ValidationError("Invalid email format")

        email = email.lower().strip()

        # ------------------- Get existing user -------------------
        user = User.get_by_firebase_uid(firebase_uid)

        # ------------------ Email conflict check -----------------
        if user is None:
            # Check if email is already taken by another firebase_uid
            existing_by_email = User.get_by_email(email)
            if existing_by_email and existing_by_email.firebase_uid != firebase_uid:
                raise ConflictError("Email already in use by another account")

        # ----------------------- Create New ----------------------
        if not user:
            logger.info(f"Creating new user: {firebase_uid} | {email}")

            now = datetime.utcnow()
            user = User(
                firebase_uid=firebase_uid,
                email=email,
                display_name=display_name,
                photo_url=photo_url,
                auth_provider=auth_provider,
                current_day=1,
                start_date=now,
                email_verified=True,  # Firebase already verified
                last_login_at=now,
            )
            user.save()  # This generates `id` and sets `created_at`

            # Create initial progress for Day 1
            UserProgress.create_initial_progress(user.id)

            logger.info(f"New user created: {user.id}")
            return user

        # ----------------------- Update Existing ----------------
        logger.info(f"Updating existing user: {user.id} | {firebase_uid}")

        updated = False

        # Update fields only if changed
        if user.email != email:
            # Double-check email not taken by someone else
            other_user = User.get_by_email(email)
            if other_user and other_user.id != user.id:
                raise ConflictError("Email already in use by another account")
            user.email = email
            updated = True

        if display_name and user.display_name != display_name:
            user.display_name = display_name
            updated = True

        if photo_url and user.photo_url != photo_url:
            user.photo_url = photo_url
            updated = True

        if user.auth_provider != auth_provider:
            user.auth_provider = auth_provider
            updated = True

        # Always update last login
        user.last_login_at = datetime.utcnow()
        updated = True

        if updated:
            user.save()
            logger.info(f"User updated: {user.id}")

        return user

    # ------------------------------------------------------------------
    # Helper used by login route
    # ------------------------------------------------------------------
    @staticmethod
    def get_user_by_firebase_uid(firebase_uid: str) -> Optional[User]:
        return User.get_by_firebase_uid(firebase_uid)