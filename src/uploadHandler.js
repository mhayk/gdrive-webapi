import BusBoy from 'busboy'
import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream/promises'
import { logger } from '../src/logger.js'

export default class UploadHandler {
  constructor ({ io, socketId, downloadsFolder, messageTimeDelay = 200 }) {
    this.io = io
    this.socketId = socketId
    this.downloadsFolder = downloadsFolder
    this.ON_UPLOAD_EVENT = 'file-upload'
  }

  // Back pressure!
  canExecute(lastExecution) {

  }

  handleFileBytes(filename) {
    this.lastMessageSent = Date.now()

    async function* handleData(source) {
      let processedAlready = 0

      for await(const chunk of source) {
        yield chunk

        processedAlready += chunk.length

        if(!this.canExecute(this.lastMessageSent)) {
          continue;
        }

        this.io.to(this.socketId).emit(this.ON_UPLOAD_EVENT, {
          processedAlready,
          filename
        })

        logger.info(`File [${filename}] processed ${processedAlready} bytes to ${this.socketId}`)
      }
    }

    return handleData.bind(this)
  }

  async onFile (fieldname, file, filename) {
    const saveTo = path.resolve(this.downloadsFolder,filename)
    await pipeline(
      // 1. step, get a readable stream from the file!
      file,
      // 2. step, filter, convert, transform data!
      this.handleFileBytes.apply(this, [filename]),
      // 3. step, write the file to the downloads folder!
      fs.createWriteStream(saveTo)
    )

    logger.info(`File [${filename}] finished`)
  }

  registerEvents (headers, onFinish) {
    const busboy = new BusBoy({ headers })

    busboy.on("file", this.onFile.bind(this))
    busboy.on("finish", onFinish)

    return busboy
  }
}
