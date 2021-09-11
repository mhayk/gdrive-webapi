import { describe, test, expect, jest } from '@jest/globals'
import fs from 'fs'
import FileHelper from '../../src/fileHelper'

describe('#FileHelper', () => {
  describe('#getFileStatus', () => {
    test('it should return file statuses in correct format', async () => {
      const statMock = {
        dev: 1685922606,
        mode: 33206,
        nlink: 1,
        uid: 0,
        gid: 0,
        rdev: 0,
        blksize: 4096,
        ino: 10977524100829176,
        size: 188000,
        blocks: 0,
        atimeMs: 1631209370323.1504,
        mtimeMs: 1631209370323.1504,
        ctimeMs: 1631209370322.942,
        birthtimeMs: 1631209370322.942,
        atime: '2021-09-09T17:42:50.323Z',
        mtime: '2021-09-09T17:42:50.323Z',
        ctime: '2021-09-09T17:42:50.323Z',
        birthtime: '2021-09-09T17:42:50.323Z'
      }

      const mockUser = 'mhayk'
      process.env.USER = mockUser
      const filename = 'file.png'

      jest.spyOn(fs.promises, fs.promises.readdir.name)
        .mockResolvedValue([filename])

      jest.spyOn(fs.promises, fs.promises.stat.name)
        .mockResolvedValue(statMock)

      const result = await FileHelper.getFilesStatus('/tmp')

      const expectedResult = [
        {
          size: '188 kB',
          lastModified: statMock.birthtime,
          owner: mockUser,
          file: filename
        }
      ]

      expect(fs.promises.stat).toHaveBeenCalledWith(`/tmp/${filename}`)
      expect(result).toMatchObject(expectedResult)
    })
  })
})
