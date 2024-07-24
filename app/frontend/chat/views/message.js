import { changeTimeFormat } from '../helper'
import model from '../model'
import View from './view'

class Message extends View {
  _generateMarkUp({ item, prevItem, nextItem }) {
    const user = model.getUser()

    const isSenderTheUser = item.sender === user._id
    const sameSenderAsPrev = prevItem?.sender === item.sender
    const sameSenderAsNext = nextItem?.sender === item.sender

    return `
      <p class="msg ${item.sender !== user._id ? 'msg-left' : 'msg-right'} ${
      sameSenderAsPrev ? 'mt-sm' : 'mt-md'
    }    

    ${sameSenderAsPrev ? (isSenderTheUser ? 'btrr-0' : 'btlr-0') : ''}
    ${sameSenderAsNext ? (isSenderTheUser ? 'bbrr-0' : 'bblr-0') : ''}

    ">${item.message}
             <span class="sent-at"> ${changeTimeFormat(
               new Date(item.sentAt)
             )}</span>  
            </p>`
  }
}

export default new Message()
