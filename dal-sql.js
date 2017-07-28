const mysql = require('mysql')
const HTTPError = require('node-http-error')
const dalHelper = require('./lib/dal-helper')
const { assoc, prop, compose, omit, path } = require('ramda')

///////////
///// CREATE
///////////

const createPainting = (painting, callback) => {
  dalHelper.create('paintings', painting, paintingFormatter, callback)
}

///////////
///// READ
///////////

const findPainting = (id, callback) => {
  dalHelper.read('paintings', 'ID', id, paintingOutputFormatter, callback)
}

///////////
///// UPDATE
///////////

const updatePainting = (body, id, callback) => {
  dalHelper.update('paintings', body, 'ID', paintingFormatter, id, callback)
}

///////////
///// DELETE
///////////
const deletePainting = (id, callback) => {
  dalHelper.deleteRow('paintings', 'ID', id, callback)
}
///////////
///// LIST
///////////

const listPaintings = (filter, lastItem, limit, callback) => {
  dalHelper.listItem(
    'paintings',
    filter,
    lastItem,
    limit,
    paintingOutputFormatter,
    'ID',
    function(err, data) {
      err ? callback(err) : callback(null, data)
    }
  )
}

const paintingFormatter = p => {
  return compose(omit('type'), omit('museum'), omit('_id'), omit('_rev'))(p)
}

const paintingOutputFormatter = p => {
  return compose(
    assoc('_rev', ''),
    assoc('museum', ''),
    assoc('type', 'painting'),
    omit('ID'),
    assoc('_id', path(['ID'], p))
  )(p)
}

const dal = {
  createPainting,
  findPainting,
  updatePainting,
  deletePainting,
  listPaintings
}

module.exports = dal
