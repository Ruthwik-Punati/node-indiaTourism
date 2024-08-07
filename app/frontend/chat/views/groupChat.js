import View from './view'
import model from '../model'

import sendForm from './sendForm'
import groupMessages from './groupMessages'
import letterDp from './letterDp'
import groupMessage from './groupMessage'

class GroupChat extends View {
  _element = () => document.querySelector('.chat')

  _generateMarkUp(data) {
    const name = model.getSelectedGroup().name

    return `<div class="chat  groupChat bg-img"> <div class="selected">
        <img class="arrow back cursor-p"  />
    ${letterDp.render(name)}
        <h1 class="name">${name}</h1>
     
      </div>${groupMessages.render(data)}  ${sendForm.render()} </div>`
  }

  addSendMessageHandler(handler) {
    sendForm.addSendInputHandler(function (e) {
      if (!e.target.closest('.groupChat')) return
      if (e.target.closest('.send-btn')) {
        handler(e.target.previousSibling.value)
        e.target.previousSibling.value = ''
        e.target.previousSibling.focus()

        return
      }
      handler(e.target.value)
      e.target.value = ''
      e.target.focus()
    })
  }

  // render(data) {
  //   try {
  //     return super.render(data)
  //   } finally {
  //     this._element().querySelector('.input-box').focus()
  //   }
  // }

  addNewMessage({ msg, prevMsg }) {
    if (!prevMsg) {
      this.removeStartConversation()
    }

    const user = model.getUser()
    const isSenderTheUser = msg.sender === user._id
    const sameSenderAsPrev = prevMsg?.sender === msg.sender

    sameSenderAsPrev &&
      this._element()
        ?.querySelector('.messages')
        ?.lastElementChild?.classList?.add(
          isSenderTheUser ? 'bbrr-0' : 'bblr-0'
        )

    const newMessage = groupMessage.render({
      item: msg,
      prevItem: prevMsg,
    })
    this._element()
      .querySelector('.messages')
      .insertAdjacentHTML('beforeend', newMessage)
  }
}

export default new GroupChat()
