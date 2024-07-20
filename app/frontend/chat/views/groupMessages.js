import model from '../model'
import { changeTimeFormat } from '../helper'
import View from './view'
import groupMessage from './groupMessage'
import model from '../model'

class GroupMessages extends View {
  _element = () => document.querySelector('.messages')
  _generateMarkUp(data) {
    return `<div class="messages">
     ${
       data.length === 0
         ? `<p class="start-conversation">Start a Conversation!</p>`
         : ''
     }
          ${data
            .map((item, i, arr) => {
              return `
       ${groupMessage.render({
         item,
         prevItem: arr[i - 1],
         nextItem: arr[i + 1],
       })}
    `
            })
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

    const newMessage = groupMessage.render({ item: msg, prevItem: prevMsg })
    this._element().insertAdjacentHTML('beforeend', newMessage)
  }
}

export default new GroupMessages()
