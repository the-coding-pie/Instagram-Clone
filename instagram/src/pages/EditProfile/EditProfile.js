import React, { useState, useEffect } from 'react';

import './EditProfile.css';
import { checkAuth, getToken } from '../../utils';
import ErrorField from '../../components/ErrorField/ErrorField';

const EditProfile = (props) => {
  const [img, setImg] = useState();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    common: ''
  });

  // get current user
  const getCurrentUser = () => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }
    fetch('/api/get_current_user', {
      method: 'GET',
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setUsername(data.user.username);
          setEmail(data.user.email);
          setBio(data.user.bio ? data.user.bio : '');
        } else {
          setErrors({
            username: '',
            email: '',
            password: '',
            common: "Oops, something went wrong!"
          });
          
        }
      })
      .catch(e => {
        setErrors({
          username: '',
          email: '',
          password: '',
          common: "Oops, something went wrong!"
        });
      })
  }

  useEffect(getCurrentUser, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    const formdata = new FormData();

    formdata.append('username', username);
    formdata.append('email', email);
    formdata.append('bio', bio);

    if (img) {
      formdata.append('img', img);
    }

    fetch('/api/update_profile', {
      method: 'POST',
      body: formdata,
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          document.getElementById('file').value = null;
          window.location.replace('/profile');
        } else {
          switch (data.field) {
            case "username":
              setErrors({
                username: data.msg,
                email: '',
                common: ''
              });
              break;
            case "email":
              setErrors({
                username: '',
                email: data.msg,
                common: ''
              });
              break;
            case "common":
              setErrors({
                username: '',
                email: '',
                common: data.msg
              });
              break;
            default:
              setErrors({
                username: '',
                email: '',
                common: "Oops, something went wrong!"
              });
              break;
          }
        }
      })
      .catch(e => {
        setErrors({
          username: '',
          email: '',
          common: "Oops, something went wrong!"
        });
      })
  }

  if (!checkAuth()) {
    // if no token
    return window.location.replace('/login')
  }

  return (
    <div className="edit_profile">
      <p className="edit_profile__top">Edit Profile</p>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="edit_profile_img">
            <input type="file" id="file" onChange={
              e => setImg(e.target.files[0])} />
          </div>
          {errors.common && <ErrorField error={errors.common} />}
          <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
          {errors.username && <ErrorField error={errors.username} />}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          {errors.email && <ErrorField error={errors.email} />}
          <textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)}></textarea>
          <button type="submit" className="btn btn-primary">Update</button>
        </form>
    </div>
  );
}

export default EditProfile;