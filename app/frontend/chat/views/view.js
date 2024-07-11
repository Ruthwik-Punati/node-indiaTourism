export default class View {
  render(data) {
    const markUp = this._generateMarkUp(data)
    this.clear()
    this._parentEl.insertAdjacentHTML('beforeEnd', markUp)
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
