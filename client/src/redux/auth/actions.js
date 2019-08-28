import * as TYPES from './types';

export function getGet(payload) {
    return async dispatch =>
        await dispatch({ type: TYPES.GET_GET, payload });
}