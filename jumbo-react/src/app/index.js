import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Header from 'app/routes/ClassRoom/common/header';
import Footer from 'components/Footer';
import axios from 'axios';
import { COLLAPSED_DRAWER, FIXED_DRAWER } from 'constants/ActionTypes';
import { isIOS, isMobile } from 'react-device-detect';
import asyncComponent from '../util/asyncComponent';
import LoginPage from './routes/ClassRoom/routes/LoginPage';

class App extends React.Component {
  state = {
    myInfo: {},
  };

  // 로그인
  handleLogin = (data, token) => {
    this.setState({
      myInfo: data,
    });
    localStorage.setItem('myInfo', JSON.stringify(data));
    localStorage.setItem('token', token); // 토큰 저장
    window.location.href = '/';
    // this.render();
  };

  // 로그아웃
  handleLogout = () => {
    if (window.confirm('정말 로그아웃 하시겠습니까?')) {
      this.setState = {
        myInfo: {},
        isLogged: false,
      };
      localStorage.removeItem('myInfo');
      localStorage.removeItem('token');
      window.location.href = '/app/login';
      // this.render();
    }
  };

  // 개인정보 수정
  handleMyInfo = data => {
    this.setState({
      myInfo: data,
    });
    localStorage.setItem('myInfo', data);
  };

  render() {
    const { match, drawerType } = this.props;
    const { myInfo } = this.state;
    // eslint-disable-next-line no-nested-ternary
    const drawerStyle = drawerType.includes(FIXED_DRAWER)
      ? 'fixed-drawer'
      : drawerType.includes(COLLAPSED_DRAWER)
      ? 'collapsible-drawer'
      : 'mini-drawer';

    // set default height and overflow for iOS mobile Safari 10+ support.
    if (isIOS && isMobile) {
      document.body.classList.add('ios-mobile-view-height');
    } else if (document.body.classList.contains('ios-mobile-view-height')) {
      document.body.classList.remove('ios-mobile-view-height');
    }

    return (
      <div className={`app-container ${drawerStyle}`}>
        <div className="app-main-container">
          <div>
            <Header handleLogout={this.handleLogout} myInfo={myInfo} />
          </div>

          <main className="app-main-content-wrapper">
            <div className="app-main-content">
              <div style={{ marginLeft: '20px', marginRight: '20px' }}>
                <Switch>
                  <Route
                    path={`${match.url}/login`}
                    component={() => (
                      <LoginPage renewMyInfo={this.handleLogin} />
                    )}
                  />
                  <Route
                    path={`${match.url}/main`}
                    component={asyncComponent(() =>
                      import('./routes/ClassRoom'),
                    )}
                  />
                  <Route
                    path={`${match.url}/signup`}
                    component={asyncComponent(() =>
                      import('./routes/ClassRoom/routes/SignUpPage'),
                    )}
                  />
                  <Route
                    path={`${match.url}/mypage`}
                    component={asyncComponent(() =>
                      import('./routes/ClassRoom/routes/MyPage'),
                    )}
                  />
                  <Route
                    path={`${match.url}/classroom`}
                    component={asyncComponent(() =>
                      import('./routes/ClassRoom/routes/ClassRoomPage'),
                    )}
                  />
                  <Route
                    path={`${match.url}/openCourse`}
                    component={asyncComponent(() =>
                      import('./routes/ClassRoom/routes/OpenCoursePage'),
                    )}
                  />
                  <Route
                    path={`${match.url}/updateCourse`}
                    component={asyncComponent(() =>
                      import('./routes/ClassRoom/routes/UpdateCoursePage'),
                    )}
                  />
                  <Route
                    component={asyncComponent(() =>
                      import('components/Error404'),
                    )}
                  />
                </Switch>
              </div>
            </div>
            <Footer />
          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ settings }) => {
  const { drawerType, navigationStyle, horizontalNavPosition } = settings;
  return { drawerType, navigationStyle, horizontalNavPosition };
};
export default withRouter(connect(mapStateToProps)(App));
