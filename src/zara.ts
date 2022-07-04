#!/usr/bin/env -S node --loader ts-node/esm/transpile-only 

import { am } from 'am';
import { apps } from './internals.js';
import { importApps } from './common/import-apps.js';
import { logger } from './common/logger.js';

const logBanner = () => logger.info('app', '------------------------------------------------');;

const main = async (pattern: string = `${process.cwd()}/apps/**/*.{js,ts}`) => {
    // Clear console
    console.clear();

    logBanner();
    logger.info('app', 'Zara is starting with pattern "%s".', pattern);
    logBanner();

    logBanner();
    logger.info('app', 'Starting apps...');
    logBanner();

    // Load apps
    await importApps(pattern);
    
    logBanner();
    logger.info('app', 'Started %s apps', apps.size);
    logBanner();
};

am(main).catch(error => {
    logBanner();
    logger.error('app', 'Zara crashed');
    logger.error('app', error);
    logBanner();
});
