import React from 'react';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import { env } from '../data/config';

class StudyListItem extends React.Component {
  islogin = () => {
    if (localStorage.getItem('token')) {
      return true;
    }
    return false;
  };

  getLoginId = () => {
    if (this.islogin()) {
      return JSON.parse(localStorage.getItem('myInfo')).userId;
    }
    return false;
  };

  isJoin = (data, courseCode) => {
    const isJoin = {};
    if (!data) {
      return false;
    }

    data.forEach(element => {
      if (element.courseCode === courseCode) {
        isJoin.value = true;
      }
    });

    if (isJoin.value) {
      return true;
    }
    return false;
  };

  insertJoin = async (courseCode, courseTitle) => {
    if (!this.islogin()) {
      window.alert('로그인이 필요합니다.');
      window.location.href = '/app/login';
      return;
    }

    if (window.confirm(`${courseTitle} 강의를 가입하시겠습니까?`)) {
      try {
        const res = await axios.post(
          `${env.ServerURL}/api/study/join`,
          {
            courseCode,
          },
          {
            headers: {
              token: localStorage.getItem('token'),
            },
          },
        );

        if (res.data === 0) {
          window.alert('토큰이 만료되었습니다. 재로그인 해주세요.');
          window.location.href = '/app/login';
        }

        if (res.data === 1) {
          window.location.href = '/';
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  deleteJoin = async (courseCode, courseTitle) => {
    if (window.confirm(`${courseTitle} 강의를 탈퇴하시겠습니까?`)) {
      try {
        const res = await axios.delete(
          `${env.ServerURL}/api/study/join/${courseCode}`,
          {
            headers: {
              token: localStorage.getItem('token'),
            },
          },
        );

        if (res.data === 0) {
          window.alert('토큰이 만료되었습니다. 재로그인 해주세요.');
          window.location.href = '/app/login';
        }

        if (res.data === 1) {
          window.location.href = '/';
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  deleteCourse = async (courseCode, courseTitle) => {
    if (window.confirm(`${courseTitle} 강의를 삭제하시겠습니까?`)) {
      try {
        const res = await axios.delete(
          `${env.ServerURL}/api/study/${courseCode}`,
          {
            headers: {
              token: localStorage.getItem('token'),
            },
          },
        );

        if (res.data === 0) {
          window.alert('토큰이 만료되었습니다. 재로그인 해주세요.');
          window.location.href = '/app/login';
        }

        if (res.data === 1) {
          window.location.href = '/';
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  render() {
    const {
      courseCode,
      courseTitle,
      courseDescription,
      courseNumPeople,
      courseStartDate,
      courseEndDate,
      userName,
      groupName,
      groupPicture,
      // groupCode,
      mentoId,
    } = this.props.study;
    const { joinedListData } = this.props;
    return (
      <div className="card product-item-vertical hoverable animation flipInX">
        <div className="row d-flex align-items-sm-center">
          <div className="col-xl-3 col-lg-4 col-md-3 col-12">
            <div className="card-header border-0 p-0">
              <div className="card-image">
                <div className="grid-thumb-equal">
                  <img
                    className="img-fluid"
                    src={groupPicture}
                    alt="스터디 그룹 이미지..."
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-6 col-lg-5 col-md-6 col-12">
            <div className="card-body">
              <small className="text-grey text-darken-2">
                {`(${courseStartDate} ~ ${courseEndDate})`}
              </small>
              <div className="product-details">
                <h3
                  className="card-title fw-regular"
                  style={{ fontWeight: 'bold' }}
                >
                  {`스터디(${groupName}) : ${courseTitle}`}
                </h3>

                <p style={{ textIndent: '1em' }}>{courseDescription}</p>
                <div style={{ justifyContent: 'flex-end', display: 'flex' }}>
                  <h3 style={{ fontWeight: 'bold' }}>{`${userName} 멘토`}</h3>
                  <h6
                    className="text-success"
                    style={{ paddingLeft: '10px', paddingTop: '7px' }}
                  >
                    {`${courseNumPeople}명 참여중`}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-lg-3 col-md-3 col-12">
            <div className="card-footer border-0 text-center bg-white">
              <div className="cart-btn mb-2">
                <div>
                  {this.isJoin(joinedListData, courseCode) ? (
                    <div>
                      <div style={{ margin: '5px' }}>
                        <Link
                          to={{
                            pathname: '/app/classroom',
                            state: { study: this.props.study },
                          }}
                        >
                          <Button
                            variant="contained"
                            className="bg-primary text-white"
                          >
                            {'클래스룸'}
                          </Button>
                        </Link>
                      </div>

                      <div style={{ margin: '5px' }}>
                        <Link to="/">
                          <Button
                            onClick={() =>
                              this.deleteJoin(courseCode, courseTitle)
                            }
                            variant="contained"
                            className="bg-primary text-white"
                          >
                            {'스터디 탈퇴'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : null}

                  {mentoId === this.getLoginId() ? (
                    <div>
                      <div style={{ margin: '5px' }}>
                        <Link
                          to={{
                            pathname: '/app/updateCourse',
                            state: { study: this.props.study },
                          }}
                        >
                          <Button
                            variant="contained"
                            className="bg-primary text-white"
                          >
                            {'강좌수정'}
                          </Button>
                        </Link>
                      </div>
                      <div style={{ margin: '5px' }}>
                        <Link to="/">
                          <Button
                            variant="contained"
                            className="bg-primary text-white"
                            onClick={() =>
                              this.deleteCourse(courseCode, courseTitle)
                            }
                          >
                            {'강좌삭제'}
                          </Button>
                        </Link>
                      </div>
                      <div style={{ margin: '5px' }}>
                        <Link
                          to={{
                            pathname: '/app/classroom',
                            state: { study: this.props.study },
                          }}
                        >
                          <Button
                            variant="contained"
                            className="bg-primary text-white"
                          >
                            {'클래스룸'}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>

                {this.isJoin(joinedListData, courseCode) ||
                mentoId === this.getLoginId() ? null : (
                  <Link to="/" id={courseCode}>
                    <Button
                      onClick={() => this.insertJoin(courseCode, courseTitle)}
                      variant="contained"
                      className="bg-primary text-white"
                    >
                      {'스터디 참여'}
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudyListItem;
