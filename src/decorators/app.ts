import { Server } from '../server.js';

/**
 * Creates a new Zara application.
 */
export const App = () => <T extends { new(...args: any[]): {} }>(constructor: T) => {
  return class extends constructor {
    server: Server;

    constructor(...args: any[]) {
      super(...args);

      this.server = new Server(constructor.name);
    }
  };
};
