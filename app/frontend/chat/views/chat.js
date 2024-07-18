import View from './view'
import Model from '../model'
import sendForm from './sendForm'
import messages from './messages'
import { addEvent } from '../helper'

class Chat extends View {
  _element = () => document.querySelector('.chat')

  _generateMarkUp(data) {
    return ` <div class="chat"><div class="selected">
        <img class="arrow back" src="svgs/arrow.svg" />

        <h1 class="name">${Model.getSelectedContact().user.name}</h1>
        <img class="dp" 
           src=${data.profileUrl || 'svgs/person.svg'}
         />
      </div>
        ${messages.render(data)}
        ${sendForm.render()} </div>`
  }

  addSendMessageHandler(handler) {
    sendForm.addSendInputHandler(function (e) {
      if (e.target.closest('.groupChat')) return

      handler(e.target.value)
    })
  }
}

export default new Chat()
