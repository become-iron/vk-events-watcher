import { viewsKeys } from '@/configurations/app'


export const entityTypes = Object.freeze({
  group: 'group',
  user: 'user'
})

export const viewTypeToEntityType = Object.freeze({
  [viewsKeys.groups]: entityTypes.group,
  [viewsKeys.users]: entityTypes.user
})
