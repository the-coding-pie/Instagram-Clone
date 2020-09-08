from functools import wraps
from flask import request, jsonify
import jwt
from backend import app
from backend.users.models import User

def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
    token = None
    current_user = None

    if 'x-access-token' in request.headers:
      token = request.headers['x-access-token']

    if not token:
      return jsonify({
        'status': 401,
        'msg': 'Token is missing!'
      }), 401
    
    try:
      data = jwt.decode(token, app.secret_key)
      current_user = User.query.filter_by(public_id=data['public_id']).first()
    except:
      return jsonify({
        'status': 401,
        'msg': 'Token is invalid!'
      }), 401
    
    return f(current_user, *args, **kwargs)
  return decorated