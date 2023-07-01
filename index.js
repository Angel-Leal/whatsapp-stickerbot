const png = require('./png.js')
const qrcode = require('qrcode-terminal')
const fs = require('fs')

const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js')
const { type } = require('os')

// country_code = '521'
// number = '8139845815'

const client = new Client({
  restartOnAuthFail: true,
  puppeteer: {
    headless: true,
    executablePath:
      'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  },
  authStrategy: new LocalAuth(),
  ffmpegPath: 'ffmpeg/bin/ffmpeg.exe'
})

client.initialize()

client.on('qr', qr => {
  qrcode.generate(qr, { small: true })
})

client.on('ready', () => {
  console.log('El cliente está listo')
})

client.on('authenticated', session => {
  console.log('WHATSAPP WEB => Authenticated')
})

client.on('auth_failure', msg => {
  console.error('Hubo un error en la autenticación', msg)
})

client.on('message', async msg => {
  let chat = await msg.getChat()
  let msgtxt = msg.body.toLowerCase().split(' ').join('')
  try { //try start
  if (isMedia(msg) && chat.isGroup && msgtxt.startsWith('.sticker') && !msgtxt.startsWith('.stickerpng')) {
    const media = await msg.downloadMedia()

    client.sendMessage(msg.from, media, {
      sendMediaAsSticker: true,
      stickerAuthor: 'Angel Leal',
      stickerName: 'Sticker'
    })
    msg.react('🎅🏻')
  } else if (isMedia(msg) && !chat.isGroup) {
    const media = await msg.downloadMedia()

    client.sendMessage(msg.from, media, {
      sendMediaAsSticker: true,
      stickerAuthor: 'Angel Leal',
      stickerName: 'Sticker'
    })
    msg.react('🎅🏻')
  } else if (
    msg.hasQuotedMsg &&
    msgtxt.startsWith('.sticker') &&
    !msgtxt.startsWith('.stickerpng')
  ) {
    let mensaje = await msg.getQuotedMessage()
    if (isMedia(mensaje)) {
      let media = await mensaje.downloadMedia()
      client.sendMessage(msg.from, media, {
        sendMediaAsSticker: true,
        stickerAuthor: 'Angel Leal',
        stickerName: 'Sticker'
      })
      mensaje.react('🎅🏻')
    }
  } else if (
    msgtxt.startsWith('.sticker') &&
    !msgtxt.startsWith('.stickerpng')
  ) {
    let mensaje = await chat.fetchMessages({ limit: 100 })
    for (const mens of mensaje.reverse()) {
      if (isMedia(mens)) {
        const media = await mens.downloadMedia()
        client.sendMessage(msg.from, media, {
          sendMediaAsSticker: true,
          stickerAuthor: 'Angel Leal',
          stickerName: 'Sticker'
        })
        mens.react('🎅🏻')
        break
      }
    }
  } else if (msg.hasQuotedMsg && msgtxt.startsWith('.stickerpng')) {
    let mensaje = await msg.getQuotedMessage()
    if (isMedia(mensaje)) {
      const media = await mensaje.downloadMedia()
      media.filename = 'image.jpg'
      fs.writeFile('./' + media.filename, media.data, 'base64', function (err) {
        if (err) {
          console.log(err)
        }
      })
      let removed = await png.removeBg(media.filename)
      if (removed) {
        let mediapng = MessageMedia.fromFilePath('./image.png')
        client.sendMessage(msg.from, mediapng, {
          sendMediaAsSticker: true,
          stickerAuthor: 'Angel Leal',
          stickerName: 'Sticker'
        })
        mensaje.react('🎅🏻')
      } else {
        mensaje.reply('No se pudo eliminar el fondo 😔🤙')
      }
    }
  } else if(isMedia(msg) && chat.isGroup && msgtxt.startsWith('.stickerpng')) {
      const media = await msg.downloadMedia()
      media.filename = 'image.jpg'
      fs.writeFile('./' + media.filename, media.data, 'base64', function (err) {
        if (err) {
          console.log(err)
        }
      })
      let removed = await png.removeBg(media.filename)
      if (removed) {
        let mediapng = MessageMedia.fromFilePath('./image.png')
        client.sendMessage(msg.from, mediapng, {
          sendMediaAsSticker: true,
          stickerAuthor: 'Angel Leal',
          stickerName: 'Sticker'
        })
        msg.react('🎅🏻')
      } else {
        msg.reply('No se pudo eliminar el fondo 😔🤙')
      }
  } else if (msgtxt.startsWith('.stickerpng')) {
    let mensaje = await chat.fetchMessages({ limit: 100 })
    for (const mens of mensaje.reverse()) {
      if (isMedia(mens)) {
        const media = await mens.downloadMedia()
        media.filename = 'image.jpg'
        fs.writeFile(
          './' + media.filename,
          media.data,
          'base64',
          function (err) {
            if (err) {
              console.log(err)
            }
          }
        )
        let removed = await png.removeBg(media.filename)
        if (removed) {
          mediapng = MessageMedia.fromFilePath('./image.png')
          client.sendMessage(msg.from, mediapng, {
            sendMediaAsSticker: true,
            stickerAuthor: 'Angel Leal',
            stickerName: 'Sticker'
          })
          mens.react('🎅🏻')
        }
        break
      }
    }
  }
  } catch (err) { //enf of try
    }	//catch
})
const isMedia = msg => {
  if (msg.hasMedia && msg.type !== 'ptt') {
    return true
  }
  return false
}
