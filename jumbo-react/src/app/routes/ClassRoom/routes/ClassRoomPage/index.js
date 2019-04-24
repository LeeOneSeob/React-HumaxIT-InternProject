import React, { Component } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import produce from 'immer';
import SimpleAppBar from '../../components/SimpleAppBar';
import SideBar from '../../components/SideBar';
import Assign from './AssignPage';
import Feedback from './FeedbackPage';
import SubmitAssign from './SubmitAssignPage';
import Notice from './NoticePage';
import { env } from '../../data/config';

class Classroom extends Component {
  state = {
    course: this.props.location.state.study,
    mento: '',
    selectedPageNum: 0,
  };

  componentDidMount = async () => {
    const { study } = this.props.location.state;
    await this.setState(
      produce(this.state, draft => {
        draft.course = study;
      }),
    );
    this.getMentoInfo(study.mentoId);
  };

  getMentoInfo = async mId => {
    try {
      const res = await axios.get(
        `${env.ServerURL}/api/classroom/mento/${mId}`,
        {
          params: {
            mentoId: mId,
          },
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );

      if (res.data) {
        this.setState(
          produce(this.state, draft => {
            // eslint-disable-next-line prefer-destructuring
            draft.mento = res.data[0];
          }),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  handleSelectPage = number => {
    this.setState(
      produce(this.state, draft => {
        draft.selectedPageNum = number;
      }),
    );
  };

  render() {
    const {
      courseCode,
      courseTitle,
      courseStartDate,
      courseEndDate,
      groupName,
      mentoId,
    } = this.state.course;

    const { userName, userPhone, userEmail, userPhoto } = this.state.mento;

    return (
      <div>
        <div className="row">
          <div className="col-xl-12 col-lg-12 col-md-12 col-12">
            <div className="row">
              <div className="col-md-12">
                <SimpleAppBar titleText={`${groupName} : ${courseTitle}`} />
              </div>

              <div className="col-md-3">
                <Paper>
                  <div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <Avatar
                        alt="mento picture"
                        src={userPhoto}
                        style={{
                          width: '75px',
                          height: '85px',
                          margin: '10px',
                        }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                          marginTop: '17px',
                        }}
                      >
                        <h5 style={{ fontWeight: 'bold' }}>
                          {`이름 : ${userName} 멘토님`}
                        </h5>
                        <h5 style={{ fontWeight: 'bold' }}>
                          {`연락처 : ${userPhone}`}
                        </h5>
                        <h5 style={{ fontWeight: 'bold' }}>
                          {`이메일 : ${userEmail}`}
                        </h5>
                      </div>
                    </div>
                  </div>
                </Paper>
                <Paper style={{ marginTop: '5px' }}>
                  <SideBar
                    handleSelectPage={this.handleSelectPage}
                    mentoId={mentoId}
                  />
                </Paper>
              </div>
              <div className="col-md-9" id="classroomBody">
                {this.state.selectedPageNum === 0 && (
                  <Notice courseCode={courseCode} mentoId={mentoId} />
                )}
                {this.state.selectedPageNum === 1 && (
                  <Assign courseCode={courseCode} mentoId={mentoId} />
                )}
                {this.state.selectedPageNum === 2 && (
                  <SubmitAssign courseCode={courseCode} />
                )}
                {this.state.selectedPageNum === 3 && (
                  <Feedback courseCode={courseCode} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: 'bold', fontSize: '15px' }}>
            {`${courseStartDate} ~ ${courseEndDate}`}
          </p>
        </div>
      </div>
    );
  }
}

export default Classroom;
