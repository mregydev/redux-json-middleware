import jsonMiddleWare from '../../src';

import { applyMiddleware, createStore } from 'redux';

import axios from 'axios';


export default () => {
    const middleWare = applyMiddleware(jsonMiddleWare);

    const reducer = (state, action) => {
        console.log(action.type.indexOf("parseJson"));
        if (action.type == "parseJson") {
            console.log(action.data.data);

            /* [{ id: 4, first_name: 'Eve' },
               { id: 5, first_name: 'Charles' },
               { id: 6, first_name: 'Tracey' }]*/
        }
    };


    const store = createStore(reducer, middleWare);

    store.dispatch({
        type: "parseJson",
        payload: axios.get("https://reqres.in/api/users?page=2"),
        filter: ["data.id", "data.first_name"]
    });
};
