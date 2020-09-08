import React from 'react';

import './Navbar.css';

import { NavLink } from 'react-router-dom';

import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink to="/" exact>
        <HomeOutlinedIcon />
      </NavLink>
      <NavLink to="/search">
        <SearchOutlinedIcon />
      </NavLink>
      <NavLink to="/newpost">
        <AddBoxOutlinedIcon />
      </NavLink>
      <NavLink to="/profile">
        <AccountCircleOutlinedIcon />
      </NavLink>
    </nav>
  );
}

export default Navbar;