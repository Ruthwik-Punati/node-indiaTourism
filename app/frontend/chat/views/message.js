import { changeTimeFormat } from '../helper'
import model from '../model'
import View from './view'

class Message extends View {
  _generateMarkUp({ item }) {
    const user = model.getUser()
    return `
      <p class="msg ${item.sender !== user._id ? 'msg-left' : 'msg-right'}">${
      item.message
    }
             <span class="sent-at"> ${changeTimeFormat(
               new Date(item.sentAt)
             )}</span>  
            </p>`
  }
}

export default new Message()
