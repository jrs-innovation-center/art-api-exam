const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)
const HTTPError = require('node-http-error')
const buildPk = require('./lib/build-pk')
const generatePk = buildPk('painting_')
const { pathOr, assoc, split, head, last } = require('ramda')

const test = callback => {
  callback(null, 'dal is ok')
}
//CREATE
function createPainting(painting, callback) {
  const artName = pathOr('', ['name'], painting)
  console.log('artName', artName)
  const pk = generatePk(`${artName}`)
  console.log('pk', pk)

  painting = assoc('_id', pk, painting)
  painting = assoc('type', 'painting', painting)

  createDoc(painting, callback)
}

//READ

function findPainting(id, callback) {
  console.log('DALLLL')
  db.get(id, function(err, doc) {
    if (err) return callback(err)

    doc.type === 'painting'
      ? callback(null, doc)
      : callback(new HTTPError(400, 'This document is not a painting'))
  })
}

//UPDATE

function updatePainting(painting, callback) {
  painting = assoc('type', 'painting', painting)
  createDoc(painting, callback)
}

//DELETE

function deletePainting(id, callback) {
  db
    .get(id)
    .then(doc => db.remove(doc))
    .then(doc => callback(null, doc))
    .catch(err => callback(err))
}

//LIST

function listPaintings(filter, lastItem, limit, callback) {
  var query = {}
  if (filter) {
    console.log('hit if statement')

    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)

    const selectorValue = assoc(filterField, filterValue, {})
    query = {
      selector: selectorValue,
      limit
    }
  } else if (lastItem) {
    query = {
      selector: {
        _id: { $gt: lastItem },
        type: 'painting'
      },
      limit
    }
  } else {
    query = {
      selector: {
        _id: { $gte: null },
        type: 'painting'
      },
      limit
    }
  }

  find(query, function(err, data) {
    if (err) return callback(err)
    callback(null, data.docs)
  })
}

// HELPER FUNCTIONS

function createDoc(doc, callback) {
  db.put(doc).then(res => callback(null, res)).catch(err => callback(err))
}
function find(query, callback) {
  query ? db.find(query, callback) : callback(null, [])
}
// function getDoc(id, callback) {
//   db.get(id, function(err, doc) {
//     if (err) return callback(err)
//     callback(null, doc)
//   })
// }

const dal = {
  test,
  createPainting,
  findPainting,
  updatePainting,
  deletePainting,
  listPaintings
}

module.exports = dal
