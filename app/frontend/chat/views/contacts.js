import View from './view'
import * as model from '../model'
import Groups from './groups'

class Contacts extends View {
  _parentEl = document.querySelector('.chat')

  _generateMarkUp(data) {
    const contacts = data.with
    console.log(data)
    return `<h1 class="title">Day Dreams</h1><form class="search-form">
    
    <input class="input-box search" onblur="this.focus()" autofocus  /></form><div class="contacts">
    
   ${Groups.generateMarkUp(data.groups)}
    
    ${contacts
      .map((contact) => {
        console.log(contact)
        const lastMsg = contact.lastMsg?.message
        return ` <div class="contactCard">
      <img
        class="dp"
        src=${contact.user.profileUrl || '"svgs/person.svg"'}
      />
     <div> <h2 class="name">${contact.user.name}</h2>
     ${lastMsg ? `<p class="last-msg">${lastMsg}</p>` : ''}
     </div>
      <img class="arrow" src="svgs/arrow.svg" />
    </div>`
      })
      .join('')}</div>`
  }

  addSelectHandler(handler) {
    this._parentEl.querySelectorAll('.contactCard').forEach((card) =>
      card.addEventListener('click', function (e) {
        console.log(
          e.target.closest('.contactCard').classList.contains('groupCard')
        )
        if (e.target.closest('.contactCard').classList.contains('groupCard'))
          return

        const contactName = e.target
          .closest('.contactCard')
          .querySelector('.name').textContent
        console.log(model.state.contacts)
        model.state.selectedContact = model.state.contacts.with.find(
          (contact) => contact.user.name === contactName
        )
        handler()
      })
    )
  }
}

export default new Contacts()
