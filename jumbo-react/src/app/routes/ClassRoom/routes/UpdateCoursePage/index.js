import React from 'react';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { NotificationContainer } from 'react-notifications';
import { Link, withRouter } from 'react-router-dom';
import IntlMessages from 'util/IntlMessages';
import produce from 'immer';
import { env } from '../../data/config';

class UpdateCourse extends React.Component {
  state = {
    courseCode: '',
    courseTitle: '',
    courseDescription: '',
    courseStartDate: '',
    courseEndDate: '',
    groupCode: '',
  };

  componentDidMount = () => {
    this.getGroupName();
    const {
      courseCode,
      courseTitle,
      courseDescription,
      compareStartDate,
      compareEndDate,
    } = this.props.location.state.study;

    this.setState(
      produce(this.state, draft => {
        draft.courseCode = courseCode;
        draft.courseTitle = courseTitle;
        draft.courseDescription = courseDescription;
        draft.courseStartDate = compareStartDate;
        draft.courseEndDate = compareEndDate;
      }),
    );
  };

  handleChange = e => {
    this.setState(
      produce(this.state, draft => {
        draft[e.target.name] = e.target.value;
      }),
    );
    console.log(this.state);
  };

  handleRegister = async code => {
    try {
      if (!this.handleRegisterCheck()) {
        alert('모든항목을 입력해주세요.');
        return;
      }

      const {
        courseTitle,
        courseDescription,
        courseStartDate,
        courseEndDate,
        groupCode,
      } = this.state;

      const res = await axios.put(
        `${env.ServerURL}/api/study`,
        {
          courseCode: code,
          courseTitle,
          courseDescription,
          courseStartDate,
          courseEndDate,
          groupCode,
          // 멘토아이디는 토큰을 이용하여 전달
        },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );
      if (res.data === 1) {
        window.alert('강좌수정 성공');
        window.location.href = '/';
      } else {
        window.alert('강좌수정 실패');
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleRegisterCheck = () => {
    const { courseTitle, courseDescription, groupCode } = this.state;
    if (courseTitle === '' || courseDescription === '' || groupCode === '') {
      return false;
    }
    return true;
  };

  getGroupName = async () => {
    const res = await axios.get(`${env.ServerURL}/api/study/group`);
    const group = res.data;
    const groupNames = {
      name: `<option value='' selected>-- 강좌 그룹 선택 --</option>`,
    };

    group.forEach(object => {
      groupNames.name = `${groupNames.name}<option value=${object.groupCode}>${
        object.groupName
      }</option>`;
    });

    document.getElementById('groupSelect').innerHTML = groupNames.name;
  };

  render() {
    const {
      courseCode,
      courseTitle,
      courseDescription,
      courseStartDate,
      courseEndDate,
    } = this.state;

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
            <h2>Update an course</h2>
          </div>

          <div className="login-form">
            <form method="post" action="/">
              <TextField
                type="text"
                label="Title"
                name="courseTitle"
                onChange={this.handleChange}
                fullWidth
                margin="normal"
                variant="outlined"
                className="mt-0 mb-2"
                value={courseTitle}
              />

              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  type="text"
                  label="Description"
                  multiline
                  name="courseDescription"
                  rows="10"
                  fullWidth
                  className="mt-0 mb-2"
                  margin="normal"
                  variant="outlined"
                  onChange={this.handleChange}
                  value={courseDescription}
                />
              </div>

              <TextField
                type="date"
                onChange={this.handleChange}
                label="Start Date"
                value={courseStartDate}
                name="courseStartDate"
                fullWidth
                margin="normal"
                className="mt-0 mb-4"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />

              <TextField
                type="date"
                onChange={this.handleChange}
                label="End Date"
                value={courseEndDate}
                name="courseEndDate"
                fullWidth
                margin="normal"
                className="mt-0 mb-4"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <div margin="normal">
                <select
                  id="groupSelect"
                  name="groupCode"
                  className="form-control"
                  onChange={this.handleChange}
                  style={{ backgroundColor: 'white' }}
                  margin="normal"
                />
              </div>
              <div className="mb-3">
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => this.handleRegister(courseCode)}
                  // component={Link}
                  // to="/"
                  className="text-white"
                  style={{ marginTop: '15px' }}
                >
                  <IntlMessages id="appModule.regsiter" />
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

export default withRouter(UpdateCourse);
