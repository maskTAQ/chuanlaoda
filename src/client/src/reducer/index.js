import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    orders(state = {}, action) {
        const {type, data} = action;

        if (type === 'getOrders') {
            return Object.assign({}, state, data);
        }
        return state
    },
    user(state = {}, action) {
        //const {type, data} = action;

        return state
    }
});

export default rootReducer;