export default function isPromise(value) {
    return value &&
        value.then && typeof value.then == "function" &&
        value.catch && typeof value.catch == "function";
}