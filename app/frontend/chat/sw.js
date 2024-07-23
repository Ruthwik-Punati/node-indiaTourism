self.addEventListener('notificationclick', (event) => {
  const clickedNotification = event.notification
  clickedNotification.close()
  function doSomething() {
    clients.openWindow('https://daydreams.website/chat.html')
  }
  // Do something as the result of the notification click
  const promiseChain = doSomething()
  event.waitUntil(promiseChain)
})
