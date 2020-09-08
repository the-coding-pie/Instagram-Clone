from flask import Blueprint

users = Blueprint('users', __name__, static_folder='static')

from backend.users import routes, models