import { entityTypes } from '@/configurations/entity'


export function isDesktopPlatform () {
  const url = new URL(window.location.href)
  const platform = url.searchParams.get('vk_platform')
  return platform === 'desktop_web' || platform == null
}

export function getEntityURL (entityType, entityData) {
  let domain

  switch (entityType) {
    case entityTypes.group:
      domain = entityData.screen_name

      if (!domain) {
        switch (entityData.type) {
          case 'group':
            domain = `public${domain}`
            break
          case 'page':
            domain = `club${domain}`
            break
          case 'event':
            domain = `event${domain}`
            break
          default:
            return null
        }
      }

      break
    case entityTypes.user:
      domain = entityData.domain || entityData.screen_name || `id${entityData.id}`
      break
    default:
      return null
  }

  return `https://vk.com/${domain}`

}
