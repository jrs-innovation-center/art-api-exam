require('dotenv').config()
const HTTPError = require('node-http-error')
const { propOr, assoc, split, head, last, map, omit } = require('ramda')
const mysql = require('mysql')

//////////////////////////////
///  HELPERS
//////////////////////////////

function createConnection() {
  return mysql.createConnection({
    user: process.env.MYSQL_USER,
    host: process.env.MYSQL_HOST,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
  })
}

///////////
///// CREATE
///////////

const create = (tableName, data, formatter, callback) => {
  if (data) {
    const connection = createConnection()

    const sql = `INSERT INTO ${connection.escapeId(tableName)} SET ? `
    connection.query(sql, formatter(data), (err, result) => {
      if (err) return callback(err)

      propOr(null, 'insertId', result)
        ? callback(null, { ok: true, id: result.insertId })
        : callback(null, { ok: false, id: null })
    })

    connection.end(err => callback(err))
  }
}

///////////
///// READ
///////////

const read = (tableName, columnName, id, formatter, callback) => {
  if (tableName && id) {
    console.log('table name', tableName)
    console.log('column name', columnName)
    console.log('id', id)
    const connection = createConnection()

    connection.query(
      'SELECT * FROM ' +
        connection.escapeId(tableName) +
        ' WHERE ' +
        connection.escapeId(columnName) +
        ' = ? ',
      [id],
      function(err, result) {
        if (err) return callback(err)

        if (propOr(0, ['length'], result) > 0) {
          const formattedResult = formatter(head(result))
          return callback(null, formattedResult)
        } else {
          return callback(
            new HTTPError(404, 'missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
  }
}

///////////
///// UPDATE
///////////

const update = (tableName, data, columnName, formatter, id, callback) => {
  if (tableName && data) {
    const connection = createConnection()

    const formattedData = formatter(data)

    const sql = `
    UPDATE ${tableName}
    SET ?
    WHERE ${columnName} = ?`

    connection.query(sql, [formattedData, id], function(err, result) {
      if (err) callback(err)
      if (propOr(0, ['affectedRows'], result) === 1) {
        return callback(null, { ok: true, id: id })
      } else if (propOr(0, ['affectedRows'], result) === 0) {
        return callback(
          new HTTPError(400, 'Missing:', {
            name: 'not_found',
            error: 'not found',
            reason: 'missing'
          })
        )
      }
    })
    connection.end(function(err) {
      if (err) return err
    })
  } else {
    return callback(new HTTPError(400, 'Missing data for update.'))
  }
}

///////////
///// DELETE
///////////

const deleteRow = (tableName, columnName, id, callback) => {
  if (tableName && id) {
    const connection = createConnection()

    connection.query(
      `DELETE FROM ${connection.escapeId(tableName)}
      WHERE ${connection.escapeId(columnName)} = ?`,
      [id],
      function(err, result) {
        if (err) return callback(err)

        if (result && result.affectedRows === 1) {
          return callback(null, { ok: true, id: id })
        } else if (result && result.affectedRows === 0) {
          return callback(
            new HTTPError(400, 'Missing', {
              name: 'not_found',
              error: 'not found',
              reason: 'missing'
            })
          )
        }
      }
    )
    connection.end(err => callback(err))
  } else {
    return callback(new HTTPError(400, 'Missing id or entity name.'))
  }
}

///////////
///// LIST
///////////

const listItem = (
  tableName,
  filter,
  lastItem,
  limit,
  formatter,
  orderColumn,
  callback
) => {
  limit = limit ? limit : 5

  const connection = createConnection()

  if (filter) {
    const arrFilter = split(':', filter)
    const filterField = head(arrFilter)
    const filterValue = last(arrFilter)
    console.log('filterField', filterField)
    console.log('filterValue', filterValue)

    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE ${filterField} = ?
    ORDER BY ${connection.escapeId(orderColumn)}
    LIMIT ${limit}`

    connection.query(sql, [filterValue], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else if (lastItem) {
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    WHERE ID > ?
    ORDER BY ${connection.escapeId(orderColumn)}
    LIMIT ${limit}`

    connection.query(sql, [lastItem], function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  } else {
    const sql = `SELECT *
    FROM ${connection.escapeId(tableName)}
    ORDER BY name
    LIMIT ${limit}`

    connection.query(sql, function(err, result) {
      if (err) return callback(err)
      return callback(null, map(formatter, result))
    })
  }
}

/////////////
////// REPORT
/////////////

// const report = (tableName, columnName, location, formatter, callback) => {
//   if (location) {
//     console.log('location helper', location)
//     console.log('tableName', tableName)
//     console.log('columnName', columnName)
//     const connection = createConnection()
//
//     connection.query(
//       `SELECT Count(${connection.escapeId(columnName)})
//       FROM ${connection.escapeId(tableName)}
//       WHERE ${connection.escapeId(columnName)} = ? `,
//       [location],
//       function(err, result) {
//         console.log('helper err', err)
//         console.log('helper result', result)
//
//         if (err) return callback(err)
//
//         if (propOr(0, ['length'], result) > 0) {
//           const formattedResult = formatter(result)
//           console.log('Formatted Result', formattedResult)
//           return callback(null, formattedResult)
//         } else {
//           return callback(
//             new HTTPError(404, 'missing', {
//               name: 'not_found',
//               error: 'not found',
//               reason: 'missing'
//             })
//           )
//         }
//       }
//     )
//   }
// }

const dalHelper = {
  create,
  read,
  update,
  deleteRow,
  listItem,
  report
}

module.exports = dalHelper
