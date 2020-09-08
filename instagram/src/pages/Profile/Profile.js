import React, { useEffect, useState } from 'react';

import { checkAuth, getToken } from '../../utils';
import Cookie from 'js-cookie';
import './Profile.css';

const Profile = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [msg, setMsg] = useState('');

  const logout = async () => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    await Cookie.remove('token');
    return window.location.replace('/login')
  }

  // get current user
  const getCurrentUser = () => {
    fetch('/api/get_current_user', {
      method: 'GET',
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setMsg('');
          setCurrentUser(data.user);
        } else {
          setMsg('Oops, Some error happened!');
        }
      })
      .catch(e => {
        setMsg('Oops, Some error happened!');
      })
  }

  useEffect(getCurrentUser, []);

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  const component = currentUser ? (
    <div>
      <div className="profile__header">
      <span className="profile__header__username">
        {currentUser.username}
        </span>
      <div className="profile__header__logout">
        <button onClick={logout} className="btn btn-primary" href="/logout">Logout</button>
      </div>
    </div>

    <div className="profile__body_top">
      <img className="profile__body_top__img" src={currentUser.profile_pic} alt="Profile" />
      <div>
  <span className="profile__number">{currentUser.posts}</span>
        <span className="profile__verbose">Posts</span>
      </div>
      <div>
  <span className="profile__number">{currentUser.followers}</span>
        <span className="profile__verbose">Followers</span>
      </div>
      <div>
  <span className="profile__number">{currentUser.following}</span>
        <span className="profile__verbose">Following</span>
      </div>
    </div>

    <div className="profile__body_middle">
  <p className="profile__body_middle__username">{currentUser.username}</p>
      <p className="profile__body_middle__profile">
        Bio:  
        {currentUser.bio}
        </p>
    </div>

    <a className="profile__body_edit-btn btn btn-primary" href="/edit_profile">Edit Profile</a>
    </div>
  ) : (
      <p className="msg">{msg}</p>
    );

  return (
    <div className="profile">
      {component}
    </div>
  );
}

export default Profile;