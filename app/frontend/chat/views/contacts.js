import View from './view'

import contactList from './contactList'
import SearchForm from './searchForm'

class Contacts extends View {
  _element = () => document.querySelector('.chat')

  _generateMarkUp(data) {
    return `<div class="chat"><h1 class="title">Day Dreams</h1>
       ${SearchForm.render()}
  ${contactList.render(data)}</div>
`
  }
}

export default new Contacts()
