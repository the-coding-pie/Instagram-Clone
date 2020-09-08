import React, { useContext } from 'react';

import './Home.css';
import { PostContext } from '../../contexts/PostContext';
import Post from '../../components/Post/Post';
import { checkAuth } from '../../utils';

const Home = (props) => {
  const { posts } = useContext(PostContext);

  const postList = posts.length > 0 ? (
    posts.map(post => (
      <Post key={post.id} public_id={post.public_id} id={post.id} author={post.author} liked={post.liked} profile_pic={post.profile_pic} img={post.img} likes={post.likes} post={post.post} />
    ))
  ) : (
    <p className="home__msg">Oops! No posts yet...</p>
  );

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }
  
  return (
    <div className="home">
      {postList}
    </div>
  );
}

export default Home;