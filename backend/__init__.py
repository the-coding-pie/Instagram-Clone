from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

app = Flask(__name__, static_folder='../instagram/build', static_url_path='/')

db = SQLAlchemy(app)
migrate = Migrate(app, db)
bcrypt = Bcrypt(app=app)

# configs
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'instagram.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'b371693cd1b0db12a99f34433e5ca1c6'

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

from backend.posts import posts
from backend.users import users
app.register_blueprint(posts, url_prefix='/api')
app.register_blueprint(users, url_prefix='/api') 
