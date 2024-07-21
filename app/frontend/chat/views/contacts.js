import View from './view'

import contactList from './contactList'
import SearchForm from './searchForm'
import searchForm from './searchForm'
import sendForm from './sendForm'

class Contacts extends View {
  _element = () => document.querySelector('.chat')

  _generateMarkUp(data) {
    return `<div class="chat"><h1 class="title">Day Dreams</h1>
       ${SearchForm.render()}
  ${contactList.render(data)}</div>
`
  }

  // render(data) {
  //   try {
  //     return super.render(data)
  //   } finally {
  //     this._element().querySelector('.input-box').focus()
  //   }
  // }
}

export default new Contacts()
