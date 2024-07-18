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
  console.log(date, hours + ':' + minutes + ' ' + newformat)
  return hours + ':' + minutes + ' ' + newformat
}

export function addEvent(eventName, className, handler) {
  document.addEventListener(eventName, function (e) {
    if (e.target.closest(className)) {
      handler(e)
    }
  })
}

export function getModLastMsg(lastMsg) {
  return `${lastMsg.substr(0, 30) + (lastMsg.length > 30 ? '...' : '')}`
}
