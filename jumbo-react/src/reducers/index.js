import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router'
import Settings from './Settings';
// import Test from './Test';

export default (history) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  // test: Test,
});


