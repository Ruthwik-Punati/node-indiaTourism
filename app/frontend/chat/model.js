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
    if (!contactName) {
      this.state.selectedContact = null
      return
    }
    const selectedContact = this.getContacts().with.find(
      (contact) => contact.user.name === contactName
    )
    this.state.selectedContact = selectedContact
  }

  getSelectedContact() {
    return this.state.selectedContact
  }

  setSelectedGroup(groupName) {
    if (!groupName) {
      this.state.selectedGroup = null
      return
    }
    const selectedGroup = this.getContacts().groups.find(
      (group) => group.name === groupName
    )
    this.state.selectedGroup = selectedGroup
  }

  getSelectedGroup() {
    return this.state.selectedGroup
  }

  filterContacts(searchText = '') {
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

  setPage(page) {
    this.state.page = page
  }

  getPage() {
    return this.state.page
  }

  isPage(page) {
    return this.state.page === page
  }

  getMessageSender(sender) {
    return this.state.contacts.with.find((contact) => {
      return contact.user._id === sender
    }).user
  }

  getGroupMessageSender(sender) {
    return this.state.contacts.groups[0].users.find(
      (user) => user._id === sender
    )
  }
}

export default new Model()
