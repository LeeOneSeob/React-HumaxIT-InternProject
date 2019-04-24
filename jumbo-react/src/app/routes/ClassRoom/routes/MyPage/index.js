import React from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { NotificationContainer } from 'react-notifications';
import { Link, withRouter } from 'react-router-dom';
import produce from 'immer';
import { env } from '../../data/config';

class MyPage extends React.Component {
  state = {
    name: JSON.parse(localStorage.getItem('myInfo')).userName,
    userId: JSON.parse(localStorage.getItem('myInfo')).userId,
    password: '',
    checkPassword: '',
    phone: JSON.parse(localStorage.getItem('myInfo')).userPhone,
    email: JSON.parse(localStorage.getItem('myInfo')).userEmail,
  };

  handleChange = e => {
    this.setState(
      produce(this.state, draft => {
        draft[e.target.name] = e.target.value;
      }),
    );

    if (e.target.name === 'checkPassword') {
      this.handlePwdCheck(e.target.value);
    }
  };

  handlePwdCheck = data => {
    const checkPwd = document.getElementById('checkPwd');
    if (data === '') {
      checkPwd.innerHTML = ' ';
    } else if (this.state.password !== data) {
      checkPwd.style.color = 'red';
      checkPwd.style.textAlign = 'left';
      checkPwd.innerHTML = '<p>pawssword가 일치하지 않습니다.</p>';
    } else {
      checkPwd.style.color = 'blue';
      checkPwd.style.textAlign = 'left';
      checkPwd.innerHTML = '<p>pawssword가 일치합니다.</p>';
    }
  };

  handleRegister = async () => {
    try {
      if (this.handleRegisterCheck() === 1) {
        alert('모든항목을 입력해주세요.');
        return;
      }

      if (this.handleRegisterCheck() === 2) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      const res = await axios.put(
        `${env.ServerURL}/api/member`,
        {
          name: this.state.name,
          password: this.state.password,
          phone: this.state.phone,
          email: this.state.email,
        },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );

      if (res.data === 1) {
        window.alert('회원가입 수정을 성공했습니다.');
        window.location.href = '/';
      } else {
        window.alert('토큰이 만료되었습니다. 재로그인 해주세요.');
        window.location.href = '/';
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleDelete = async () => {
    if (window.confirm('회원탈퇴 하시겠습니까?')) {
      try {
        const res = await axios.delete(`${env.ServerURL}/api/member`, {
          headers: {
            token: localStorage.getItem('token'),
          },
        });

        if (res.data === 1) {
          localStorage.removeItem('token');
          localStorage.removeItem('myInfo');
          window.location.href = '/';
        } else {
          window.alert('토큰이 만료되었습니다. 재로그인 해주세요.');
          window.location.href = '/app/login';
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  handleRegisterCheck = () => {
    const { name, userId, password, checkPassword, phone, email } = this.state;
    if (
      name === '' ||
      userId === '' ||
      password === '' ||
      phone === '' ||
      email === ''
    ) {
      return 1;
    }

    if (password !== checkPassword) {
      return 2;
    }
    return true;
  };

  render() {
    const { name, userId, phone, email } = this.state;

    return (
      <div
        className="login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3"
        style={{ marginTop: '20px', marginBottom: '20px' }}
      >
        <div className="login-content text-center">
          <div className="login-header">
            <Link className="app-logo" to="/" title="Jambo">
              <img
                src="/img/logo.png"
                alt="app logo"
                style={{ width: '225px', height: '100px' }}
              />
            </Link>
          </div>

          <div className="mb-4">
            <h2>Update Account</h2>
          </div>

          <div className="login-form">
            <form method="post" action="/">
              <TextField
                type="text"
                id="signUpName"
                label="Name"
                name="name"
                onChange={this.handleChange}
                fullWidth
                margin="normal"
                className="mt-0 mb-2"
                value={name}
              />

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  type="text"
                  label="id"
                  name="userId"
                  fullWidth
                  margin="normal"
                  className="mt-0 mb-2"
                  value={userId}
                />
              </div>

              <TextField
                type="password"
                onChange={this.handleChange}
                label="password"
                name="password"
                fullWidth
                margin="normal"
                className="mt-0 mb-4"
              />

              <TextField
                type="password"
                onChange={this.handleChange}
                label="check password"
                name="checkPassword"
                fullWidth
                margin="normal"
                className="mt-0 mb-4"
              />
              <div id="checkPwd" />
              <TextField
                type="text"
                onChange={this.handleChange}
                label="email"
                name="email"
                fullWidth
                margin="normal"
                className="mt-0 mb-4"
                value={email}
              />

              <TextField
                type="text"
                onChange={this.handleChange}
                label="phone"
                name="phone"
                fullWidth
                margin="normal"
                className="mt-0 mb-4"
                value={phone}
              />

              <div className="mb-3">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.handleRegister}
                  className="text-white"
                  style={{ margin: '10px' }}
                >
                  {'update'}
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.handleDelete}
                  className="text-white"
                  style={{ margin: '10px' }}
                >
                  {'delete'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default withRouter(MyPage);
