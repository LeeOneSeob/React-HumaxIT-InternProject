import React, { Component } from 'react';
import axios from 'axios';
import produce from 'immer';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Pagination from 'material-ui-flat-pagination';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { env } from '../../../data/config';
import AssignList from '../../../components/AssignList';

const theme = createMuiTheme();

class Assign extends Component {
  state = {
    assignList: '',
    open: false,
    assignTitle: '',
    assignDescription: '',
    assignDeadline: '',
    offset: 0,
    limit: 5,
    rowCont: 0,
  };

  componentDidMount = () => {
    console.log(`ddddd ${this.props.courseCode}`);
    this.getAssignments(
      this.props.courseCode,
      this.state.limit,
      this.state.offset,
    );
  };

  componentDidUpdate(prevProps, prevState) {
    const { offset } = this.state;
    const { courseCode } = this.props;
    if (offset !== prevState.offset) {
      this.getAssignments(courseCode);
    }
  }

  getAssignments = async courseCode => {
    console.log(`getAssignments ${courseCode}`);
    const { limit, offset } = this.state;
    if (!courseCode) return;

    try {
      const res = await axios.get(
        `${
          env.ServerURL
        }/api/classroom/assign/${courseCode}/${limit}/${offset}`,
        {
          params: {
            courseCode,
            limit,
            offset,
          },
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );

      if (res.data === 0) {
        window.alert('토큰이 만료되었습니다. 재로그인 해주세요.');
        window.location.href = '/app/login';
      }

      if (res.data) {
        this.setState(
          produce(this.state, draft => {
            // eslint-disable-next-line prefer-destructuring
            draft.assignList = res.data[0];
          }),
        );
        this.setState(
          produce(this.state, draft => {
            draft.rowCont = res.data[1][0].totalRow;
          }),
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  onDelete = async (assignCode, assignTitle) => {
    // 과제삭제(멘토)
    if (window.confirm(`${assignTitle} 강좌를 삭제하시겠습니까?`)) {
      try {
        const res = await axios.delete(
          `${env.ServerURL}/api/classroom/assign/${assignCode}`,
          {
            params: {
              assignCode,
            },
            headers: {
              token: localStorage.getItem('token'),
            },
          },
        );

        if (!res.data) {
          window.alert('토큰이 만료되었습니다. 재로그인 해주세요');
          window.location.href = '/app/login';
        }

        this.setState(
          produce(this.state, draft => {
            draft.assignList = this.state.assignList.filter(
              info => info.asignCode !== assignCode,
            );
          }),
        );
      } catch (err) {
        console.log(err);
      }
    }
  };

  onUpdate = async (
    assignCode,
    assignTitle,
    assignDescription,
    assignDeadline,
  ) => {
    // 과제수정(멘토)
    try {
      const res = await axios.put(
        `${env.ServerURL}/api/classroom/assign`,
        {
          assignCode,
          assignTitle,
          assignDescription,
          assignDeadline,
        },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );

      if (!res.data) {
        window.alert('토큰이 만료되었습니다. 재로그인 해주세요');
        window.location.href = '/app/login';
      }

      this.getAssignments(this.props.courseCode);
    } catch (err) {
      console.log(err);
    }
  };

  // eslint-disable-next-line consistent-return
  onInsert = async () => {
    // 과제등록(멘토)
    try {
      const { courseCode } = this.props;
      const { assignTitle, assignDescription, assignDeadline } = this.state;

      if (!assignTitle || !assignDescription || !assignDeadline) {
        window.alert('모든 항목을 입력해주세요');
        return false;
      }

      const res = await axios.post(
        `${env.ServerURL}/api/classroom/assign`,
        {
          assignTitle,
          assignDescription,
          assignDeadline,
          courseCode,
        },
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        },
      );

      if (!res.data) {
        window.alert('토큰이 만료되었습니다. 재로그인 해주세요');
        window.location.href = '/app/login';
      }
      this.handleClose();
      this.getAssignments(courseCode);
      this.setState(
        produce(this.state, draft => {
          draft.assignTitle = '';
          draft.assignDescription = '';
          draft.assignDeadline = '';
        }),
      );
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(
      produce(this.state, draft => {
        draft[name] = value;
      }),
    );
  };

  handleOffset = value => {
    this.setState(
      produce(this.state, draft => {
        draft.offset = value;
      }),
    );
  };

  // dialog
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { assignList, limit, offset, rowCont } = this.state;
    const { mentoId, courseCode } = this.props;
    const listDatas = {
      data: '',
    };

    if (assignList) {
      listDatas.data = assignList.map((assign, index) => {
        return (
          <AssignList
            key={index}
            assignment={assign}
            onDelete={this.onDelete}
            onUpdate={this.onUpdate}
            mentoId={mentoId}
            courseCode={courseCode}
          />
        );
      });
    }

    return (
      <div>
        <Paper>
          <List>{listDatas.data}</List>
        </Paper>
        <div style={{ textAlign: 'right' }}>
          {mentoId === JSON.parse(localStorage.getItem('myInfo')).userId ? (
            <Button
              color="primary"
              variant="contained"
              style={{ marginTop: '3px' }}
              onClick={this.handleClickOpen}
            >
              {'과제등록'}
            </Button>
          ) : null}

          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <MuiThemeProvider theme={theme}>
              <CssBaseline />
              <Pagination
                limit={limit}
                offset={offset}
                total={rowCont}
                onClick={(e, offset) => this.handleOffset(offset)}
              />
            </MuiThemeProvider>
          </div>

          <Dialog
            open={this.state.open}
            onClose={this.handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              {
                '- - - - - - - - - - - - - - - - - - - 과제 등록 - - - - - - - - - - - - - - - - - - -'
              }
            </DialogTitle>
            <DialogContent>
              <div style={{ margin: '20px' }}>
                <div>
                  <TextField
                    type="text"
                    label="과제제목"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    name="assignTitle"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <TextField
                    type="text"
                    label="과제설명"
                    multiline
                    rows="8"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    name="assignDescription"
                    onChange={this.handleChange}
                  />
                </div>
                <div>
                  <b style={{ fontSize: '20px' }}>마감기한 : </b>
                  <TextField
                    type="date"
                    name="assignDeadline"
                    onChange={this.handleChange}
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => this.onInsert()} color="primary">
                {'등록'}
              </Button>
              <Button onClick={this.handleClose} color="primary">
                {'취소'}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
    );
  }
}

export default Assign;
