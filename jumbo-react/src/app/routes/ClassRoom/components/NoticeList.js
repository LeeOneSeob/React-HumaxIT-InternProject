import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import produce from 'immer';
import NoticeDetail from './NoticeDetail';

class NoticeList extends React.Component {
  state = {
    showPopup: false,
  };

  togglePopup = () => {
    this.setState(
      produce(this.state, draft => {
        draft.showPopup = !this.state.showPopup;
      }),
    );
  };

  render() {
    const { notice, onDelete, onUpdate, mentoId, courseCode } = this.props;
    return (
      <div className="w-100">
        {notice ? (
          <ListItem button onClick={this.togglePopup.bind(this)}>
            <Avatar>
              <i className="zmdi zmdi-file zmdi-hc-fw zmdi-hc-lg text-white" />
            </Avatar>
            <ListItemText
              primary={notice.noticeTitle}
              secondary={`등록일 : ${notice.noticeDate}`}
            />
          </ListItem>
        ) : null}

        {this.state.showPopup ? (
          <NoticeDetail
            onDelete={onDelete}
            onUpdate={onUpdate}
            notice={notice}
            closePopup={this.togglePopup.bind(this)}
            mentoId={mentoId}
            courseCode={courseCode}
          />
        ) : null}
      </div>
    );
  }
}

export default NoticeList;
