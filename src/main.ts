#!/usr/bin/env node
import { ServerFactory } from './factory.js';

async function main(): Promise<void> {
  try {
    const server = ServerFactory.createServer();
    await server.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

main().catch(console.error);