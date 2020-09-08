import React from 'react';

import './Header.css';

import CameraAltOutlinedIcon from '@material-ui/icons/CameraAltOutlined';
import Instagram from '../../assets/instagram.png';

const Header = () => {
  return (
    <header className="header">
      <div>
        <CameraAltOutlinedIcon className="header__camera_icon" />
      </div>
      <div>
        <img src={Instagram} alt="logo" className="header__logo" />
      </div>
      <div></div>
    </header>
  );
}

export default Header;