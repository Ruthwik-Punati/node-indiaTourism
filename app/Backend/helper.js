const alphaVal = (s) => s.toLowerCase().charCodeAt(0) - 97 + 1

exports.createRoomId = function (user, withId) {
  const user1 = user
    .split('')
    .map((el) => (Number.isInteger(parseInt(el)) ? parseInt(el) : alphaVal(el)))
  const user2 = withId
    .split('')
    .map((el) => (Number.isInteger(parseInt(el)) ? parseInt(el) : alphaVal(el)))

  const result = user1.map((el, i) => el + (user2[i] || 0))
  return result
    .map((el) => String.fromCharCode(el - 1 + 'A'.charCodeAt(0)))
    .join('')
    .toLowerCase()
}
