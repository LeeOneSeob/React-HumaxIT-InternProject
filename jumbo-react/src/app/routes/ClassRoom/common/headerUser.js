import React from 'react';
import { Link } from 'react-router-dom';
import Fingerprint from '@material-ui/icons/Fingerprint';
import Home from '@material-ui/icons/Home';
import Block from '@material-ui/icons/Block';
import Add from '@material-ui/icons/Add';
import './css/style.css';

class UserHaeder extends React.Component {
  render() {
    const { onLogout } = this.props;

    return (
      <ul className="tophead-link">
        <li>
          <Link to="/app/main" className="item">
            <Home className="iconAlign" />
            {'Home'}
          </Link>
        </li>
        <li>
          <Link to="#1" className="item" onClick={onLogout}>
            <Block className="iconAlign" />
            {/* <i className="fa fa-lock" aria-hidden="true" /> */}
            {'Logout'}
          </Link>
        </li>
        <li>
          <Link to="/app/mypage" className="item">
            <Fingerprint className="iconAlign" />
            {/* <i className="fa fa-lock" aria-hidden="true" /> */}
            {'My Page'}
          </Link>
        </li>
        <li>
          <Link to="/app/openCourse" className="item">
            <Add className="iconAlign" />
            {/* <i className="fa fa-lock" aria-hidden="true" /> */}
            {'Open Course'}
          </Link>
        </li>
      </ul>
    );
  }
}

export default UserHaeder;
