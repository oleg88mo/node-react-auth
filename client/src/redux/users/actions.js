import * as TYPES from './types';

export function setUser(payload) {
    return async dispatch => await dispatch({ type: TYPES.SET_USER, payload });
}

export function getPhotos(payload) {
    return async dispatch => await dispatch({ type: TYPES.GET_PHOTOS, payload });
}
