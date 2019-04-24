import React, { Component } from 'react';
// import axios from 'axios';
import Paper from '@material-ui/core/Paper';
// import produce from 'immer';
// import { env } from '../../../data/config';

class Feedback extends Component {
  render() {
    const { courseCode } = this.props;
    return (
      <div>
        <Paper style={{ textAlign: 'center', backgroundColor: '#cccccc' }}>
          <h2 style={{ fontWeight: 'bold', padding: '15px' }}>
            {'--- 피드백 ---'}
          </h2>
        </Paper>
        <Paper>
          <div>{`courseCode : ${courseCode}`}</div>
        </Paper>
      </div>
    );
  }
}

export default Feedback;
