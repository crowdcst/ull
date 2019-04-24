const express = require('express')
const cors = require('cors')
const xml2js = require('xml2js')

const app = express()
app.use(cors())

const cache = {}

app.put('/:filename', function (req, res, next) {
  const { filename } = req.params

  if (filename.startsWith('chunk')) {
    console.time(filename)
  }

  if (!cache[filename]) {
    cache[filename] = {
      done: false,
      chunks: []
    }
  }

  if (filename.endsWith('.mpd')) {
    cache[filename] = {
      done: false,
      chunks: []
    }
  }
  
  req.on('data', chunk => {
    cache[filename].chunks.push(chunk)
  })

  req.on('end', () => {
    if (filename.startsWith('chunk')) {
      console.timeEnd(filename)

      setTimeout(() => {
        cache[filename] = undefined
      }, 3000 * 1000)
    }

    cache[filename].done = true

    if (filename !== 'out.mpd') {
      res.end()
    }
  })
})

app.get('/:filename', async function (req, res, next) {
  const { filename } = req.params

  if (filename.endsWith('.mp4')) {
    res.set('Content-Type', 'video/mp4')
  }

  if (filename.endsWith('.mpd')) {
    res.set('Content-Type', 'application/dash+xml')
  }

  let idx = 0

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  console.log('streaming file', filename)

  while (!cache[filename] || !cache[filename].done) {
    if (!cache[filename]) {
      await sleep(50)
      continue
    }

    const chunks = cache[filename].chunks.slice(idx)
    const length = chunks.length
    if (length === 0) {
      await sleep(50)
      continue
    }
    idx += length
    const buffer = Buffer.concat(chunks)
    res.write(buffer)
    await sleep(50)
  }

  const chunks = cache[filename].chunks.slice(idx)
  const length = chunks.length
  if (length === 0) {
    res.end()
    return
  }
  const buffer = Buffer.concat(chunks)
  res.write(buffer)
  res.end()
})

app.listen(3104, function () {
  console.log('Listening on 3104...')
})