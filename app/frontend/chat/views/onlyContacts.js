import { addEvent, getModLastMsg } from '../helper'
import View from './view'

import letterDp from './letterDp'
class OnlyContacts extends View {
  _generateMarkUp(contacts) {
    return ` ${contacts
      .map((contact) => {
        console.log(contact)
        const lastMsg = contact.lastMsg?.message
        const name = contact.user.name

        return ` <div class="contactCard cursor-p">  ${letterDp.render(name)} 
    <div> <h2 class="name">${name}</h2>
     ${lastMsg ? `<p class="last-msg">${getModLastMsg(lastMsg)}</p>` : ''}
     </div>
    
    </div>`
      })
      .join('')}`
  }

  addSelectHandler(handler) {
    addEvent('click', '.contactCard', function (e) {
      const contactName = e.target
        .closest('.contactCard')
        .querySelector('.name').textContent

      handler(contactName)
    })
  }
}

export default new OnlyContacts()
