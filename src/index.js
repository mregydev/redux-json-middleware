import isPromise from './isPromise';

import resolvePromise from './resolvePromise';
import resolveJsonObject from './resolveJsonObject'
export default (store) => (next) => (action) => {

    if (action.payload && isPromise(action.payload)) {
        resolvePromise(next, action);
    }
    else if (action.payload) {
        resolveJsonObject(next, action)
    }
    else {
        next(action);
    }
};