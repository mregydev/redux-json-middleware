import  {JsonPropertyFilter }  from "json-property-filter";


export default function Filter(source, filterExpression) {
    let filter = new JsonPropertyFilter(filterExpression);
    return filter.apply(source);
}