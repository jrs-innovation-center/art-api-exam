require('dotenv').config()
const express = require('express')
const app = express()
const dal = require(`./${process.env.DAL}`)
const port = process.env.PORT || 4000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const { pathOr, keys, path } = require('ramda')
const checkReqFields = require('./lib/check-fields')
const checkArtFields = checkReqFields([
  'name',
  'movement',
  'artist',
  'yearCreated',
  'museum'
])

app.use(bodyParser.json())

app.get('/', function(req, res, next) {
  res.send('Welcome to the Art API. Manage all the paintings.')
})

app.get('/test', function(req, res, next) {
  dal.test(
    (err, result) =>
      err
        ? res.status(500).send('problem with dal')
        : res.status(200).send(result)
  )
})

//CREATE
app.post('/art/paintings', function(req, res, next) {
  const painting = pathOr(null, ['body'], req)
  const fieldResults = checkArtFields(painting)

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields: ', {
        fields: fieldResults
      })
    )
  }
  dal.createPainting(painting, function(err, result) {
    console.log('app err', err)
    console.log('app result', result)
    if (err) return next(new HTTPError(err.status, err.message.err))
    res.status(201).send(result)
  })
})
//READ

app.get('/art/paintings/:id', function(req, res, next) {
  const id = pathOr(null, ['params', 'id'], req)

  if (id) {
    dal.findPainting(id, function(err, doc) {
      if (err) return next(new HTTPError(err.status, err.message, err))
      res.status(200).send(doc)
    })
  } else {
    return next(new HTTPError(400, 'Missing id in path'))
  }
})

//UPDATE

app.put('/art/paintings/:id', function(req, res, next) {
  const painting = pathOr(null, ['params', 'id'], req)
  const body = pathOr(null, ['body'], req)
  //const museumName = path(['museum'], body)

  // console.log('museumName', museumName)
  const checkPaintingFields = checkReqFields([
    '_id',
    '_rev',
    'name',
    'movement',
    'artist',
    'yearCreated',
    'museum'
    // `${keys(museumName)}`
  ])

  const fieldResults = checkPaintingFields(body)
  if (!body || keys(body).length === 0)
    return next(new HTTPError(400, 'Missing painting in request body'))

  if (fieldResults.length > 0) {
    return next(
      new HTTPError(400, 'Missing required fields: ', {
        fields: fieldResults
      })
    )
  }

  dal.updatePainting(body, painting, function(err, response) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(response)
  })
})

//DELETE

app.delete('/art/paintings/:id', function(req, res, next) {
  const id = pathOr(null, ['params', 'id'], req)

  dal.deletePainting(id, function(err, result) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(result)
  })
})

//LIST

app.get('/art/paintings', function(req, res, next) {
  const limit = pathOr(5, ['query', 'limit'], req)
  const lastItem = pathOr(null, ['query', 'lastItem'], req)
  const filter = pathOr(null, ['query', 'filter'], req)

  dal.listPaintings(filter, lastItem, Number(limit), function(err, data) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(data)
  })
})

// app.get('/art/reports/countbycity/:location', function(req, res, next) {
//   const location = pathOr(null, ['params', 'location'], req)
//
//   dal.getReport(location, function(err, data) {
//     console.log('APP DATA', data)
//     console.log('APP err', err)
//     console.log('APP location', location)
//     if (err) return next(new HTTPError(err.status, err.message, err))
//     res.status(200).send(data)
//   })
// })

//ERROR MIDDLEWARE

app.use(function(err, req, res, next) {
  console.log(req.method, req.path, err)
  res.status(err.status || 500)
  res.send(err)
})

app.listen(port, () => console.log('Api is up on port: ', port))
