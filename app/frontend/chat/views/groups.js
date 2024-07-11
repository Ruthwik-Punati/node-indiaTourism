import * as model from '../model'

class Groups {
  _parentEl = document.querySelector('.chat')
  generateMarkUp(groups) {
    return ` ${groups
      .map((group) => {
        const lastMsg = group.lastMsg?.message
        return ` <div class="contactCard groupCard">
      <img
        class="dp"
        src=${group.profileUrl || '"svgs/person.svg"'}
      />
     <div> <h2 class="name">${group.name}</h2>
     ${lastMsg ? `<p class="last-msg">${lastMsg}</p>` : ''}
     </div>
      <img class="arrow" src="svgs/arrow.svg" />
    </div>`
      })
      .join('')}`
  }

  addSelectHandler(handler) {
    this._parentEl.querySelectorAll('.groupCard').forEach((card) =>
      card.addEventListener('click', function (e) {
        const groupName = e.target
          .closest('.groupCard')
          .querySelector('.name').textContent
        console.log(model.state.contacts.groups)
        model.state.selectedGroup = model.state.contacts.groups.find(
          (group) => group.name === groupName
        )
        handler()
      })
    )
  }
}

export default new Groups()
