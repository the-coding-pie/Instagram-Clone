import React, { useState } from 'react';

import { checkAuth, getToken } from '../../utils';

import './Search.css';

const Search = () => {
  const [results, setResults] = useState('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const makeSearch = (search) => {
    if (!checkAuth()) {
      // if no token
      return window.location.replace('/login')
    }

    // make a formdata
    const formdata = new FormData();

    formdata.append('term', search);

    // make a request
    fetch('/api/search', {
      method: 'POST',
      body: formdata,
      headers: {
        'x-access-token': getToken()
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          setMessage('');
          setResults(data.users);
        } else if (data.status === 404) {
          setResults('');
          setMessage("Oops, No users found...");
        } else {
          setResults('');
          setMessage("Oops, Some error happened! Try Again...");
        }
      })
      .catch(e => {
        setResults('');
        setMessage("Oops, Some error happened! Try Again...");
      });
  }


  const output = results && (
    results.map(result => (
      <div key={result.id} className="user">
        <div>
        <img className="user__profile_pic" src={result.profile_pic} alt="profile pic" />
        <span className="user__username">
          {result.username}
        </span>
        </div>
        <div>
          <button className="btn btn-primary btn-follow" onClick={e => {
            e.preventDefault();
            fetch('/api/follow', {
              method: 'GET',
              headers: {
                'id': result.id,
                'x-access-token': getToken()
              }
            })
            .then(res => res.json())
            .then(data => {
              if (data.status === 200) {
                setResults(results.map(r => {
                  if (r.id === result.id) {
                    return {
                      ...r,
                      following: data.following
                    }
                  }
                  else {
                    return r;
                  }
                }));
              }
            })
            .catch(e => {
              setMessage('Oops, Some error happened!')
            })
          }}>{
            result.following ? 'Unfollow': 'Follow'
          }</button>
        </div>
      </div>
    ))
  );

  return (
    <div className="search">
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Search Users..." value={search} onChange={(e) => {
          setSearch(e.target.value);
          if (e.target.value !== '') {
            makeSearch(e.target.value);
          } 
        }} />
      </form>

      <p className="search__message">{message && message}</p>
      <div className="search__results">
        {output}
      </div>
    </div>
  );
}

export default Search;