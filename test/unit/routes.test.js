import { describe, test, expect } from '@jest/globals'
import Routes from './../../src/routes.js'

describe('#Routes test suite', () => {

    describe('#setSocketInstance', () => {
        test('setSocket should store io instance', () => {
            const routes = new Routes()
            const ioObj = {
                to: (id) => ioObj,
                emit: (event, message) => {}
            }

            routes.setSocketInstance(ioObj)
            expect(routes.io).toStrictEqual(ioObj)
        })
    })

    describe('#handler', () => {
        test.todo('given an inexistent route it should choose default route')
        test.todo('it should set any request with CORS enabled')
        test.todo('given method OPTIONS it should choose options route')
        test.todo('given method POST it should choose options route')
        test.todo('given method GET it should choose options route')
    })
})