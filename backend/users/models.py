from backend import db
import uuid

followers = db.Table('followers', db.Column('follower_id', db.Integer, db.ForeignKey('user.id')),
                     db.Column('followed_id', db.Integer, db.ForeignKey('user.id')))


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String, unique=True, default=str(uuid.uuid4()))
    username = db.Column(db.String, index=True, unique=True, nullable=False)
    email = db.Column(db.String, index=True, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    profile_pic = db.Column(db.String, nullable=False, default='default.png')
    bio = db.Column(db.Text, nullable=True)
    posts = db.relationship('Post', backref='author', lazy=True)
    likes = db.relationship('Like', backref='liker', lazy=True)
    comments = db.relationship('Comment', backref='commentator', lazy=True)
    followed = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic'
    )

    def follow(self, user):
        if not self.is_following(user):
            self.followed.append(user)
        else:
            self.followed.remove(user)

    def is_following(self, user):
        return self.followed.filter(
            followers.c.followed_id == user.id).count() > 0

    def __repr__(self):
        return self.username
