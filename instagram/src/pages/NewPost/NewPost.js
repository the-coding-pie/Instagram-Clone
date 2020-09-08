import React, { useState, useContext } from 'react';

import './NewPost.css';
import { PostContext } from '../../contexts/PostContext';
import { getToken, checkAuth } from '../../utils';

const NewPost = (props) => {
  const [img, setImg] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const { posts, setPosts } = useContext(PostContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    // make a formdata
    const formdata = new FormData();

    formdata.append('img', img);
    formdata.append('text', text);

    // make a request
    fetch('/api/newpost', {
      method: 'POST',
      body: formdata,
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setPosts([
            data.post,
            ...posts
          ]);
  
          document.getElementById('file').value = null;
          setText('');
  
          props.history.push('/');
        } else {
        setError("Oops, Some error happened! Try Again...");

        }
      })
      .catch(e => {
        setError("Oops, Some error happened! Try Again...");
      });
  }

  return (
    <div className="newpost">
      {error && <p className="newpost__error">Oops, Some Error happened! Try Again...</p>}
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Write a caption" value={text} onChange={
          e => setText(e.target.value)
        } required>
        </textarea>
        <input type="file" id="file" onChange={
          e => setImg(e.target.files[0])
        } required />
        <button type="submit" className="btn btn-primary share_btn">Share</button>
      </form>
    </div>
  );
}

export default NewPost;