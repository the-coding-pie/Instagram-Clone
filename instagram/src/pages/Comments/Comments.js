import React, { useState, useEffect, useContext } from 'react';

import './Comments.css';
import { checkAuth, getToken } from '../../utils';
import { CommentContext } from '../../contexts/CommentContext';
import { PostContext } from '../../contexts/PostContext';

import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import SendIcon from '@material-ui/icons/Send';

const Comments = (props) => {
  const { id } = props.match.params;
  const [msg, setMsg] = useState('Loading...');
  const { comments, setComments } = useContext(CommentContext);
  const { posts } = useContext(PostContext);
  const [comment, setComment] = useState('');

  let post = null;

  post = posts.find(post => {
    return String(post.id) === String(id);
  });

  const addLike = (id) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }
    try {
      const formdata = new FormData();
  
      formdata.append('comment_id', id);
  
      fetch('/api/like_comment', {
        body: formdata,
        method: 'POST',
        headers: {
          'x-access-token': getToken()
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setMsg('');
          // do something
          setComments(comments.map(comment => {
            if (comment.id !== id) {
              return comment;
            } 
            return {
              ...comment,
              liked: data.liked,
              likes: data.likes
            }
          }));
  
          setMsg('');
        } else {
          setMsg(data.msg);
        }
      })
      .catch(e => {
        setMsg("Oops, Some error happened!");
      })
    } catch (e) {
      setMsg("Oops, Some error happened!");
    }
  }


  const getComments = () => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }
    if (!post) {
      setMsg('No Posts Found!');
    } else {
      fetch('/api/comments', {
        method: 'GET',
        headers: {
          'x-access-token': getToken(),
          'id': id,
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) {
            setMsg('');
            setComments(data.comments);
          } else {
            setMsg('Oops, Something went wrong!!!')
          }
        })
        .catch(e => {
          setMsg('No Posts Found!');
        });
    }
  }

  useEffect(() => {
    getComments();
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formdata = new FormData();

    formdata.append('comment', comment);
    formdata.append('id', id);

    fetch('/api/add_comment', {
      method: 'POST',
      body: formdata,
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setMsg('');
          setComments([
            ...comments,
            data.comment
          ]);
          setComment('');
        } else {
          setMsg('Oops some error happened');
        }
      })
      .catch(e => {
        setMsg('Oops some error happened');
      })
  }

  const component = post && (
    <div className="comments__body">
      <div className="real_post">
        <div className="real_post_left">
          <img className="avatar" src={post.profile_pic} alt="profile" />
        </div>
        <div className="real_post_right">
          <strong>{post.author}</strong>
          <span>{post.post}</span>
        </div>
      </div>

      {/* comments */}
      {
        comments.length > 0 ? (
          <div className="comments">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comments__left">
                  <img className="avatar" src={comment.profile_pic} alt="profile" />
                </div>
                <div className="comments__right">
                  <div className="comments__right_top">
                    <strong>{comment.commentator}</strong>
                    <span>{comment.comment}</span>
                    <div className="like_icon">
                    {comment.liked ? (
          <FavoriteIcon style={{color: "red"}} onClick={() => {
            addLike(comment.id);
          }} />
        ) : (
          <FavoriteBorderIcon onClick={() => {
            addLike(comment.id);
          }} />
        )}
                    </div>
                  </div>
                  <div className="comments__extras">
                    <span>{comment.date_posted}</span>
                    <span>{comment.likes} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
            <p className="msg">No Comments Found!!!</p >
          )
      }
      <form className="add_comment" onSubmit={handleSubmit}>
        <SendIcon />
        <input type="text" required placeholder="Add a comment..." className="comment_box" value={comment} onChange={(e) => {
          setComment(e.target.value);
        }} />
        <button type="submit" className="btn btn-primary post-btn">Post</button>
      </form>
    </div>
  );

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  return (
    <div className="comments">
      <div className="comments__header">
        Comments
      </div>
      {msg && <p className="msg">{msg}</p>}
      {component}
    </div>
  );
}

export default Comments;