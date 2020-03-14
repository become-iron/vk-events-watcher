import union from 'lodash/union'
import isEqual from 'lodash/isEqual'


export function getObjectsDifferencesByValues (first, second, keysToCompare = null) {
  if (!keysToCompare) {
    keysToCompare = union(Object.keys(first), Object.keys(first))
  }

  return keysToCompare.reduce((acc, key) => {
    const valueInFirst = first[key] ?? null
    const valueInSecond = second[key] ?? null

    if (!isEqual(valueInFirst, valueInSecond)) {
      acc[key] = [valueInFirst, valueInSecond]
    }

    return acc
  }, {})
}
