import View from './view'
import * as model from '../model'

class Chat extends View {
  _parentEl = document.querySelector('.chat')

  _generateMarkUp(data) {
    return ` <div class="contactCard selected">
        <img class="arrow" src="svgs/arrow.svg" />

        <h1 class="name">${model.state.selectedContact.user.name}</h1>
        <img class="dp" 
           src=${data.profileUrl || 'svgs/person.svg'}
         />
      </div><div class="messages">${data
        .map(
          (item) => `
      <p class="msg ${
        item.sender !== model.state.user._id ? 'msg-left' : 'msg-right'
      }">${item.message}</p>`
        )
        .join(
          ''
        )}</div><form class="send-form"><input class="input-box send" onblur="this.focus()" autofocus  placeholder="Send message"/><form/>`
  }

  addSendInputHandler(handler) {
    const input = this._parentEl.querySelector('.send')

    this._disableFormSubmit()
    input.addEventListener('keydown', function (e) {
      e.code === 'Enter' && handler(e)
    })
  }

  _disableFormSubmit() {
    this._parentEl
      .querySelector('.send-form')
      .addEventListener('submit', (e) => {
        console.log(e.target)
        e.preventDefault()
      })
  }
  addBackToContactsHandler(handler) {
    this._parentEl.querySelector('.arrow').addEventListener('click', handler)
  }

  scrollBottom() {
    const messages = this._parentEl.querySelector('.messages')

    messages.scrollTop = messages.scrollHeight
  }
}

export default new Chat()
