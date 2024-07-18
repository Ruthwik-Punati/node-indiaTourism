import { addEvent, getModLastMsg } from '../helper'
import View from './view'

class Groups extends View {
  _generateMarkUp(groups) {
    return ` ${groups
      .map((group) => {
        const lastMsg = group.lastMsg?.message
        console.log(lastMsg?.substr(0, 10))
        return ` <div class="groupCard">
    <div class="letter-dp">${group.name.charAt(0)}</div>
     <div> <h2 class="name">${group.name}</h2>
      ${lastMsg ? `<p class="last-msg">${getModLastMsg(lastMsg)}</p>` : ''}
     </div>
      <img class="arrow" src="svgs/arrow.svg" />
    </div>`
      })
      .join('')}`
  }

  addSelectHandler(handler) {
    addEvent('click', '.groupCard', function (e) {
      const groupCard = e.target.closest('.groupCard')

      const groupName = groupCard.querySelector('.name').textContent

      handler(groupName)
    })
  }
}

export default new Groups()
