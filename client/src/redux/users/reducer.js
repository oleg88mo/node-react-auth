import * as TYPES from './types';

const INIT_STATE = {
    data: null
};

export default function users(state = INIT_STATE, { type, payload }) {
    switch (type) {
        case TYPES.SET_USER:
            return {
                ...state,
                data: {...payload}
            };
        default:
            return state;
    }
}
