import View from './view'
import Model from '../model'
import sendForm from './sendForm'
import messages from './messages'
import letterDp from './letterDp'

class Chat extends View {
  _element = () => document.querySelector('.chat')

  _generateMarkUp(data) {
    const name = Model.getSelectedContact().user.name
    return ` <div class="chat"><div class="selected">
        <img class="arrow back cursor-p" src="svgs/arrow.svg" />
       ${letterDp.render(name)}
        <h1 class="name">${name}</h1>
   
      </div>
        ${messages.render(data)}
        ${sendForm.render()} </div>`
  }

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
}

export default new Chat()
