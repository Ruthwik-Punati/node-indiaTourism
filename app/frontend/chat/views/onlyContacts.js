import { addEvent, getModLastMsg } from '../helper'
import View from './view'

class OnlyContacts extends View {
  _generateMarkUp(contacts) {
    return ` ${contacts
      .map((contact) => {
        console.log(contact)
        const lastMsg = contact.lastMsg?.message
        console.log(lastMsg?.substr(0, 10))
        return ` <div class="contactCard">
      <img
        class="dp"
        src=${contact.user.profileUrl || '"svgs/person.svg"'}
      />
     <div> <h2 class="name">${contact.user.name}</h2>
     ${lastMsg ? `<p class="last-msg">${getModLastMsg(lastMsg)}</p>` : ''}
     </div>
      <img class="arrow" src="svgs/arrow.svg" />
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
