import View from './view'
import message from './message'
import model from '../model'

class Messages extends View {
  // _element = () => document.querySelector('.messages')
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
    ${message.render({ item, prevItem: arr[i - 1], nextItem: arr[i + 1] })}`
          )
          .join('')}
      </div>`
  }
}

export default new Messages()
