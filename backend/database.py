from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# ---- TABLE 1: Users ----------------------------------------
class User(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    email      = db.Column(db.String(150), unique=True, nullable=False)
    username   = db.Column(db.String(80),  unique=True, nullable=False)
    password   = db.Column(db.String(200), nullable=False)
    role       = db.Column(db.String(20),  default="user")
    created_at = db.Column(db.DateTime,    default=datetime.utcnow)

    comments        = db.relationship("Comment",      backref="author",   lazy=True)
    likes           = db.relationship("Like",         backref="user",     lazy=True)
    sent_messages   = db.relationship("Message", foreign_keys="Message.sender_id",   backref="sender",   lazy=True)
    received_messages = db.relationship("Message", foreign_keys="Message.receiver_id", backref="receiver", lazy=True)

    def to_dict(self):
        return {
            "id":         self.id,
            "email":      self.email,
            "username":   self.username,
            "role":       self.role,
            "created_at": self.created_at.isoformat()
        }


# ---- TABLE 2: Artworks -------------------------------------
class Artwork(db.Model):
    id               = db.Column(db.Integer, primary_key=True)
    title            = db.Column(db.String(200), nullable=False)
    artist_name      = db.Column(db.String(150), nullable=False)
    description      = db.Column(db.Text)

    before_image_url = db.Column(db.String(300))
    before_text      = db.Column(db.Text)
    during_image_url = db.Column(db.String(300))
    during_text      = db.Column(db.Text)
    after_image_url  = db.Column(db.String(300))
    after_text       = db.Column(db.Text)

    mood             = db.Column(db.String(50),  default="calm")
    is_approved      = db.Column(db.Boolean,     default=False)
    created_at       = db.Column(db.DateTime,    default=datetime.utcnow)

    comments         = db.relationship("Comment", backref="artwork", lazy=True)
    likes            = db.relationship("Like",    backref="artwork", lazy=True)

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
class Comment(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    content    = db.Column(db.Text,    nullable=False)
    stage      = db.Column(db.String(20), default="after")
    is_flagged = db.Column(db.Boolean,   default=False)
    created_at = db.Column(db.DateTime,  default=datetime.utcnow)

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
            "username":   self.author.username
        }


# ---- TABLE 4: SavedArtworks --------------------------------
class SavedArtwork(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"),    nullable=False)
    artwork_id = db.Column(db.Integer, db.ForeignKey("artwork.id"), nullable=False)
    saved_at   = db.Column(db.DateTime, default=datetime.utcnow)


# ---- TABLE 5: Likes ----------------------------------------
class Like(db.Model):
    id         = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user_id    = db.Column(db.Integer, db.ForeignKey("user.id"),    nullable=False)
    artwork_id = db.Column(db.Integer, db.ForeignKey("artwork.id"), nullable=False)

    # Prevent a user from liking the same artwork twice
    __table_args__ = (db.UniqueConstraint("user_id", "artwork_id", name="unique_like"),)

    def to_dict(self):
        return {
            "id":         self.id,
            "user_id":    self.user_id,
            "artwork_id": self.artwork_id,
            "created_at": self.created_at.isoformat()
        }


# ---- TABLE 6: Messages -------------------------------------
class Message(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    content     = db.Column(db.Text,    nullable=False)
    is_read     = db.Column(db.Boolean, default=False)
    created_at  = db.Column(db.DateTime, default=datetime.utcnow)

    sender_id   = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    def to_dict(self):
        return {
            "id":          self.id,
            "content":     self.content,
            "is_read":     self.is_read,
            "created_at":  self.created_at.isoformat(),
            "sender_id":   self.sender_id,
            "receiver_id": self.receiver_id
        }