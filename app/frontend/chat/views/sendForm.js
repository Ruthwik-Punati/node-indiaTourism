import { addEvent } from '../helper'
import View from './view'

class SendForm extends View {
  _element = () => document.querySelector('.send-form')
  _generateMarkUp() {
    return `<form class="send-form"><input class="input-box send" onblur="this.focus()" autofocus  placeholder="Send message"/><form/>`
  }

  addSendInputHandler(handler) {
    addEvent('submit', '.send-form', (e) => {
      e.preventDefault()
    })

    addEvent('keydown', '.send', function (e) {
      e.code === 'Enter' && handler(e)
    })
  }
}

export default new SendForm()
