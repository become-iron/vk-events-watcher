import Vue from 'vue'


export async function showMessage (messageText, color = null) {
  await Vue.store.set('messageText', messageText)
  await Vue.store.set('messageColor', color)
  await Vue.store.set('showMessageText', true)
}

export async function showSuccessMessage (messageText) {
  await showMessage(messageText, 'success')
}

export async function showErrorMessage (messageText) {
  await showMessage(messageText, 'error')
}

// source: https://codepen.io/mednabouli/pen/EdKzzL
export function isBottomVisible (margin = 0) {
  const scrollY = window.scrollY
  const visibleHeight = document.documentElement.clientHeight
  const pageHeight = document.documentElement.scrollHeight
  const isBottomOfPage = (visibleHeight + scrollY + margin) >= pageHeight
  return isBottomOfPage || pageHeight < visibleHeight
}
