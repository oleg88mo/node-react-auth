import * as TYPES from './types';

const INIT_STATE = {};

export default function users(state = INIT_STATE, { type, payload }) {
    switch (type) {
        case TYPES.SET_USER:
            return {
                ...state,
                ...payload
            };
        default:
            return state;
    }
}
