'use strict';

import jsonMiddleWare from '../src';

import assert from 'assert';

import { applyMiddleware, createStore } from 'redux';

import axios from 'axios';

describe('Redux-Json-MiddleWare test cases', () => {

    let middleWare = null;
    before(() => {
        middleWare = applyMiddleware(jsonMiddleWare);
    });


    it('should parse json object according to the passed action filter and execlude key1 property', (done) => {

        const reducer = (state, action) => {

            if (action.type == "parseJson") {
                const expected = { key2: "value2" };

                assert.deepEqual(action.data, expected);
                assert.equal(action.status, "parseJson_Resolved");

                done();
            }
        };

        const store = createStore(reducer, middleWare);

        store.dispatch({
            type: "parseJson",
            payload: { key1: "value1", key2: "value2" },
            filter: ["-key1"]
        });
    });



    it('should parse json object according to the passed action filter and get only key1 property', (done) => {

        const reducer = (state, action) => {

            if (action.type == "parseJson") {
                const expected = { key1: "value1" };

                assert.deepEqual(action.data, expected);
                assert.equal(action.status, "parseJson_Resolved");

                done();
            }
        };

        const store = createStore(reducer, middleWare);

        store.dispatch({
            type: "parseJson",
            payload: { key1: "value1", key2: "value2" },
            filter: ["key1"]
        });
    });
 

    it('should parse json object returned from axios rquest according to the passed action filter and get only key1 property', (done) => {

        const reducer = (state, action) => {

            if (action.type == "parseJson") {
                const expected = [{ id: 4, first_name: 'Eve' },
                { id: 5, first_name: 'Charles' },
                { id: 6, first_name: 'Tracey' }];

                assert.deepEqual(action.data.data, expected);
                assert.equal(action.status, "parseJson_Resolved"); 

                done();
            }
        };


        const store = createStore(reducer, middleWare);

        store.dispatch({
            type: "parseJson",
            payload: axios.get("https://reqres.in/api/users?page=2"),
            filter: ["data.id", "data.first_name"],
            jsonProperty: "data"
        });
    });

});
