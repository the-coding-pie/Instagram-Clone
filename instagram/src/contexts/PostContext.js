import React, { createContext, useState, useEffect } from 'react';
import { getToken } from '../utils';

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);

  const getPosts = () => {
    fetch('/api/posts', {
      headers: {
        'x-access-token': getToken()
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 200) {
        setPosts(data.posts);
      } else {
        setPosts('');
      }
    })
    .catch(e => {
      setPosts('');
    });
  }

  useEffect(getPosts, []);

  return (
    <PostContext.Provider value={{
      posts,
      setPosts
    }}>
      {children}
    </PostContext.Provider>
  );
}

export default PostContextProvider;