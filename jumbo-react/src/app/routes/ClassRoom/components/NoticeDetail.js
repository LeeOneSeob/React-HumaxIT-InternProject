import React from 'react';
import Button from '@material-ui/core/Button';
import produce from 'immer';
import TextField from '@material-ui/core/TextField';

const pTagStyle = {
  textIndent: '10px',
};
const buttonStyle = {
  margin: '3px',
};
class NoticeDetail extends React.Component {
  state = {
    // update 버튼 클릭 시 input으로 전환
    editing: false,
    open: false,
    noticeCode: '',
    noticeTitle: '',
    noticeContent: '',
  };

  componentDidUpdate(prevProps, prevState) {
    const { notice, onUpdate } = this.props;
    if (!prevState.editing && this.state.editing) {
      // editing 값이 false -> true 로 전환 될 때
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        produce(this.state, draft => {
          draft.noticeCode = notice.noticeCode;
          draft.noticeTitle = notice.noticeTitle;
          draft.noticeContent = notice.noticeContent;
        }),
      );
    }

    if (prevState.editing && !this.state.editing) {
      // editing 값이 true -> false 로 전환 될 때
      const {
        noticeCode,
        noticeTitle,
        noticeContent,
      } = this.state;
      onUpdate(noticeCode, noticeTitle, noticeContent);
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

  // dialog
  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { notice, onDelete, mentoId } = this.props;
    const { editing } = this.state;

    if (editing) {
      return (
        <div style={{ margin: '20px' }}>
          <div>
            <TextField
              type="text"
              label="공지제목"
              fullWidth
              margin="normal"
              variant="outlined"
              value={this.state.noticeTitle}
              name="noticeTitle"
              onChange={this.handleChange}
            />
          </div>
          <div>
            <TextField
              type="text"
              label="공지내용"
              multiline
              rows="5"
              fullWidth
              margin="normal"
              variant="outlined"
              value={this.state.noticeContent}
              name="noticeContent"
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
                onDelete(notice.noticeCode, notice.noticeTitle)
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
              <b>공지 내용</b>
              <p style={pTagStyle}>{notice.noticeContent}</p>
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
                      onDelete(notice.noticeCode, notice.noticeTitle)
                    }
                  >
                    {'삭제'}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NoticeDetail;
