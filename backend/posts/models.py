from backend import db
from datetime import datetime

class Like(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
  comment_id = db.Column(db.Integer, db.ForeignKey('comment.id'))

  def __repr__(self):
    return f'{self.user_id}'
    
class Post(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  img = db.Column(db.String, nullable=False)
  body = db.Column(db.String, nullable=False)
  date_posted = db.Column(db.DateTime, default=datetime.utcnow)
  likes = db.relationship('Like', backref='post', lazy=True)
  comments = db.relationship('Comment', backref='post', lazy=True)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'))

  def get_users(self):
    return [like.user_id for like in self.likes]

  def __repr__(self):
    return self.body[:10]

class Comment(db.Model):
  id = db.Column(db.Integer, primary_key=True)
  comment = db.Column(db.Text, nullable=True)
  date_posted = db.Column(db.DateTime, default=datetime.utcnow)
  user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
  post_id = db.Column(db.Integer, db.ForeignKey('post.id'))
  likes = db.relationship('Like', backref='comment', lazy=True)

  def get_users(self):
    return [like.user_id for like in self.likes]

  def __repr__(self):
    return self.comment[:10]