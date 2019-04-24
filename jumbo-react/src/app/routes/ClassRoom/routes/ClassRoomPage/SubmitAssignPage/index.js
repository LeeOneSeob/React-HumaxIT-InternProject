import React, { Component } from 'react';
import axios from 'axios';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import produce from 'immer';
import Pagination from 'material-ui-flat-pagination';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { env } from '../../../data/config';
import SubmitAssignList from '../../../components/SubmitAssignList';

const theme = createMuiTheme();

class SubmitAssign extends Component {
  state = {
    submitAssignList: '',
    offset: 0,
    limit: 5,
    rowCont: 0,
  };

  componentDidMount = () => {
    const { courseCode } = this.props;
    this.getSubmitAssignments(0, courseCode);
  };

  componentDidUpdate(prevProps, prevState) {
    const { offset } = this.state;
    const { courseCode } = this.props;

    if (offset !== prevState.offset) {
      this.getSubmitAssignments(0, courseCode);
    }
  }

  getSubmitAssignments = async (assignCode, courseCode) => {
    console.log(`getAssignments ${courseCode}`);
    const { limit, offset } = this.state;
    if (!courseCode) return;

    try {
      const res = await axios.get(
        `${
          env.ServerURL
        }/api/classroom/submitAssign/${assignCode}/${courseCode}/${limit}/${offset}`,
        {
          params: {
            assignCode,
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
            draft.submitAssignList = res.data[0];
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

  handleOffset = value => {
    this.setState(
      produce(this.state, draft => {
        draft.offset = value;
      }),
    );
  };

  render() {
    // const { assignment, courseCode } = this.props;
    const { submitAssignList, limit, offset, rowCont } = this.state;
    const listDatas = {
      data: '',
    };
    if (submitAssignList) {
      listDatas.data = submitAssignList.map((submitAssign, index) => {
        return <SubmitAssignList key={index} submitAssign={submitAssign} />;
      });
    }

    return (
      <div>
        <Paper>
          <List>{listDatas.data}</List>
        </Paper>
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
      </div>
    );
  }
}

export default SubmitAssign;
