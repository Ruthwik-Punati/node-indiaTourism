import { addEvent, getModLastMsg } from '../helper'
import View from './view'

import letterDp from './letterDp'

class Groups extends View {
  _generateMarkUp(groups) {
    return ` ${groups
      .map((group) => {
        const lastMsg = group.lastMsg?.message
        const name = group.name

        return ` <div class="groupCard cursor-p">
   ${letterDp.render(name)}
     <div> <h2 class="name">${name}</h2>
      ${lastMsg ? `<p class="last-msg">${getModLastMsg(lastMsg)}</p>` : ''}
     </div>

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
