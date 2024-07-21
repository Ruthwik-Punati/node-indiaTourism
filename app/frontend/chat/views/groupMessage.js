import { changeTimeFormat, stringToHslColor } from '../helper'
import model from '../model'
import View from './view'

class GroupMessage extends View {
  // not asigning element here as we dont want to replace any element. This element is always inserted but doesn't replace anything.
  _generateMarkUp({ item, prevItem, nextItem }) {
    const selectedGroup = model.getSelectedGroup()
    const user = model.getUser()

    const sender = selectedGroup.users.find((user) => user._id === item.sender)
    const sameSenderAsPrev = prevItem?.sender === item.sender
    const sameSenderAsNext = nextItem?.sender === item.sender

    const isSenderTheUser = item.sender === user._id
    return `<p class="msg ${!isSenderTheUser ? 'msg-left' : 'msg-right'} ${
      sameSenderAsPrev ? 'mt-sm' : 'mt-md'
    }  
    
    ${
      (!sameSenderAsNext || !nextItem) &&
      (!isSenderTheUser ? 'bblr-0' : 'bbrr-0')
    }
    ">
        ${
          !sameSenderAsPrev && !isSenderTheUser
            ? `<span  style="color:${stringToHslColor(
                sender.name
              )};" class="sender-name"> ${sender.name}</span>`
            : ''
        }
        ${item.message}
        <span class="sent-at"> ${changeTimeFormat(new Date(item.sentAt))}</span>
      </p>`
  }
}

export default new GroupMessage()
