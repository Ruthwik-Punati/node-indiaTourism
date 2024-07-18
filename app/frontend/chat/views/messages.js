import View from './view'
import message from './message'

class Messages extends View {
  _element = () => document.querySelector('.messages')
  _generateMarkUp(data) {
    return `<div class="messages">
    ${
      data.length === 0
        ? `<p class="start-conversation">Start a Conversation!</p>`
        : ''
    }
        ${data
          .map(
            (item, i, arr) => `
    ${message.render({ item, prevItem: arr[i - 1] })}`
          )
          .join('')}
      </div>`
  }
  addNewMessage({ msg, prevMsg }) {
    const newMessage = message.render({ item: msg, prevItem: prevMsg })
    this._element().insertAdjacentHTML('beforeend', newMessage)
  }
}

export default new Messages()
