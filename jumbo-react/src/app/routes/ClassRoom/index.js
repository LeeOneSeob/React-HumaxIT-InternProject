import React from 'react';
import axios from 'axios';
import produce from 'immer';
import SimpleAppBar from './components/SimpleAppBar';
import SearchBar from './components/SearchBar';
import StudyList from './components/StudyList';
import { env } from './data/config';

class MainPage extends React.Component {
  state = {
    filterStudyList: [],
    fiterSearchText: 0,
    filterActor: 0,
    filterGroupName: 0,
    filterTime: 0,
    offset: 0,
    limit: 5,
    rowCont: 0,
  };

  componentDidMount = () => {
    this.getFilterStudy();
  };

  componentDidUpdate(prevProps, prevState) {
    const { offset } = this.state;

    if (offset !== prevState.offset) {
      this.getFilterStudy();
    }
  }

  getFilterStudy = async e => {
    const apiString = { data: '' };

    try {
      const {
        fiterSearchText,
        filterActor,
        filterGroupName,
        filterTime,
        limit,
        offset,
      } = this.state;

      if (e) {
        apiString.data = `${
          env.ServerURL
        }/api/study/filter/${fiterSearchText}/${filterActor}/${filterGroupName}/${filterTime}/${limit}/0`;

        produce(this.state, draft => {
          draft.offset = 0;
        });
      } else {
        apiString.data = `${
          env.ServerURL
        }/api/study/filter/${fiterSearchText}/${filterActor}/${filterGroupName}/${filterTime}/${limit}/${offset}`;
      }

      const res = await axios.get(apiString.data, {
        params: {
          fiterSearchText,
          filterActor,
          filterGroupName,
          filterTime,
          limit,
          offset,
        },
        headers: {
          token: localStorage.getItem('token'),
        },
      });
      this.setState(
        produce(this.state, draft => {
          // eslint-disable-next-line prefer-destructuring
          draft.filterStudyList = res.data[0];
        }),
      );

      this.setState(
        produce(this.state, draft => {
          draft.rowCont = res.data[1][0].totalRow;
        }),
      );
    } catch (err) {
      console.log(err);
    }
  };

  handleStudyBySearch = e => {
    if (e.target.value === '') {
      this.setState(
        produce(this.state, draft => {
          draft.fiterSearchText = 0;
        }),
      );
    } else {
      this.setState(
        produce(this.state, draft => {
          draft.fiterSearchText = e.target.value;
        }),
      );
    }
  };

  handleStudyByGroup = e => {
    this.setState(
      produce(this.state, draft => {
        draft.filterGroupName = e.target.value;
      }),
    );
  };

  handleStudyByTime = e => {
    this.setState(
      produce(this.state, draft => {
        draft.filterTime = e.target.value;
      }),
    );
  };

  handleStudyByActor = e => {
    this.setState(
      produce(this.state, draft => {
        draft.filterActor = e.target.value;
      }),
    );
  };

  handleOffset = value => {
    this.setState(
      produce(this.state, draft => {
        draft.offset = value;
      }),
    );
  };

  render() {
    const {
      filterStudyList,
      fiterSearchText,
      filterGroupName,
      filterTime,
      filterActor,
      offset,
      rowCont,
      limit,
    } = this.state;

    return (
      <div className="animated slideInUpTiny animation-duration-3">
        <SimpleAppBar titleText="스터디 조회" />
        <SearchBar
          placeholder="강의명/멘토명 검색"
          handleStudyBySearch={this.handleStudyBySearch}
          handleStudyByGroup={this.handleStudyByGroup}
          handleStudyByTime={this.handleStudyByTime}
          handleStudyByActor={this.handleStudyByActor}
          getFilterStudy={this.getFilterStudy}
        />
        <StudyList
          filterStudyList={filterStudyList}
          fiterSearchText={fiterSearchText}
          filterGroupName={filterGroupName}
          filterTime={filterTime}
          filterActor={filterActor}
          handleOffset={this.handleOffset}
          rowCont={rowCont}
          offset={offset}
          limit={limit}
        />
      </div>
    );
  }
}

export default MainPage;
