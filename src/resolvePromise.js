import filter from './jsonFilter'

export default function resolvePromise (next, action) {
  action.payload.then((result) => {
    let propName = action.jsonProperty

    let jsonData = propName ? result[propName] : result

    action.data = jsonData

    if (action.filter) {
      action.data = filter(jsonData, action.filter)
    }

    action.status = action.type ? action.type + '_Resolved' : 'Resolved'

    next(action)
  }).catch(ex => {
    action.errorMessage = ex.errorMessage
    action.status = action.type ? action.type + '_Error' : 'Error'
    next(action)
  })
}
