from flask import jsonify, request, url_for
from backend.posts import posts
from backend.users import users
from backend.users.models import User
from backend.posts.models import Post, Like, Comment
from backend import db, app
import secrets
import os
from sqlalchemy import desc, and_
from backend.decorators import token_required


@posts.route('/delete_post', methods=['DELETE'])
@token_required
def delete_post(current_user):
    try:
        public_id = request.headers.get('public_id')
        post_id = request.headers.get('post_id')

        if not public_id or not post_id:
            return jsonify({
            "status": 500,
             "msg": "Oops, Some error happened!"
        }), 500
        if public_id == current_user.public_id:
            post = Post.query.filter_by(id=post_id).first()
            if post:
                db.session.delete(post)
                db.session.commit()

                return jsonify({
                "status": 200,
                "msg": "Deleted post"
            })
            return jsonify({
                "status": 404,
                "msg": "No post found!!!"
            })
        
        return jsonify({
            "status": 401,
            "msg": "Unauthorized"
        })
    except:
        return jsonify({
            "status": 500,
             "is_author": False
        }), 500


@posts.route('/like_comment', methods=['POST'])
@token_required
def add_like_comment(current_user):
    try:
        comment_id = request.form.get('comment_id')

        comment = Comment.query.filter_by(id=comment_id).first()
        user = User.query.filter_by(public_id=current_user.public_id).first()

        if not comment or not user:
            return jsonify({
                "status": 404,
                "msg": "No Post or User Found!!!"
            }), 404

        # check if this user had already liked this post or not
        if user.id in comment.get_users():
            # if already liked, then "unlike" it
            like = Like.query.filter_by(
                user_id=user.id).filter_by(comment_id=comment.id).first()

            # delete it
            db.session.delete(like)
            db.session.commit()

            return jsonify({
                "status": 200,
                "liked": True if current_user.id in comment.get_users() else False,
                "likes": len(comment.likes),
                "msg": "Like added"
            }), 200

        # add a like
        like = Like(comment=comment, liker=user)

        db.session.add(like)
        db.session.commit()

        return jsonify({
            "status": 200,
            "likes": len(comment.likes),
            "liked": True if current_user.id in comment.get_users() else False,
            "msg": "Like added"
        }), 200
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


@posts.route('/add_comment', methods=['POST'])
@token_required
def add_comment(current_user):
    try:
        comment = request.form.get('comment')
        id = request.form.get('id')

        if not comment or not id:
            return jsonify({
                "status": 500,
                "msg": "Comment is not proper... "
            }), 500

        post = Post.query.filter_by(id=id).first()

        if not post:
            return jsonify({
                "status": 404,
                "msg": "No Post found..."
            }), 404

        # save the comment
        user = current_user

        new_comment = Comment(post=post, commentator=user, comment=comment)

        db.session.add(new_comment)
        db.session.commit()

        return jsonify({
            "status": 200,
            "msg": "Comment added successfully",
            "comment": {
                "id": new_comment.id,
                "comment": new_comment.comment,
                "date_posted": new_comment.date_posted.strftime("%d %b"),
                "profile_pic": url_for('posts.static', filename='profile_pics/' + new_comment.commentator.profile_pic),
                "commentator": new_comment.commentator.username,
                "likes": len(new_comment.likes),
                "liked": True if current_user.id in new_comment.get_users() else False
            }
        })
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


@posts.route('/comments', methods=['GET'])
@token_required
def get_comments(current_user):
    try:
        id = request.headers.get('id')
        # get post and comments related to it
        post = Post.query.filter_by(id=id).first()
        if not post:
            return jsonify({
                "status": 404,
                "msg": "No Post Found!!!"
            }), 404

        # the post exists
        # so fetch comments
        comments = []
        if len(post.comments) > 0:
            comments = [{
                "id": comment.id,
                "comment": comment.comment,
                "date_posted": comment.date_posted.strftime("%d %b"),
                "profile_pic": url_for('posts.static', filename='profile_pics/' + comment.commentator.profile_pic),
                "commentator": comment.commentator.username,
                "likes": len(comment.likes),
                "liked": True if current_user.id in comment.get_users() else False
            } for comment in post.comments]

        return jsonify({
            "status": 200,
            "comments": comments,
            "msg": "Success!!!"
        }), 200
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


@posts.route('/like', methods=['POST'])
@token_required
def add_like(current_user):
    try:
        post_id = request.form.get('post_id')

        post = Post.query.filter_by(id=post_id).first()
        user = User.query.filter_by(public_id=current_user.public_id).first()

        if not post or not user:
            return jsonify({
                "status": 404,
                "msg": "No Post or User Found!!!"
            }), 404

        # check if this user had already liked this post or not
        if user.id in post.get_users():
            # if already liked, then "unlike" it
            like = Like.query.filter_by(
                user_id=user.id).filter_by(post_id=post.id).first()

            # delete it
            db.session.delete(like)
            db.session.commit()

            return jsonify({
                "status": 200,
                "liked": True if current_user.id in post.get_users() else False,
                "likes": len(post.likes),
                "msg": "Like added"
            }), 200

        # add a like
        like = Like(post=post, liker=user)

        db.session.add(like)
        db.session.commit()

        return jsonify({
            "status": 200,
            "likes": len(post.likes),
            "liked": True if current_user.id in post.get_users() else False,
            "msg": "Like added"
        }), 200
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


@posts.route('/posts', methods=['GET'])
@token_required
def get_posts(current_user):
    try:
        posts = Post.query.order_by(desc(Post.date_posted)).all()

        posts = [{
            "id": post.id,
            "author": post.author.username,
            "public_id": post.author.public_id,
            "profile_pic": url_for('posts.static', filename='profile_pics/' + post.author.profile_pic),
            "liked": True if current_user.id in post.get_users() else False,
            "img": url_for('posts.static', filename='uploads/' + post.img),
            "likes": len(post.likes),
            "post": post.body
        } for post in posts]

        return jsonify({
            "status": 200,
            "posts": posts
        }), 200
    except:
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500


def save_image(img):
    random_hex = secrets.token_hex(8)
    _, f_ext = os.path.splitext(img.filename)

    img_fn = random_hex + f_ext
    img_path = os.path.join(posts.root_path, 'static/uploads', img_fn)

    # save the image
    img.save(img_path)

    return img_fn

# create


@posts.route('/newpost', methods=['POST'])
@token_required
def new_post(current_user):
    try:
        img = request.files.get('img')
        text = request.form.get('text')

        img_fn = save_image(img)

        author = current_user

        post = Post(img=img_fn, body=text, author=author)

        # save the post
        db.session.add(post)
        db.session.commit()

        return jsonify({
            "status": 200,
            "post": {
                "id": post.id,
                "public_id": post.author.public_id,
                "author": post.author.username,
                "profile_pic": url_for('posts.static', filename='profile_pics/' + post.author.profile_pic),
                "liked": True if current_user.id in post.get_users() else False,
                "img": url_for('posts.static', filename='uploads/' + post.img),
                "likes": len(post.likes),
                "post": post.body
            }
        }), 200
    except:
        db.session.rollback()
        return jsonify({
            "status": 500,
            "msg": "Oops, Some error happened!"
        }), 500
