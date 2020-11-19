import {combineReducers} from 'redux';
import modal from './modal';
import auth from './auth';

const rootReducer = combineReducers({
    modal,
    auth
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;