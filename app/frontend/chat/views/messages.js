import View from './view'
import message from './message'
import model from '../model'

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
    ${message.render({ item, prevItem: arr[i - 1], nextItem: arr[i + 1] })}`
          )
          .join('')}
      </div>`
  }
  addNewMessage({ msg, prevMsg }) {
    if (!prevMsg) {
      this.removeStartConversation()
    }

    const user = model.getUser()
    const isSenderTheUser = msg.sender === user._id
    const sameSenderAsPrev = prevMsg?.sender === msg.sender

    sameSenderAsPrev &&
      this._element().lastElementChild.classList.remove(
        isSenderTheUser ? 'bbrr-0' : 'bblr-0'
      )

    const newMessage = message.render({ item: msg, prevItem: prevMsg })
    this._element().insertAdjacentHTML('beforeend', newMessage)
  }
}

export default new Messages()
