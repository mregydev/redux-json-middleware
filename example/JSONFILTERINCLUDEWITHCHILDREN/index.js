import jsonMiddleWare from '../../src';

import { applyMiddleware, createStore } from 'redux';

import student from './data';


export default () => {
    const middleWare = applyMiddleware(jsonMiddleWare);

    const reducer = (state, action) => {
        console.log(action.type.indexOf("parseJson"));
        if (action.type == "parseJson") {

            console.log(action.data);     //{ student: { details: { length: 120, weight: 80 } } }
        }
    };


    const store = createStore(reducer, middleWare);

    store.dispatch({
        type: "parseJson",
        payload:student,
        filter: ["student.details"]
    });
};
