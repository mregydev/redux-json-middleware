import { JsonPropertyFilter } from 'json-property-filter';

function isPromise(value) {
    return value &&
        value.then && typeof value.then == "function" &&
        value.catch && typeof value.catch == "function";
}

function Filter(source, filterExpression) {
    let filter = new JsonPropertyFilter(filterExpression);
    return filter.apply(source);
}

function resolvePromise(next,action)
{
    action.payload.then((result) => {
            let propName = result.jsonProperty;

            let jsonData = propName ? result[propName] : result;

            action.data = jsonData;

            if (action.filter) {
                action.data = Filter(jsonData,action.filter);
            }
            
            action.type += "_Resolved";

            next(action);

        }).catch(ex => {
            action.errorMessage = ex.errorMessage;

            action.type += "_Error";

            next(action);
        });
}

function resolveJsonObject(next, action) {

    let jsonData = action.payload;
    action.data = jsonData;
    if (action.filter) {
        action.data = Filter(jsonData, action.filter);
    }
    action.type += "_Resolved";
    next(action);
}

var index = (store) => (next) => (action) => {

    if (action.payload && isPromise(action.payload)) {
        resolvePromise(next, action);
    }
    else if (action.payload) {
        resolveJsonObject(next, action);
    }
    else {
        next(action);
    }
};

export default index;
