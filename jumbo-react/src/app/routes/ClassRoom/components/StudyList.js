import React from 'react';
import List from '@material-ui/core/List';
import Pagination from 'material-ui-flat-pagination';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import axios from 'axios';
import produce from 'immer';
import StudyListItem from './StudyListItem';
import { env } from '../data/config';

const theme = createMuiTheme();

class StudyList extends React.Component {
  state = {
    menteeStudyList: [],
  };

  componentDidMount = () => {
    this.handleGetJoinedStudy();
  };

  getJoinedStudy = async () => {
    try {
      const res = await axios.get(`${env.ServerURL}/api/study/mentee`, {
        headers: {
          token: localStorage.getItem('token'),
        },
      });

      if (res.data === 0) {
        window.alert('토큰이 만료되었습니다. 재로그인 해주세요.');
        window.location.href = '/';
      }
      this.setState(
        produce(this.state, draft => {
          draft.menteeStudyList = res.data;
        }),
      );
    } catch (err) {
      console.log(err);
    }
  };

  handleGetJoinedStudy = () => {
    if (localStorage.getItem('token')) this.getJoinedStudy();
  };

  render() {
    const { filterStudyList, filterActor, rowCont, offset, limit } = this.props;
    const { menteeStudyList } = this.state;

    const listDatas = filterStudyList.map((study, index) => {
      return (
        <StudyListItem
          key={index}
          study={study}
          actor={filterActor}
          joinedListData={menteeStudyList}
        />
      );
    });

    return (
      <div>
        <List>{listDatas}</List>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Pagination
              limit={limit}
              offset={offset}
              total={rowCont}
              onClick={(e, offset) => this.props.handleOffset(offset)}
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

export default StudyList;
