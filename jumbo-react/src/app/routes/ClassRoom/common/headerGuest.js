import React from 'react';
import { Link } from 'react-router-dom';
import PermIdentity from '@material-ui/icons/PermIdentity';
import Home from '@material-ui/icons/Home';
import Lock from '@material-ui/icons/Lock';
import './css/style.css';

class GuestHeader extends React.Component {
  render() {
    return (
      <ul className="tophead-link">
        <li>
          <Link to="/app/main" className="item">
            <Home className="iconAlign" />
            {'Home'}
          </Link>
        </li>
        <li>
          <Link to="/app/login" className="item">
            <Lock className="iconAlign" />
            {/* <i className="fa fa-lock" aria-hidden="true" /> */}
            {'Sign in'}
          </Link>
        </li>
        <li>
          <Link to="/app/signup" className="item">
            <PermIdentity className="iconAlign" />
            {/* <i className="fa fa-lock" aria-hidden="true" /> */}
            {'Sign up'}
          </Link>
        </li>
      </ul>
    );
  }
}

export default GuestHeader;
