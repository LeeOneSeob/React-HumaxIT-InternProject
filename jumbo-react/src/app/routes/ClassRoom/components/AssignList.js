import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import produce from 'immer';
import AssignDetail from './AssignDetail';

class AssignList extends React.Component {
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

  onClick = assignment => {
    alert(JSON.stringify(assignment));
  };

  render() {
    const { assignment, onDelete, onUpdate, mentoId, courseCode } = this.props;
    return (
      <div className="w-100">
        {assignment ? (
          <ListItem button onClick={this.togglePopup.bind(this)}>
            <Avatar>
              <i className="zmdi zmdi-file zmdi-hc-fw zmdi-hc-lg text-white" />
            </Avatar>
            <ListItemText
              primary={assignment.asignTitle}
              secondary={`등록일 : ${assignment.asignDate}`}
            />
          </ListItem>
        ) : null}

        {this.state.showPopup ? (
          <AssignDetail
            onDelete={onDelete}
            onUpdate={onUpdate}
            assignment={assignment}
            closePopup={this.togglePopup.bind(this)}
            mentoId={mentoId}
            courseCode={courseCode}
          />
        ) : null}
      </div>
    );
  }
}

export default AssignList;
