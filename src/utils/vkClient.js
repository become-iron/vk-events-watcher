import vk from '@vkontakte/vk-bridge'
import Vue from 'vue'

import settings from '@/settings'
import i18n from '@/i18n'
import { showErrorMessage } from '@/utils/common'


/**
 * @param {string} method
 * @param {Object} [params]
 * @returns {Object}
 */
export async function vkClient (method, params = {}) {
  const token = Vue.store.get('auth/token')
  const result = await vk.send('VKWebAppCallAPIMethod', {
    method,
    params: {
      ...params,
      v: settings.vkAPIVersion,
      access_token: token
    }
  })

  if (result.response) {
    return result.response
  } else {
    // noinspection ES6MissingAwait
    showErrorMessage(i18n.t('errors.errorDuringRequest'))
    throw result
  }
}

vkClient.initClient = async function () {
  try {
    // synchronous call
    vk.send('VKWebAppInit', {})

    let result = await vk.send('VKWebAppGetAuthToken', {
      app_id: settings.appID,
      scope: settings.requiredRights.join(',')
    })
    await Vue.store.set('auth/token', result.access_token)

    result = await vk.send('VKWebAppGetUserInfo')
    await Vue.store.set('auth/userID', result.id)
  } catch (error) {
    // noinspection ES6MissingAwait
    showErrorMessage(i18n.t('errors.errorDuringVKClientInitialization'))
    throw error
  }
}

export default vkClient
