import View from './view'
import model from '../model'

import sendForm from './sendForm'
import groupMessages from './groupMessages'
import { addEvent } from '../helper'

class GroupChat extends View {
  _element = () => document.querySelector('.chat')

  _generateMarkUp(data) {
    const selectedGroup = model.getSelectedGroup()

    return `<div class="chat groupChat"> <div class="selected">
        <img class="arrow back" src="svgs/arrow.svg" />

        <h1 class="name">${selectedGroup.name}</h1>
        <img class="dp" 
           src=${data.profileUrl || 'svgs/person.svg'}
         />
      </div>${groupMessages.render(data)}  ${sendForm.render()} </div>`
  }

  addSendMessageHandler(handler) {
    sendForm.addSendInputHandler(function (e) {
      if (!e.target.closest('.groupChat')) return

      handler(e.target.value)
    })
  }
}

export default new GroupChat()
