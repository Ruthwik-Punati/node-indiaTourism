import contacts from './views/contacts'

export const state = { messages: [] }

class Model {
  state = {}

  setContacts(contacts) {
    this.state.contacts = contacts
  }

  getContacts() {
    return this.state.contacts
  }

  setUser() {
    this.state.user = JSON.parse(localStorage.getItem('user'))
  }
  getUser() {
    return this.state.user
  }
  addMessage(message) {
    this.state.messages.push(message)
  }

  setMessages(messages) {
    this.state.messages = messages
  }

  getMessages() {
    return this.state.messages
  }

  setGroupMessages(groupMessages) {
    this.state.groupMessages = groupMessages
  }
  getGroupMessages() {
    return this.state.groupMessages
  }

  addGroupMessage(groupMessage) {
    this.state.groupMessages.push(groupMessage)
  }

  setSelectedContact(contactName) {
    const selectedContact = this.getContacts().with.find(
      (contact) => contact.user.name === contactName
    )
    this.state.selectedContact = selectedContact
  }

  getSelectedContact() {
    return this.state.selectedContact
  }

  setSelectedGroup(groupName) {
    const selectedGroup = this.getContacts().groups.find(
      (group) => group.name === groupName
    )
    this.state.selectedGroup = selectedGroup
  }

  getSelectedGroup() {
    return this.state.selectedGroup
  }

  filterContacts(searchText) {
    const filteredContacts = { ...this.state.contacts }
    filteredContacts.with = filteredContacts.with.filter((user) =>
      user.user.name.toLowerCase().includes(searchText.toLowerCase())
    )
    filteredContacts.groups = filteredContacts.groups.filter((group) =>
      group.name.toLowerCase().includes(searchText.toLowerCase())
    )
    this.state.filteredContacts = filteredContacts
  }

  getFilteredContacts() {
    return this.state.filteredContacts
  }
}

export default new Model()
