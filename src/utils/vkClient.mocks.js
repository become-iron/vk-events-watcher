// import _ from 'lodash'

import apiMocks from '@/mocks'


/**
 * @param {string} method
 * @param {Object} [params]
 * @returns {Object}
 */
// eslint-disable-next-line no-unused-vars
export async function vkClient (method, params = {}) {
  switch (method) {
    case 'groups.get':
      return apiMocks.getGroups.response
      // return {
      //   ...apiMocks.getGroups.response,
      //   items: _.sampleSize(apiMocks.getGroups.response.items, _.random(1, 10))
      // }
    case 'friends.get':
      return { items: apiMocks.getUsers.response }  // TEMP
  }
}

vkClient.initClient = function () {

}
