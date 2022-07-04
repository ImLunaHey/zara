import glob from 'glob';
import { sep as separator } from 'path';

export const resolve = (...paths: string[]): string[] => {
  const imports: string[] = [];

  paths.forEach(ps => {
    const files = glob.sync(ps.split(separator).join('/'));

    files.forEach(file => {
      if (!imports.includes(file)) {
        imports.push(`file://${file}`);
      }
    });
  });

  return imports;
}

export const importApps = async (...paths: string[]): Promise<void> => {
  const files = resolve(...paths);
  await Promise.all(files.map(async file => {
    const Class = await import(file).then(pkg => Object.values(Object.values(pkg)[0] as {})[0]) as { new(...args: any[]): {} };
    const c = new Class() as any;
    await c.server.start();
  }));
};
