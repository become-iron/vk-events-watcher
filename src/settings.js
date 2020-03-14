import { entityTypes } from '@/configurations/entity'


export default {
  appCodeName: 'vkEventsWatcher',

  vkAPIVersion: '5.103',
  appID: parseInt(process.env.VUE_APP_VK_APPLICATION_ID, 10),

  requiredRights: ['friends', 'groups'],

  groupsFields: [
    'trending', 'verified'
  ],
  usersFields: [
    'first_name', 'last_name', 'nickname', 'maiden_name', 'screen_name',
    'deactivated', 'relation', 'status', 'trending', 'verified',
    'photo_50'
  ],

  fieldsToCompare: {
    [entityTypes.group]: [
      'name', 'screen_name', 'is_closed',
      'trending', 'verified'
    ],
    [entityTypes.user]: [
      'first_name', 'last_name', 'nickname', 'maiden_name', 'screen_name',
      'deactivated', 'relation', 'status', 'trending', 'verified'
    ]
  },

  eventDateTitleFormat: 'd LLLL y HH:mm'
}
