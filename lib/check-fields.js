const { difference, keys } = require('ramda')

module.exports = artKeys => data => difference(artKeys, keys(data))
