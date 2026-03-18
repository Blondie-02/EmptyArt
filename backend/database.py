# ============================================================
# database.py - Defines all DATABASE TABLES as Python classes
# Each class = one table in the database
# ============================================================

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# This is the database object we import in other files
db = SQLAlchemy()


# ---- TABLE 1: Users ----------------------------------------
# Stores every person who registers on Empty Art
class User(db.Model):
    id         = db.Column(db.Integer, primary_key=True)          # Auto-generated ID
    email      = db.Column(db.String(150), unique=True, nullable=False)  # Must be unique
    username   = db.Column(db.String(80),  unique=True, nullable=False)
    password   = db.Column(db.String(200), nullable=False)        # Will be hashed (hidden)
    role       = db.Column(db.String(20),  default="user")        # "user" or "admin"
    created_at = db.Column(db.DateTime,    default=datetime.utcnow)

    # This links users to their comments (one user → many comments)
    comments   = db.relationship("Comment", backref="author", lazy=True)

    def to_dict(self):
        """Convert user to a dictionary so Flask can send it as JSON"""
        return {
            "id":         self.id,
            "email":      self.email,
            "username":   self.username,
            "role":       self.role,
            "created_at": self.created_at.isoformat()
        }
        # Notice: we never include 'password' here for security!


# ---- TABLE 2: Artworks -------------------------------------
# Stores every artwork with its Before/During/After stages
class Artwork(db.Model):
    id               = db.Column(db.Integer, primary_key=True)
    title            = db.Column(db.String(200), nullable=False)
    artist_name      = db.Column(db.String(150), nullable=False)
    description      = db.Column(db.Text)

    # The THREE stages of your "Empty Art" concept
    before_image_url = db.Column(db.String(300))  # Sketch / idea
    before_text      = db.Column(db.Text)         # Artist's thoughts at start

    during_image_url = db.Column(db.String(300))  # Work in progress
    during_text      = db.Column(db.Text)         # Artist's thoughts during creation

    after_image_url  = db.Column(db.String(300))  # Final artwork
    after_text       = db.Column(db.Text)         # Artist's reflection

    mood             = db.Column(db.String(50), default="calm")  # For mood themes
    is_approved      = db.Column(db.Boolean, default=False)      # Admin must approve
    created_at       = db.Column(db.DateTime, default=datetime.utcnow)

    comments         = db.relationship("Comment", backref="artwork", lazy=True)

    def to_dict(self):
        return {
            "id":               self.id,
            "title":            self.title,
            "artist_name":      self.artist_name,
            "description":      self.description,
            "before_image_url": self.before_image_url,
            "before_text":      self.before_text,
            "during_image_url": self.during_image_url,
            "during_text":      self.during_text,
            "after_image_url":  self.after_image_url,
            "after_text":       self.after_text,
            "mood":             self.mood,
            "is_approved":      self.is_approved,
            "created_at":       self.created_at.isoformat()
        }


# ---- TABLE 3: Comments -------------------------------------
# Stores user comments on artworks
class Comment(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    content    = db.Column(db.Text, nullable=False)
    stage      = db.Column(db.String(20), default="after")  # "before", "during", or "after"
    is_flagged = db.Column(db.Boolean, default=False)       # Safety: flagged by users
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Foreign keys: link comment to a user and an artwork
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"),    nullable=False)
    artwork_id = db.Column(db.Integer, db.ForeignKey("artwork.id"), nullable=False)

    def to_dict(self):
        return {
            "id":         self.id,
            "content":    self.content,
            "stage":      self.stage,
            "is_flagged": self.is_flagged,
            "created_at": self.created_at.isoformat(),
            "user_id":    self.user_id,
            "artwork_id": self.artwork_id,
            "username":   self.author.username  # Include username for display
        }


# ---- TABLE 4: SavedArtworks --------------------------------
# When a user "saves" an artwork to view later
class SavedArtwork(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"),    nullable=False)
    artwork_id = db.Column(db.Integer, db.ForeignKey("artwork.id"), nullable=False)
    saved_at   = db.Column(db.DateTime, default=datetime.utcnow)