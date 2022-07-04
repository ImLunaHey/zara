import type { Express } from 'express';

export const ports = new Map<string, number>();
export const routes = new Map<string, `/${string}`[]>();
export const apps = new Map<string, Express>();
