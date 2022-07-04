import { format } from 'util';
import { bgGreen, bgMagenta, bgRed, bgWhite, bgYellow } from 'yoctocolors';

type Scope = 'app';

export const logger = {
    debug(scope: Scope, message: string, ...optionalArgs: unknown[]) {
        format(message, ...optionalArgs).split('\n').forEach(line => console.debug(`[${bgGreen('DEBUG')}][${bgMagenta(scope)}] ${line}`));
    },
    info(scope: Scope, message: string, ...optionalArgs: unknown[]) {
        format(message, ...optionalArgs).split('\n').forEach(line => console.info(`[${bgWhite('INFO')}][${bgMagenta(scope)}] ${line}`));
    },
    warning(scope: Scope, message: string, ...optionalArgs: unknown[]) {
        format(message, ...optionalArgs).split('\n').forEach(line => console.warn(`[${bgYellow('WARN')}][${bgMagenta(scope)}] ${line}`));
    },
    error(scope: Scope, message: string | Error, ...optionalArgs: unknown[]) {
        format(message, ...optionalArgs).split('\n').forEach(line => console.info(`[${bgRed('ERROR')}][${bgMagenta(scope)}] ${line}`));
    }
};
