import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './Main.css';
import Navbar from '../../components/Navbar/Navbar';
import Header from '../../components/Header/Header';
import Home from '../../pages/Home/Home';
import Search from '../../pages/Search/Search';
import NewPost from '../../pages/NewPost/NewPost';
import Profile from '../../pages/Profile/Profile';
import EditProfile from '../../pages/EditProfile/EditProfile';
import Comments from '../../pages/Comments/Comments';

const Main = () => {
  return (
    <Router>
      <Header />

      <div className="main">
        <Switch>
          <Route path="/search" component={Search} />
          <Route path="/newpost" component={NewPost} />
          <Route path="/profile" component={Profile} />
          <Route path="/edit_profile" component={EditProfile} />
          <Route path="/comments/:id" component={Comments} />
          <Route path="/" exact component={Home} />
        </Switch>
      </div>
      <Navbar />

    </Router>
  );
}

export default Main;