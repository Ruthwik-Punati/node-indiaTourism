import { addEvent } from '../helper'
import View from './view'

class SearchForm extends View {
  // _element = () => document.querySelector('.search-form')

  _generateMarkUp() {
    return `<form class="search-form"><input class="input-box search" placeholder="Search..." onblur="this.focus()" autofocus  /></form>`
  }

  addHandlerSearch(handler) {
    addEvent('submit', '.search', (e) => {
      e.preventDefault()
    })

    addEvent('focus', '.search', function (e) {})

    addEvent('input', '.search', function (e) {
      handler(e.target.value)
    })
  }
}

export default new SearchForm()
