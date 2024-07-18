import { changeTimeFormat } from '../helper'
import model from '../model'
import View from './view'

class Message extends View {
  _generateMarkUp({ item, prevItem }) {
    const user = model.getUser()

    const sameSenderAsPrev = prevItem?.sender === item.sender
    return `
      <p class="msg ${item.sender !== user._id ? 'msg-left' : 'msg-right'} ${
      sameSenderAsPrev ? 'mt-sm' : 'mt-md'
    }">${item.message}
             <span class="sent-at"> ${changeTimeFormat(
               new Date(item.sentAt)
             )}</span>  
            </p>`
  }
}

export default new Message()
