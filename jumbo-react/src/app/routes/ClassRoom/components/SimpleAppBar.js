import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';

class SimpleAppBar extends React.Component {
  render() {
    const { titleText } = this.props;
    return (
      <AppBar
        position="static"
        color="inherit"
        className="jr-border-radius"
        style={{ marginTop: '7px', marginBottom: '7px' }}
      >
        <Toolbar style={{ textAlign: 'center' }}>
          <IconButton className="jr-menu-icon" aria-label="Menu">
            <span className="menu-icon bg-grey" />
          </IconButton>
          <h4
            className="mb-0"
            style={{
              textAlign: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
            }}
          >
            {titleText}
          </h4>
        </Toolbar>
      </AppBar>
    );
  }
}

export default SimpleAppBar;
