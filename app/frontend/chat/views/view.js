import { addEvent } from '../helper'

export default class View {
  render(data) {
    const element = this._element?.()

    if (!element) {
      return this._generateMarkUp(data)
    } else {
      const newElement = new DOMParser().parseFromString(
        this._generateMarkUp(data),
        'text/html'
      )

      document
        .querySelector('.' + element.classList[0])
        .replaceWith(newElement.documentElement.children[1].children[0])

      // element.outerHTML = this._generateMarkUp(data)
    }
  }

  addBackToContactsHandler(handler) {
    addEvent('click', '.back', handler)
  }

  scrollBottom() {
    const messages = document.querySelector('.messages')

    // messages.scrollTop = messages.scrollHeight
    console.log(messages.lastChild)
    messages.lastElementChild.scrollIntoView()
  }

  removeStartConversation() {
    this.element().querySelector('.start-conversation').remove()
  }

  update(data) {
    if (!data) return
    const parentEl = this._element()
    const newmarkUp = this._generateMarkUp(data)
    const newDOM = document.createRange().createContextualFragment(newmarkUp)
    const newElements = Array.from(newDOM.querySelectorAll('*'))
    const currElements = Array.from(parentEl.querySelectorAll('*'))

    newElements.shift()

    // updates changed text
    newElements.forEach((newEl, i) => {
      let curEl = currElements[i]
      console.log(curEl, '-----', newEl)
      if (!curEl) {
        parentEl.appendChild(newEl)

        return
      }
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent
      }

      // updates changed attributes
      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim()) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        )
      }
    })
  }
  clear() {
    this._parentEl.textContent = ''
  }

  renderSpinner() {
    const markUp = `<p>Loading...</p>`
    this._parentEl.insertAdjacentHTML('beforeEnd', markUp)
  }
  renderError() {
    const markUp = `<p>Error</p>`
    this._parentEl.insertAdjacentHTML('beforeEnd', markUp)
  }
}
