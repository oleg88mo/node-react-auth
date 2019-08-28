import {combineReducers} from "redux";
//reducers
import users from './users/reducer';
import auth from './auth/reducer';

const reducers = combineReducers({
    users,
    auth,
});

export default reducers;
