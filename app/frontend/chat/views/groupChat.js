import View from './view'
import model from '../model'

import sendForm from './sendForm'
import groupMessages from './groupMessages'
import letterDp from './letterDp'

class GroupChat extends View {
  _element = () => document.querySelector('.chat')

  _generateMarkUp(data) {
    const name = model.getSelectedGroup().name

    return `<div class="chat groupChat"> <div class="selected">
        <img class="arrow back cursor-p" src="svgs/arrow.svg" />
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

        return
      }
      handler(e.target.value)
      e.target.value = ''
    })
  }
}

export default new GroupChat()
