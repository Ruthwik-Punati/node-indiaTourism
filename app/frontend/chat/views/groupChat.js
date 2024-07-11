import View from './view'
import * as model from '../model'

class GroupChat extends View {
  _parentEl = document.querySelector('.chat')

  _generateMarkUp(data) {
    return ` <div class="contactCard groupCard selected">
        <img class="arrow" src="svgs/arrow.svg" />

        <h1 class="name">${model.state.selectedGroup.name}</h1>
        <img class="dp" 
           src=${data.profileUrl || 'svgs/person.svg'}
         />
      </div><div class="messages">${data
        .map((item) => {
          const sender = model.state.selectedGroup.users.find(
            (user) => user._id === item.sender
          )
          return `
      <p class="msg ${
        item.sender !== model.state.user._id ? 'msg-left' : 'msg-right'
      }"><span>${sender.name}</span>${item.message}</p>`
        })
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

export default new GroupChat()
