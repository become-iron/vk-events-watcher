import pathify from 'vuex-pathify'


pathify.options.mapping = 'simple'
pathify.options.mapping = function (type, name, formatters) {
  switch (type) {
    case 'mutations':
    case 'actions':
      return formatters.camel('set', name)
  }
  return name
}

export default pathify
