import React, { useState, useContext } from 'react';
import base64 from 'base-64';
import cookies from 'js-cookie';
import { checkAuth } from '../../utils';

import './Login.css';

import Instagram from '../../assets/instagram.png';
import { Link, Redirect } from 'react-router-dom';
import ErrorField from '../../components/ErrorField/ErrorField';
import { AuthContext } from '../../contexts/AuthContext';

const Login = (props) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { signUpMsg, setSignUpMsg } = useContext(AuthContext);

  const [errors, setErrors] = useState({
    username: '',
    password: '',
    common: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const headers = new Headers({
      "Authorization": `Basic ${base64.encode(`${base64.encode(username)}:${base64.encode(password)}`)}`
    });

    fetch('/api/login', {
      method: 'GET',
      headers: headers
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          // everything went well, redirect to Login
          setUsername('');
          setPassword('');

          if (data['token']) {
            const token = data['token'];

            cookies.set('token', token, {
              expires: 2
            })

          }

          setSignUpMsg('');
          window.location.replace('/');
        } else {
          switch (data.field) {
            case "common":
              setErrors({
                username: '',
                password: '',
                common: data.msg
              })
              break;
            case "password":
              setErrors({
                username: '',
                common: '',
                password: data.msg
              })
              break;
            case "username":
              setErrors({
                password: '',
                common: '',
                username: data.msg
              })
              break;
            default:
              setErrors({
                username: '',
                password: '',
                common: "Oops, something went wrong!"
              })
              break;
          }
        }
      })
      .catch(e => {
        setErrors({
          username: '',
          password: '',
          common: "Oops, something went wrong!"
        })
      });
  }

  if (checkAuth()) {
    return <Redirect to={{
      pathname: '/'
    }} />
  }

  return (
    <div className="container">
      <div className="login">
        {signUpMsg && <p className="success_msg">{signUpMsg}</p>}

        <img src={Instagram} alt="logo" className="login__logo" />

        <form onSubmit={handleSubmit} className="login__form">

          <input type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Username" required />
          {errors.username && <ErrorField error={errors.username} />}
          <input type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password" required />
          {errors.password && <ErrorField error={errors.password} />}
          {errors.common && <ErrorField error={errors.common} />}
          <button type="submit" className="btn btn-primary">Log in</button>
        </form>
        <div className="msg">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;