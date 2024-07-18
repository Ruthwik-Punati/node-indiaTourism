import View from './view'
import message from './message'

class Messages extends View {
  _element = () => document.querySelector('.messages')
  _generateMarkUp(data) {
    return `<div class="messages">
        ${data
          .map(
            (item) => `
    ${message.render({ item })}`
          )
          .join('')}
      </div>`
  }
  addNewMessage({ msg }) {
    const newMessage = message.render({ item: msg })
    this._element().insertAdjacentHTML('beforeend', newMessage)
  }
}

export default new Messages()
