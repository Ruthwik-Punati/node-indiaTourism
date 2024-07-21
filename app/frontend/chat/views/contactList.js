import Groups from './groups'
import onlyContacts from './onlyContacts'

import View from './view'

class ContactList extends View {
  _generateMarkUp(data) {
    const contacts = data.with
    const groups = data.groups
    return `<div class="contacts"> 
   
   ${Groups.render(groups)}
    ${onlyContacts.render(contacts)}
   </div>`
  }

  update(data) {
    document.querySelector('.contacts').outerHTML = this._generateMarkUp(data)
  }
}
export default new ContactList()
