import { addEvent } from '../helper'
import View from './view'

class SearchForm extends View {
  // _element = () => document.querySelector('.search-form')

  _generateMarkUp() {
    return `<form class="search-form"><input class="input-box search" placeholder="Search..."   /></form>`
  }

  addHandlerSearch(handler) {
    addEvent('submit', '.search', (e) => {
      e.preventDefault()
    })

    addEvent('input', '.search', function (e) {
      handler(e.target.value)
    })
  }
}

export default new SearchForm()
