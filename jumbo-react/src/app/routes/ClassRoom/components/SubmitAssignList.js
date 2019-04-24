import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import produce from 'immer';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import SubimitAssignDetail from './SubmitAssignDetail';

class SubmitAssignList extends Component {
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
    const { submitAssign } = this.props;

    // eslint-disable-next-line prefer-destructuring

    return (
      <div>
        <ListItem button onClick={this.togglePopup.bind(this)}>
          <ListItemAvatar>
            <Avatar
              alt="Remy Sharp"
              src="/img/userImg/user99.jpg"
              style={{ width: '40px', height: '40px' }}
            />
          </ListItemAvatar>
          <b style={{ marginLeft: '5px' }}>
            {`${submitAssign.menteeName} 멘티`}
          </b>
          <ListItemText
            primary={
              (
                <React.Fragment>
                  <Typography component="span" color="textPrimary">
                    {`${submitAssign.asignTitle}`}
                  </Typography>
                  {`제출과제명 : ${submitAssign.submitAsignTitle}`}
                </React.Fragment>
              )
            }
            secondary={`등록일 : ${submitAssign.submitAsignDate}`}
          />
        </ListItem>
        {this.state.showPopup ? (
          <SubimitAssignDetail
            submitAssign={submitAssign}
            closePopup={this.togglePopup.bind(this)}
          />
        ) : null}
      </div>
    );
  }
}

export default SubmitAssignList;
