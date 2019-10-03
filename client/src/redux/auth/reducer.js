// import * as TYPES from './types';

const INIT_STATE = {
    // token: null
};

export default function auth(state = INIT_STATE, { type, payload }) {
    switch (type) {
        // case TYPES.GET_GET:
        //     return {
        //         ...state,
        //         token: payload
        //     };
        default:
            return state;
    }
}
