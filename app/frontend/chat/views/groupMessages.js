import model from '../model'
import { changeTimeFormat } from '../helper'
import View from './view'
import groupMessage from './groupMessage'

class GroupMessages extends View {
  _element = () => document.querySelector('.messages')
  _generateMarkUp(data) {
    return `<div class="messages">
          ${data
            .map((item, i, arr) => {
              return `
       ${groupMessage.render({ item, prevItem: arr[i - 1] })}
    `
            })
            .join('')}
        </div>`
  }

  addNewMessage({ msg, prevMsg }) {
    const newMessage = groupMessage.render({ item: msg, prevItem: prevMsg })
    this._element().insertAdjacentHTML('beforeend', newMessage)
  }
}

export default new GroupMessages()
