# ============================================================
# routes/auth.py - REGISTER and LOGIN endpoints
# FR 1: Registration | FR 2: Log in
# ============================================================

from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from database import db, User

# A Blueprint is like a mini-app. We group related routes together.
auth_bp = Blueprint("auth", __name__)

SECRET_KEY = "your-secret-key-change-this-in-production"


# ---- REGISTER: POST /api/auth/register ---------------------
@auth_bp.route("/register", methods=["POST"])
def register():
    """
    React sends: { "email": "...", "username": "...", "password": "..." }
    We save the user to the database and return a success message.
    """
    data = request.get_json()  # Get the JSON data React sent us

    # Check that all required fields exist
    if not data.get("email") or not data.get("username") or not data.get("password"):
        return jsonify({"error": "Email, username, and password are required"}), 400

    # Check if email is already taken (FR: no duplicate emails)
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"error": "Email already registered"}), 409

    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "Username already taken"}), 409

    # Hash the password — NEVER store plain text passwords! (NFR 1 Security)
    hashed_password = generate_password_hash(data["password"])

    # Create a new user and save to database
    new_user = User(
        email=data["email"],
        username=data["username"],
        password=hashed_password
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Account created successfully!"}), 201


# ---- LOGIN: POST /api/auth/login ---------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    """
    React sends: { "email": "...", "password": "..." }
    We verify credentials and return a TOKEN (like a key card).
    React stores this token and sends it with future requests.
    """
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"error": "Email and password are required"}), 400

    # Find user by email
    user = User.query.filter_by(email=data["email"]).first()

    # Check if user exists AND password is correct
    if not user or not check_password_hash(user.password, data["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    # Create a JWT token (expires in 24 hours)
    # JWT = JSON Web Token — it's a secure way to stay logged in
    token = jwt.encode({
        "user_id": user.id,
        "role":    user.role,
        "exp":     datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")

    return jsonify({
        "message": "Login successful!",
        "token":   token,
        "user":    user.to_dict()
    }), 200
    