export function changeTimeFormat(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()

  // Check whether AM or PM
  let newformat = hours >= 12 ? 'PM' : 'AM'

  // Find current hour in AM-PM Format
  hours = hours % 12

  // To display "0" as "12"
  hours = hours ? hours : 12
  minutes = minutes < 10 ? '0' + minutes : minutes

  return hours + ':' + minutes + ' ' + newformat
}

export function addEvent(eventName, className, handler) {
  document.addEventListener(eventName, function (e) {
    if (e.target.closest(className)) {
      console.log(className, e)
      handler(e)
    }
  })
}

export function getModLastMsg(lastMsg) {
  return `${lastMsg.substr(0, 30) + (lastMsg.length > 30 ? '...' : '')}`
}

export function stringToHslColor(str, s = '50', l = '80', a = '0.8') {
  var hash = 0
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }

  var h = hash % 360
  return `hsla(${h},${s}%,${l}%,${a})`
}
