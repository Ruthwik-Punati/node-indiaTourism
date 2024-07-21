import model from '../model'
import { changeTimeFormat } from '../helper'
import View from './view'
import groupMessage from './groupMessage'
import model from '../model'

class GroupMessages extends View {
  // _element = () => document.querySelector('.messages')
  _generateMarkUp(data) {
    return `<div class="messages">
     ${
       data.length === 0
         ? `<p class="start-conversation">Start a Conversation!</p>`
         : ''
     }
          ${data
            .map((item, i, arr) => {
              return `
       ${groupMessage.render({
         item,
         prevItem: arr[i - 1],
         nextItem: arr[i + 1],
       })}
    `
            })
            .join('')}
        </div>`
  }
}

export default new GroupMessages()
