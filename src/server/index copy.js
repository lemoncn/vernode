const fs = require('fs')
const path = require('path')
const express = require('express')
const archiver = require('archiver')
const officegen = require('officegen')
const _ = require('lodash')
const { Image, createCanvas } = require('canvas')

function loadTemplate (canvas) {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      resolve()
    }
    img.onerror = reject
    img.src = path.join(__dirname, '../assets/template2022.png')
  })

}

function draw (canvas, code, number, sign, amount) {
  const ctx = canvas.getContext('2d')
  ctx.font = '400 14px "Microsoft YaHei"'
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(608, 520, 240, 20)
  ctx.fillRect(608, 553, 240, 20)
  ctx.fillRect(608, 587, 240, 20)
  ctx.fillRect(608, 619, 240, 20)
  ctx.fillStyle = '#000000'
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
  ctx.lineWidth = 0.5
  ctx.fillText(code.toString(), 610, 537)
  ctx.fillText(number.toString(), 610, 570)
  ctx.fillText(sign.toString(), 610, 604)
  ctx.fillText(amount, 610, 636)

  return canvas.toBuffer('image/jpeg', {quality: 0.7})
}






const app = express()
app.use((req, res, next) => {
  if (req.path === '/' || req.path === '/fapiao') {
    console.log(req.ip, new Date(), req.path)
  }
  next()
})
app.use(express.static('dist'))
app.get('/test', async (req, res) => {
  const canvas = createCanvas(1270, 806)
  await loadTemplate(canvas)
  let buf = draw(canvas, 1, 2, 3, 4)
  let img = path.join(__dirname, 'test2.jpeg')
  fs.writeFileSync(path.join(__dirname, 'test2.jpeg'), buf)
  res.sendFile(img)
})
app.get('/fapiao', async (req, res) => {
  const canvas = createCanvas(1151, 813)
  await loadTemplate(canvas)

  let form = JSON.parse(req.query.value)
  let archive = null
  let docx = null

  if (form.genWord) {
    docx = officegen({
      type: 'docx',
      title: '发票验证截图'
    })
    res.attachment('发票验证截图.docx')
  } else {
    archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    });
    res.attachment('fapiao.zip')
  }

  let numbers = []
  _.each(form.numbers, range => {
    numbers = _.concat(numbers, _.range(Number(range.min), Number(range.max) + 1))
  })
  _.each(numbers, (num, index) => {
    let buf = draw(canvas, form.code, num, form.sign, form.money)

    if (docx) {
      let page = docx.createP({ align: 'center' })
      page.addImage(buf, {cx: 600, cy: 423}, 'jpeg')
      if (index < numbers.length - 1) {
        docx.putPageBreak()
      }
    } else {
      archive.append(buf, { name: (index + 1) + '.jpg' })
    }
  })

  if (docx) {
    docx.generate(res)
  } else {
    archive.pipe(res)
    archive.finalize()
  }
})

app.listen(1234, () => console.log('Example app listening on port 1234!'))

