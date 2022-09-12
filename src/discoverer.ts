import peeper from '@savid/libp2p-peeper';
import logger from '@savid/logger';

import {
  BOOT_NODES,
  MAX_CONNECTIONS,
  MIN_CONNECTIONS,
  REMOTE_SEND_ENDPOINT,
  SHARED_SECRET,
  REMOTE_SEND_INTERVAL,
} from '#app/constants';
import Metrics from '#app/metrics';

export default class Discoverer {
  static bootnodes: Parameters<typeof peeper>[0]['bootnodes'] = [];

  static discoveredENRs: string[] = [];

  static sendInterval: NodeJS.Timeout | undefined;

  static abortController: AbortController | undefined;

  static started = true;

  static init() {
    if (!BOOT_NODES) throw new Error('no valid bootnodes');
    this.bootnodes = BOOT_NODES.split(',');
    this.sender();
    this.discover();
  }

  static async discover() {
    try {
      // eslint-disable-next-line no-restricted-syntax
      for await (const { error, enr } of peeper({
        bootnodes: this.bootnodes,
        maxConnections: MAX_CONNECTIONS,
        minConnections: MIN_CONNECTIONS,
      })) {
        // check if this loop should stop
        if (!this.started) break;
        if (error) throw error;
        if (enr) {
          this.discoveredENRs.push(enr);
          Metrics.discoveredENRs.inc();
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        logger.error('discover error', {
          error: error.toString(),
          stack: error.stack,
        });
      }
    }
  }

  static async sender() {
    if (this.sendInterval) clearInterval(this.sendInterval);
    this.sendInterval = setInterval(() => this.send(), REMOTE_SEND_INTERVAL);
  }

  static async send() {
    const enrs = this.discoveredENRs.splice(0);
    if (enrs.length) {
      try {
        this.abortController = new AbortController();
        await fetch(REMOTE_SEND_ENDPOINT, {
          method: 'post',
          body: JSON.stringify(enrs),
          headers: {
            'Content-Type': 'application/json',
            ...(SHARED_SECRET && { Authorization: `Basic ${SHARED_SECRET}` }),
          },
          signal: this.abortController?.signal,
        });
        Metrics.remoteSends.inc();
        Metrics.remoteSendENRs.inc(enrs.length);
      } catch (error) {
        if (error instanceof Error) {
          logger.error('send error', {
            error: error.toString(),
            stack: error.stack,
            enrsCount: enrs.length,
          });
        }
        Metrics.remoteSendsFailed.inc();
      }
    }
  }

  static async shutdown() {
    this.started = false;
    this.abortController?.abort();
    if (this.sendInterval) clearInterval(this.sendInterval);
  }
}
