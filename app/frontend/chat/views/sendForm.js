import { addEvent } from '../helper'
import View from './view'

class SendForm extends View {
  // _element = () => document.querySelector('.send-form')
  _generateMarkUp() {
    return `<form class="send-form"><input class="input-box send"   placeholder="Send message"/><img class="dp send-btn cursor-p" src="svgs/send.svg" ><form/>`
  }

  addSendInputHandler(handler) {
    addEvent('submit', '.send-form', (e) => {
      e.preventDefault()
    })

    addEvent('click', '.send-btn', function (e) {
      handler(e)
    })

    addEvent('keydown', '.send', function (e) {
      if (e.code === 'Enter') {
        handler(e)
      }
    })
  }
}

export default new SendForm()
