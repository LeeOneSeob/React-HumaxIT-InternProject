import React from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { NotificationContainer } from 'react-notifications';
import { Link, withRouter } from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import produce from 'immer';
import { env } from '../../data/config';

class SignUP extends React.Component {
  state = {
    name: '',
    userId: '',
    password: '',
    checkPassword: '',
    phone: '',
    email: '',
    idCheck: false,
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

  handleIdCheck = async () => {
    try {
      const res = await axios.get(
        `${env.ServerURL}/api/member/check/${this.state.userId}`,
      );

      if (res.data === true) {
        window.alert('중복된 아이디가 존재합니다.');
        this.setState(
          produce(this.state, draft => {
            draft.idCheck = false;
          }),
        );
      } else {
        window.alert('아이디 사용 가능합니다.');
        this.setState(
          produce(this.state, draft => {
            draft.idCheck = true;
          }),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleRegister = async () => {
    const { idCheck } = this.state;
    try {
      if (this.handleRegisterCheck() === 1) {
        alert('모든항목을 입력해주세요.');
        return;
      }

      if (this.handleRegisterCheck() === 2) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (!idCheck) {
        alert('아이디 체크 후 등록하세요.');
        return;
      }

      const res = await axios.post(`${env.ServerURL}/api/member`, {
        name: this.state.name,
        userId: this.state.userId,
        password: this.state.password,
        phone: this.state.phone,
        email: this.state.email,
      });

      if (res.data === false) {
        window.alert('회원가입 실패');
      } else {
        window.alert('회원가입 성공');
        window.location.href = '/app/login';
      }
    } catch (err) {
      console.log(err);
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
    const { name, userId, password, checkPassword, phone, email } = this.state;

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
            <h2>
              <IntlMessages id="appModule.createAccount" />
            </h2>
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
                defaultValue={name}
                margin="normal"
                className="mt-0 mb-2"
              />

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  type="text"
                  onChange={this.handleChange}
                  id="required"
                  label="id"
                  name="userId"
                  fullWidth
                  defaultValue={userId}
                  margin="normal"
                  className="mt-0 mb-2"
                />

                <Button
                  color="primary"
                  variant="contained"
                  className="text-white"
                  style={{ height: '35px' }}
                  onClick={this.handleIdCheck}
                >
                  {`Check`}
                </Button>
              </div>

              <TextField
                type="password"
                onChange={this.handleChange}
                id="required"
                label="password"
                name="password"
                fullWidth
                defaultValue={password}
                margin="normal"
                className="mt-0 mb-4"
              />

              <TextField
                type="password"
                onChange={this.handleChange}
                id="required"
                label="check password"
                name="checkPassword"
                fullWidth
                defaultValue={checkPassword}
                margin="normal"
                className="mt-0 mb-4"
              />
              <div id="checkPwd" />
              <TextField
                type="text"
                onChange={this.handleChange}
                id="required"
                label="email"
                name="email"
                fullWidth
                defaultValue={email}
                margin="normal"
                className="mt-0 mb-4"
              />

              <TextField
                type="text"
                onChange={this.handleChange}
                id="required"
                label="phone"
                name="phone"
                fullWidth
                defaultValue={phone}
                margin="normal"
                className="mt-0 mb-4"
              />

              <div className="mb-3">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={this.handleRegister}
                  // component={Link}
                  // to="/"
                  className="text-white"
                >
                  <IntlMessages id="appModule.regsiter" />
                </Button>
              </div>
              <p>
                <IntlMessages id="appModule.hvAccount" />
                <Link to="/app/login" className="ml-1">
                  <IntlMessages id="appModule.signIn" />
                </Link>
              </p>
            </form>
          </div>
        </div>
        <NotificationContainer />
      </div>
    );
  }
}

export default withRouter(SignUP);
