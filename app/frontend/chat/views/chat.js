import View from './view'
import Model from '../model'
import sendForm from './sendForm'
import messages from './messages'
import letterDp from './letterDp'
import searchForm from './searchForm'
import model from '../model'
import message from './message'

class Chat extends View {
  _element = () => document.querySelector('.chat')

  _generateMarkUp(data) {
    const name = Model.getSelectedContact().user.name
    return ` <div class="chat bg-img"><div class="selected">
        <img class="arrow back cursor-p"  />
       ${letterDp.render(name)}
        <h1 class="name">${name}</h1>
   
      </div>
        ${messages.render(data)}
        ${sendForm.render()} </div>`
  }

  // render(data) {
  //   try {
  //     return super.render(data)
  //   } finally {
  //     this._element().querySelector('.input-box').focus()
  //   }
  // }

  addSendMessageHandler(handler) {
    sendForm.addSendInputHandler(function (e) {
      if (e.target.closest('.groupChat')) return
      if (e.target.closest('.send-btn')) {
        handler(e.target.previousSibling.value)
        e.target.previousSibling.value = ''

        return
      }
      handler(e.target.value)
      e.target.value = ''
    })
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
    this._element()
      .querySelector('.messages')
      .insertAdjacentHTML('beforeend', newMessage)
  }
}

export default new Chat()
