require('dotenv').config()
const PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'))
const db = new PouchDB(process.env.COUCHDB_URL + process.env.COUCHDB_NAME)

db
  .createIndex({
    index: { fields: ['type'] }
  })
  .then(() => console.log('Created index on type field'))
  .catch(err => console.log(err))
