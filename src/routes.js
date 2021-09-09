import { logger } from "./logger.js";

export default class Routes {
    io
    consructor() {
    }

    setSocketInstance(io) {
        this.io = io
    }

    async defaultRoute(request, response) {
        response.send('Hello World!');
    }

    async options(request, response) {
        response.writeHead(204);
        response.send('Hello World!');
    }

    async post(request, response) {
        logger.info('ae post')
        response.end()
    }

    async get(request, response) {
        logger.info('ae get')
        response.end()
    }

    handler(request, response) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        const chosen = this[request.method.toLowerCase()] || this.defaultRoute

        return chosen.apply(this, [request, response])
    }
}