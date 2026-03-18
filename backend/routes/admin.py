from flask import Blueprint, request, jsonify
from database import db, Artwork, Comment, User
from helpers import admin_required

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/artworks", methods=["POST"])
@admin_required
def create_artwork(current_user):
    data = request.get_json()
    if not data or not data.get("title"):
        return jsonify({"error": "Title is required"}), 400
    new_artwork = Artwork(
        title            = data.get("title"),
        artist_name      = data.get("artist_name", ""),
        description      = data.get("description", ""),
        before_image_url = data.get("before_image_url", ""),
        before_text      = data.get("before_text", ""),
        during_image_url = data.get("during_image_url", ""),
        during_text      = data.get("during_text", ""),
        after_image_url  = data.get("after_image_url", ""),
        after_text       = data.get("after_text", ""),
        mood             = data.get("mood", "calm"),
        is_approved      = True
    )
    db.session.add(new_artwork)
    db.session.commit()
    return jsonify({"message": "Artwork created!", "artwork": new_artwork.to_dict()}), 201

@admin_bp.route("/artworks/<int:artwork_id>", methods=["PUT"])
@admin_required
def update_artwork(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"error": "Artwork not found"}), 404
    data = request.get_json()
    for field in ["title","artist_name","description","before_image_url","before_text",
                  "during_image_url","during_text","after_image_url","after_text","mood","is_approved"]:
        if field in data:
            setattr(artwork, field, data[field])
    db.session.commit()
    return jsonify({"message": "Artwork updated!", "artwork": artwork.to_dict()}), 200

@admin_bp.route("/artworks/<int:artwork_id>", methods=["DELETE"])
@admin_required
def delete_artwork(current_user, artwork_id):
    artwork = Artwork.query.get(artwork_id)
    if not artwork:
        return jsonify({"error": "Artwork not found"}), 404
    db.session.delete(artwork)
    db.session.commit()
    return jsonify({"message": "Artwork deleted"}), 200

@admin_bp.route("/comments/<int:comment_id>", methods=["DELETE"])
@admin_required
def delete_comment(current_user, comment_id):
    comment = Comment.query.get(comment_id)
    if not comment:
        return jsonify({"error": "Comment not found"}), 404
    db.session.delete(comment)
    db.session.commit()
    return jsonify({"message": "Comment deleted by admin"}), 200

@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users(current_user):
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@admin_bp.route("/artworks", methods=["GET"])
@admin_required
def get_all_artworks(current_user):
    artworks = Artwork.query.order_by(Artwork.created_at.desc()).all()
    return jsonify([a.to_dict() for a in artworks]), 200