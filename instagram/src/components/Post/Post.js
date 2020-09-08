import React, { useContext, useState } from 'react';

import { getToken, checkAuth } from '../../utils';

import './Post.css';

import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import CommentOutlinedIcon from '@material-ui/icons/CommentOutlined';

import jwt from 'jsonwebtoken';
import Cookie from 'js-cookie';

import { PostContext } from '../../contexts/PostContext';
import ErrorField from '../../components/ErrorField/ErrorField';
import { Link } from 'react-router-dom';

const Post = ({ id, liked, public_id, profile_pic, author, img, likes, post }) => {
  const { posts, setPosts } = useContext(PostContext);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  }

  const deletePost = (pid, post_id) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    fetch('/api/delete_post', {
      method: 'DELETE',
      headers: {
        'public_id': pid,
        'post_id': post_id,
        'x-access-token': getToken()
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        toggleModal();
        setError('');
        
        window.location.reload('/');
      } else {
        toggleModal();
        setError('Oops, Some, error, happened!');
      }
    })
    .catch(e => {
      toggleModal();
      setError('Oops, Some, error, happened!');
    })  
  }

  const copyLink = () => {
    // copy link to clipboard
    console.log('link copied')
  }

  const isAuthor = (pid) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    const { public_id } = jwt.decode(Cookie.get('token'));

    if (public_id === pid) {
      return true;
    }

    return false;
  }

  const addLike = () => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }
    try {
      const formdata = new FormData();
  
      formdata.append('post_id', id);
  
      fetch('/api/like', {
        body: formdata,
        method: 'POST',
        headers: {
          'x-access-token': getToken()
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          // do something
          setPosts(posts.map(post => {
            if (post.id !== id) {
              return post;
            } 
            return {
              ...post,
              liked: data.liked,
              likes: data.likes
            }
          }));
  
          setError('');
        } else {
          setError(data.msg);
        }
      })
      .catch(e => {
        setError("Oops, Some error happened!");
      })
    } catch (e) {
      setError("Oops, Some error happened!");
    }
  }

  
  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  return (
    <div className="post">
      {modal && <div className="modal">
        <div className="content">
        <span onClick={toggleModal} className="close">&times;</span>
        {isAuthor(public_id) ? (
          <>
          <li onClick={() => deletePost(public_id, id)}>Delete</li>
          {
            liked? (
              <li onClick={() => {
                addLike();
                toggleModal();
              }}>Dislike</li>
            ) : (
              <li onClick={() => {
                addLike();
                toggleModal();
              }}>Like</li>
            )
          }
          </>
        ) : (
          <>
            {
              liked? (
                <li onClick={() => {
                  addLike();
                  toggleModal();
                }}>Dislike</li>
              ) : (
                <li onClick={() => {
                  addLike();
                  toggleModal();
                }}>Like</li>
              )
            }
          </>
        )}
        </div>
      </div>}
      <div className="post__top">
      <img alt={author} src={profile_pic} className="avatar" />
        <strong>{author}</strong>
        <MoreHorizIcon onClick={toggleModal} className="more" />
      </div>
      <div className="post__img">
        <img onDoubleClick={addLike} src={img} alt="post-img" />
      </div>

      {error && <ErrorField error={error} />}
      
      <div className="post__fun">
        {liked ? (
          <FavoriteIcon style={{color: "red"}} onClick={addLike} />
        ) : (
          <FavoriteBorderIcon onClick={addLike} />
        )}
        <Link to={`/comments/${id}`} className="comment_link">
          <CommentOutlinedIcon />
        </Link>
      </div>
      <div className="post__likes">
        <strong>{likes} likes</strong>
      </div>
      <div className="post__post">
        <strong>{author} </strong>{post}
      </div>
    </div>
  );
}

export default Post;