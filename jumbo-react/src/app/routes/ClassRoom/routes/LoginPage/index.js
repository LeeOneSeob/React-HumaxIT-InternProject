import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IntlMessages from 'util/IntlMessages';
import 'typeface-roboto';
import Typography from '@material-ui/core/Typography';
import produce from 'immer';
import { env } from '../../data/config';

class Login extends React.Component {
  state = {
    id: '',
    password: '',
  };

  handleChange = e => {
    this.setState(
      produce(this.state, draft => {
        draft[e.target.name] = e.target.value;
      }),
    );
  };

  onClick = async () => {
    const { renewMyInfo } = this.props;
    try {
      const res = await axios.get(`${env.ServerURL}/api/member`, {
        headers: {
          uid: this.state.id,
          pwd: this.state.password,
        },
      });

      if (res.data === false) {
        window.alert('잘못된 정보입니다.');
      } else {
        window.alert('로그인 성공.');
        renewMyInfo(res.data.user, res.data.token);
      }
    } catch (err) {
      console.log(err);
    }
  };

  render() {
    const { id, password } = this.state;
    return (
      <div
        className="login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3"
        style={{ marginTop: '100px' }}
      >
        <div className="login-content">
          <div
            className="login-header mb-4"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <Link className="app-logo" to="/" title="Jambo">
              <img
                src="/img/logo.png"
                alt="app logo"
                style={{ width: '225px', height: '100px' }}
              />
            </Link>
          </div>

          <div className="login-form">
            <form>
              <fieldset>
                <TextField
                  id="id"
                  label="ID"
                  name="id"
                  fullWidth
                  onChange={this.handleChange}
                  defaultValue={id}
                  margin="normal"
                  className="mt-1"
                />
                <TextField
                  type="password"
                  id="password1"
                  label={<IntlMessages id="appModule.password" />}
                  name="password"
                  fullWidth
                  onChange={this.handleChange}
                  defaultValue={password}
                  margin="normal"
                  className="mt-1"
                />
                <div className="mt-1 mb-2 d-flex justify-content-between align-items-center">
                  <FormControlLabel
                    control={<Checkbox color="primary" value="gilad" />}
                    label={<IntlMessages id="appModule.rememberMe" />}
                  />

                  <div>
                    <Link
                      to="/app/app-module/forgot-password-2"
                      title="Reset Password"
                    >
                      <IntlMessages id="appModule.forgotPassword" />
                    </Link>
                  </div>
                </div>

                <Button
                  color="primary"
                  variant="contained"
                  // component={Link}
                  // to="/"
                  className="text-white"
                  onClick={this.onClick}
                >
                  <Typography variant="button" style={{ color: 'white' }}>
                    {'Sign in'}
                  </Typography>
                </Button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
