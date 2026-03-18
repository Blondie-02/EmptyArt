from flask import Flask
from flask_cors import CORS
from database import db
from routes.auth import auth_bp
from routes.posts import posts_bp
from routes.comments import comments_bp
from routes.admin import admin_bp

app = Flask(__name__)

app.config["SECRET_KEY"] = "emptyart-secret-change-in-production"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///emptyart.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app)
db.init_app(app)

app.register_blueprint(auth_bp,     url_prefix="/api/auth")
app.register_blueprint(posts_bp,    url_prefix="/api/posts")
app.register_blueprint(comments_bp, url_prefix="/api/comments")
app.register_blueprint(admin_bp,    url_prefix="/api/admin")

with app.app_context():
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True, port=5000)