import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Search from '@material-ui/icons/Search';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Button from '@material-ui/core/Button';
import { env } from '../data/config';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  textField: {
    flexBasis: 200,
    height: 50,
  },
});

class SearchBar extends React.Component {
  componentDidMount = () => {
    this.getGroupName();
  };

  getGroupName = async () => {
    const res = await axios.get(`${env.ServerURL}/api/study/group`);
    const group = res.data;
    const groupNames = { name: '<option>전체 과목</option>' };

    group.forEach(object => {
      groupNames.name = `${groupNames.name}<option value=${object.groupCode}>${
        object.groupName
      }</option>`;
    });

    document.getElementById('groupSelect').innerHTML = groupNames.name;
  };

  render() {
    // const { anchorEl, mobileMoreAnchorEl } = this.state;
    const {
      classes,
      placeholder,
      handleStudyBySearch,
      handleStudyByGroup,
      handleStudyByTime,
      handleStudyByActor,
      getFilterStudy,
    } = this.props;

    return (
      <div>
        <Paper>
          <div style={{ paddingRight: '15px' }}>
            <TextField
              id="outlined-adornment-amount"
              className={classNames(classes.margin, classes.textField)}
              variant="outlined"
              placeholder={placeholder}
              name="fiterSearchText"
              onChange={handleStudyBySearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </div>
          <div>
            <form className="form-inline">
              <div className="form-group">
                <div className="form-inline">
                  <div style={{ paddingLeft: '10px' }}>
                    <select
                      className="form-control"
                      onChange={handleStudyByActor}
                    >
                      <option value="all">-- 선택 --</option>
                      <option value="mentee">내가 멘티인 스터디</option>
                      <option value="mento">내가 멘토인 스터디</option>
                    </select>
                  </div>
                </div>
                <div className="form-inline">
                  <div style={{ paddingLeft: '10px' }}>
                    <select
                      id="groupSelect"
                      className="form-control"
                      onChange={handleStudyByGroup}
                    />
                  </div>
                </div>
                <div style={{ paddingLeft: '30px' }}>
                  <FormControl
                    component="fieldset"
                    className={classes.formControl}
                  >
                    <RadioGroup
                      aria-label="language"
                      name="language"
                      className={classes.group}
                      row
                    >
                      <FormControlLabel
                        value="ing"
                        control={<Radio color="primary" />}
                        label="진행중인 스터디"
                        labelPlacement="end"
                        onChange={handleStudyByTime}
                      />
                      <FormControlLabel
                        value="will"
                        control={<Radio color="primary" />}
                        label="예정된 스터디"
                        labelPlacement="end"
                        onChange={handleStudyByTime}
                      />
                      <FormControlLabel
                        value="ed"
                        control={<Radio color="primary" />}
                        label="종료된 스터디"
                        labelPlacement="end"
                        onChange={handleStudyByTime}
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div
                style={{
                  display: 'inline-block',
                  width: '100px',
                  textAlign: 'right',
                  padding: '5px',
                }}
              >
                <Button
                  color="primary"
                  variant="contained"
                  className="text-white"
                  style={{ height: '35px' }}
                  name="search"
                  onClick={getFilterStudy}
                >
                  {`search`}
                </Button>
              </div>
            </form>
          </div>
        </Paper>
      </div>
    );
  }
}

SearchBar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SearchBar);
