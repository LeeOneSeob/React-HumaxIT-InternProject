import React from 'react';
import Button from '@material-ui/core/Button';
import axios, { post } from 'axios';
import produce from 'immer';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { env } from '../data/config';

const pTagStyle = {
  textIndent: '10px',
};
const buttonStyle = {
  margin: '3px',
};
class AssignDetail extends React.Component {
  state = {
    // update 버튼 클릭 시 input으로 전환
    editing: false,
    open: false,
    assignCode: '',
    assignTitle: '',
    assignDescription: '',
    assignDeadline: '',
    submitAssignTitle: '',
    submitAssignDescription: '',
    submitAssignFile: '',
  };

  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  componentDidUpdate(prevProps, prevState) {
    const { assignment, onUpdate } = this.props;
    if (!prevState.editing && this.state.editing) {
      // editing 값이 false -> true 로 전환 될 때
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        produce(this.state, draft => {
          draft.assignCode = assignment.asignCode;
          draft.assignTitle = assignment.asignTitle;
          draft.assignDescription = assignment.asignDescription;
          draft.assignDeadline = assignment.asignDeadline;
        }),
      );
    }

    if (prevState.editing && !this.state.editing) {
      // editing 값이 true -> false 로 전환 될 때
      const {
        assignCode,
        assignTitle,
        assignDescription,
        assignDeadline,
      } = this.state;
      onUpdate(assignCode, assignTitle, assignDescription, assignDeadline);
    }
  }

  handleToggleEdit = () => {
    const { editing } = this.state;
    this.setState({ editing: !editing });
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState(
      produce(this.state, draft => {
        draft[name] = value;
      }),
    );
  };

  onInsert = async fileKey => {
    try {
      const { courseCode } = this.props;
      const { submitAssignTitle, submitAssignDescription } = this.state;
      const assignCode = this.props.assignment.asignCode;

      if (!submitAssignTitle || !submitAssignDescription) {
        window.alert('제목과 내용을 모두 기입해 주세요.');
        return;
      }

      const res = await axios.post(
        `${env.ServerURL}/api/classroom/submitAssign`,
        {
          assignCode,
          courseCode,
          submitAssignTitle,
          submitAssignDescription,
          fileKey,
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
    } catch (err) {
      console.log(err);
    }
  };

  // dialog
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  // file
  onFormSubmit = e => {
    e.preventDefault();

    const { files } = this.fileInput.current;
    const firstFile = files[0];

    if (firstFile) {
      // 파일 업로드
      this.fileUpload(firstFile).then(response => {
        console.log(response.data);
        // 데이터 삽입
        this.onInsert(response.data);
      });
    } else {
      this.onInsert();
    }
  };

  fileUpload = file => {
    const url = `${env.ServerURL}/api/classroom/submitAssign/upload`;
    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    return post(url, formData, config);
  };

  render() {
    const { assignment, onDelete, mentoId } = this.props;
    const { editing } = this.state;

    if (editing) {
      return (
        <div style={{ margin: '20px' }}>
          <div>
            <TextField
              type="text"
              label="과제제목"
              fullWidth
              margin="normal"
              variant="outlined"
              value={this.state.assignTitle}
              name="assignTitle"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <TextField
              type="text"
              label="과제설명"
              multiline
              rows="5"
              fullWidth
              margin="normal"
              variant="outlined"
              value={this.state.assignDescription}
              name="assignDescription"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <TextField
              type="date"
              value={this.state.assignDeadline}
              name="assignDeadline"
              onChange={this.handleChange}
            />
          </div>
          <div style={{ textAlign: 'right' }}>
            <Button
              style={buttonStyle}
              color="primary"
              variant="contained"
              onClick={this.props.closePopup}
            >
              {'닫기'}
            </Button>
            <Button
              style={buttonStyle}
              color="primary"
              variant="contained"
              onClick={this.handleToggleEdit}
            >
              {'적용'}
            </Button>
            <Button
              style={buttonStyle}
              color="primary"
              variant="contained"
              onClick={() =>
                onDelete(assignment.asignCode, assignment.asignTitle)
              }
            >
              {'삭제'}
            </Button>
          </div>
        </div>
      );
    }
    return (
      <div style={{ margin: '20px' }}>
        <div className="popup">
          <div className="popup_inner">
            <div>
              <b>과제 내용</b>
              <p style={pTagStyle}>{assignment.asignDescription}</p>
              <b>마감 기한</b>
              <p style={pTagStyle}>{assignment.asignDeadline}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Button
                style={buttonStyle}
                color="primary"
                variant="contained"
                onClick={this.props.closePopup}
              >
                {'닫기'}
              </Button>
              {mentoId === JSON.parse(localStorage.getItem('myInfo')).userId ? (
                <div style={{ display: 'inline' }}>
                  <Button
                    style={buttonStyle}
                    color="primary"
                    variant="contained"
                    onClick={this.handleToggleEdit}
                  >
                    {'수정'}
                  </Button>
                  <Button
                    style={buttonStyle}
                    color="primary"
                    variant="contained"
                    onClick={() =>
                      onDelete(assignment.asignCode, assignment.asignTitle)
                    }
                  >
                    {'삭제'}
                  </Button>
                </div>
              ) : null}

              {mentoId !== JSON.parse(localStorage.getItem('myInfo')).userId ? (
                <Button
                  style={buttonStyle}
                  color="primary"
                  variant="contained"
                  onClick={this.handleClickOpen}
                >
                  {'제출'}
                </Button>
              ) : null}
              <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">
                  {
                    '- - - - - - - - - - - - - - - - - - - 과제 제출 - - - - - - - - - - - - - - - - - - -'
                  }
                </DialogTitle>
                <form onSubmit={this.onFormSubmit}>
                  <DialogContent>
                    <div style={{ margin: '20px' }}>
                      <div>
                        <TextField
                          type="text"
                          label="제출과제 제목"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          name="submitAssignTitle"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div>
                        <TextField
                          type="text"
                          label="제출과제 내용"
                          multiline
                          rows="8"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          name="submitAssignDescription"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div>
                        <input type="file" ref={this.fileInput} />
                      </div>
                    </div>
                  </DialogContent>
                  <DialogActions>
                    <Button type="submit" name="Upload" color="primary">
                      {'등록'}
                    </Button>
                    <Button onClick={this.handleClose} color="primary">
                      {'취소'}
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AssignDetail;
