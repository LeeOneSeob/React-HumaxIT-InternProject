import React from 'react';
import { Link } from 'react-router-dom';
import './css/style.css';
import UserHaeder from './headerUser';
import GuestHeader from './headerGuest';

class Header extends React.Component {
  render() {
    const { handleLogout } = this.props;

    return (
      <div>
        <div className="top-header">
          <div className="container">
            <div className="row">
              <div className="col-md-5 col-sm-5 col-xs-5">
                <ul className="tophead-link">
                  <li>
                    <div style={{ display: 'flex' }}>
                      <Link className="app-logo" to="/" title="Jambo">
                        <img src="/img/logo.png" alt="app logo" />
                      </Link>
                      <Link to="main" className="item">
                        {'Welcome to HumaxIT ClassRoom !'}
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-md-7 col-sm-7 col-xs-7 tophead-right">
                {localStorage.getItem('token') === undefined ||
                localStorage.getItem('token') === null ? (
                  <GuestHeader />
                ) : (
                  <UserHaeder onLogout={handleLogout} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
