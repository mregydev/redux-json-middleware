import filter from './jsonFilter'

export default function resolveJsonObject (next, action) {
  let jsonData = action.payload
  action.data = jsonData
  if (action.filter) {
    action.data = filter(jsonData, action.filter)
  }
  action.status = action.type ? action.type + '_Resolved' : 'Resolved'
  next(action)
}
