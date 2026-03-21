from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from database import db, Artwork, Comment, Like, Message, User
from helpers import admin_required
import os

admin_bp = Blueprint("admin", __name__)

UPLOAD_DIR = "static/uploads"

# ── CREATE ────────────────────────────────────────────────────────────────────
@admin_bp.route("/artworks", methods=["POST"])
@admin_required
def create_artwork(current_user):
    title   = request.form.get("title", "").strip()
    content = request.form.get("content", "").strip()
    image   = request.files.get("image")

    if not title:
        return jsonify({"success": False, "message": "Title is required"}), 400

    image_url = ""
    if image:
        os.makedirs(UPLOAD_DIR, exist_ok=True)
        filename   = secure_filename(image.filename)   # ← safe filename
        image_path = os.path.join(UPLOAD_DIR, filename)
        image.save(image_path)
        image_url = f"http://localhost:5000/static/uploads/{filename}"

    new_artwork = Artwork(
        title           = title,
        artist_name     = current_user.username,
        description     = content,
        after_image_url = image_url,
        is_approved     = True,
    )
    db.session.add(new_artwork)
    db.session.commit()
    return jsonify({"success": True, "post": new_artwork.to_dict()}), 201


# ── GET ALL (admin posts tab) ──────────────────────────────────────────────────
@admin_bp.route("/artworks", methods=["GET"])
@admin_required
def get_all_artworks(current_user):
    artworks = Artwork.query.order_by(Artwork.created_at.desc()).all()
    return jsonify({"success": True, "posts": [a.to_dict() for a in artworks]}), 200


# ── DELETE ARTWORK ─────────────────────────────────────────────────────────────
@admin_bp.route("/artworks/<int:artwork_id>", methods=["DELETE"])
@admin_required
def delete_artwork(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"success": False, "message": "Artwork not found"}), 404
    db.session.delete(artwork)
    db.session.commit()
    return jsonify({"success": True}), 200


# ── COMMENTS ──────────────────────────────────────────────────────────────────
@admin_bp.route("/comments", methods=["GET"])
@admin_required
def get_all_comments(current_user):
    comments = Comment.query.order_by(Comment.created_at.desc()).all()
    data = []
    for c in comments:
        user     = User.query.get(c.user_id)
        artwork  = Artwork.query.get(c.artwork_id)
        data.append({
            "id":         c.id,
            "content":    c.content,
            "user_name":  user.username  if user    else "Deleted user",
            "post_title": artwork.title  if artwork else "Deleted post",
        })
    return jsonify({"success": True, "comments": data}), 200

@admin_bp.route("/comments/<int:comment_id>", methods=["DELETE"])
@admin_required
def delete_comment(current_user, comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"success": False, "message": "Comment not found"}), 404
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"success": True}), 200


# ── LIKES ─────────────────────────────────────────────────────────────────────
@admin_bp.route("/likes", methods=["GET"])
@admin_required
def get_all_likes(current_user):
    likes = Like.query.all()
    data  = []
    for l in likes:
        user    = User.query.get(l.user_id)
        artwork = Artwork.query.get(l.artwork_id)
        data.append({
            "id":         l.id,
            "user_name":  user.username  if user    else "Deleted user",
            "post_title": artwork.title  if artwork else "Deleted post",
        })
    return jsonify({"success": True, "likes": data}), 200

@admin_bp.route("/likes/<int:like_id>", methods=["DELETE"])
@admin_required
def delete_like(current_user, like_id):
    like = Like.query.get(like_id)
    if not like:
        return jsonify({"success": False, "message": "Like not found"}), 404
    db.session.delete(like)
    db.session.commit()
    return jsonify({"success": True}), 200


# ── MESSAGES ──────────────────────────────────────────────────────────────────
@admin_bp.route("/messages", methods=["GET"])
@admin_required
def get_all_messages(current_user):
    messages = Message.query.order_by(Message.created_at.desc()).all()
    data     = []
    for m in messages:
        sender   = User.query.get(m.sender_id)
        receiver = User.query.get(m.receiver_id)
        data.append({
            "id":            m.id,
            "content":       m.content,
            "sender_name":   sender.username   if sender   else "Deleted user",
            "receiver_name": receiver.username if receiver else "Deleted user",
        })
    return jsonify({"success": True, "messages": data}), 200

@admin_bp.route("/messages/<int:message_id>", methods=["DELETE"])
@admin_required
def delete_message(current_user, message_id):
    message = Message.query.get(message_id)
    if not message:
        return jsonify({"success": False, "message": "Message not found"}), 404
    db.session.delete(message)
    db.session.commit()
    return jsonify({"success": True}), 200


# ── UPDATE ARTWORK ─────────────────────────────────────────────────────────────
@admin_bp.route("/artworks/<int:artwork_id>", methods=["PUT"])
@admin_required
def update_artwork(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"success": False, "message": "Artwork not found"}), 404
    data = request.get_json()
    for field in ["title", "artist_name", "description", "before_image_url",
                  "before_text", "during_image_url", "during_text",
                  "after_image_url", "after_text", "mood", "is_approved"]:
        if field in data:
            setattr(artwork, field, data[field])
    db.session.commit()
    return jsonify({"success": True, "artwork": artwork.to_dict()}), 200


# ── USERS ──────────────────────────────────────────────────────────────────────
@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users(current_user):
    users = User.query.all()
    return jsonify({"success": True, "users": [u.to_dict() for u in users]}), 200