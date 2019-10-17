import * as TYPES from './types';

const INIT_STATE = {
    data: null,
    photos: []
};

export default function users(state = INIT_STATE, {type, payload}) {
    switch (type) {
        case TYPES.SET_USER:
            return {
                ...state,
                data: {...payload}
            };
        case TYPES.GET_PHOTOS:
            return {
                ...state,
                photos: payload
            };
        default:
            return state;
    }
}
