import type { Request, Response } from 'express';
import createApp from 'express';
import { HttpError } from '../common/http-error.js';
import { apps, routes } from '../internals.js';

enum Methods {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete',
    PATCH = 'patch'
};

type Path = `/${string}`;

/**
 * Creates a new Zara web route.
 */
export const Route = ({ method, path, paths }: { method?: keyof typeof Methods, path?: Path, paths?: Path[]} = {}): MethodDecorator => {
    return (
        target: Object,
        _propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) => {
        const id = target.constructor.name;
        if (!apps.has(id)) apps.set(id, createApp());

        const app = apps.get(id)!;
        
        app.get('/test', (_, __) => __.send('test'));

        [path, ...(paths ?? [])].filter(Boolean).forEach(path => {
            // Save route path for management app
            if (!routes.has(id)) routes.set(id, []);
            routes.get(id)?.push(path!);

            // Add route to the express app
            app[Methods[method ?? 'GET']](path ?? '/', async (request: Request, response: Response) => {
                try {
                    const method = await descriptor.value({
                        url: request.url,
                        method: request.method,
                        query: request.query,
                        params: request.params,
                        body: request.body,
                        headers: request.headers
                    });
                    response.status(200).send(method);
                } catch (error: unknown) {
                    if (!(error instanceof Error)) throw new Error('Unknown Error ' + error);

                    const jsonResponse = {
                        message: 'Unexpected error occurred',
                        error: error.message,
                        stack: error.stack
                    };

                    if (error instanceof HttpError) {
                        response.status(error.code as number).json(jsonResponse);
                        return;
                    }

                    response.status(500).json(jsonResponse);
                }
            });
        })
    }
};
