import express from 'express';
import cookieParser from 'cookie-parser';
import { helmetConfig } from './helmetConfig';
import { corsConfig } from './corsConfig';
import { authLimiter } from './rateLimitConfig';
import { logger } from './logger';
import { compressionConfig } from './compressionConfig';

export const registerMiddlewares = (app: express.Application) => {
  app.use(helmetConfig);
  app.use(corsConfig);
  app.use(cookieParser());
  app.use(logger);
  app.use(compressionConfig);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
