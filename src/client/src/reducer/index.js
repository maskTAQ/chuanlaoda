import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    orders(state = false, action) {
        const {type} = action;
        if (type === 'TOGGLECOLLAPSED') {
            return !state
        }
        return state
    }
});

export default rootReducer;