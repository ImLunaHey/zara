import http from 'http';
import getPort from 'get-port';
import createApp, { json as parseJson, Express, urlencoded as parseUrlEncoded } from 'express';
import { randomUUID } from 'crypto';
import { ports } from './internals.js';
import { routes, apps } from './internals.js';
import { logger } from './common/logger.js';

export class Server {
    get app(): Express {
        if (!apps.has(this.name)) apps.set(this.name, createApp());
        return apps.get(this.name)!;
    }

    private _server!: http.Server;

    get server(): http.Server {
        return this._server;
    }

    constructor(private readonly name: string = randomUUID()) {
        this.configureMiddleware();
    }

    public configureMiddleware() {
        // Required for POST requests
        this.app.use(parseJson());
        this.app.use(parseUrlEncoded({ extended: true }));
    }

    public async start() {
        if (this._server) return;
        try {
            const port = await getPort({
                // Try and use a known port before defaulting to a random one
                port: [30100, 30200, 30300, 30400, 30500, 30600, 30700, 30800, 30900]
            });
            ports.set(this.name, port);
            return new Promise<void>(resolve => {
                this._server = this.app.listen(port, () => {
                    logger.info('app', this.name);
                    routes.get(this.name)?.forEach(route => {
                        logger.info('app', `   http://localhost:${port}${route}`);
                    });
                    resolve();
                });
            })
        } catch (error: unknown) {
            if (!(error instanceof Error)) throw new Error('Unknown Error ' + error);
            logger.error('app', 'App crashed with "%s"', error.message);
        }
    }
}
