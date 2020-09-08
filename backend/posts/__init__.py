from flask import Blueprint

posts = Blueprint('posts', __name__, static_folder='static')

from backend.posts import routes, models