import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

class SideBar extends React.Component {
  handleSelectNum = number => {
    this.props.handleSelectPage(number);
  };

  render() {
    return (
      <div className="w-100">
        <List>
          <ListItem button onClick={() => this.handleSelectNum(0)}>
            <ListItemIcon>
              <i className="zmdi zmdi-email zmdi-hc-fw zmdi-hc-2x" />
            </ListItemIcon>
            <ListItemText primary="공지사항" />
          </ListItem>
          <Divider light />

          <ListItem button onClick={() => this.handleSelectNum(1)}>
            <ListItemIcon>
              <i className="zmdi zmdi-mail-send zmdi-hc-fw zmdi-hc-2x" />
            </ListItemIcon>
            <ListItemText primary="과제" />
          </ListItem>
          <Divider light />

          {this.props.mentoId ===
          JSON.parse(localStorage.getItem('myInfo')).userId ? (
            <div>
              <ListItem button onClick={() => this.handleSelectNum(2)}>
                <ListItemIcon>
                  <i className="zmdi zmdi-mail-send zmdi-hc-fw zmdi-hc-2x" />
                </ListItemIcon>
                <ListItemText primary="제출과제 현황" />
              </ListItem>
              <Divider light />
            </div>
          ) : null}

          <ListItem button onClick={() => this.handleSelectNum(3)}>
            <ListItemIcon>
              <i className="zmdi zmdi-star zmdi-hc-fw zmdi-hc-2x" />
            </ListItemIcon>
            <ListItemText primary="피드백" />
          </ListItem>
        </List>
      </div>
    );
  }
}

export default SideBar;
