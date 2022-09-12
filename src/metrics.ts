import { collectDefaultMetrics, Counter, register } from 'prom-client';

class Metrics {
  static collectDefaultMetrics = collectDefaultMetrics;

  static discoveredENRs = new Counter({
    name: 'enr_discoverer_discovered_enrs_total',
    help: 'The total number of discovered enrs',
  });

  static remoteSends = new Counter({
    name: 'enr_discoverer_remote_send_total',
    help: 'The total number of sent requests to remote',
  });

  static remoteSendsFailed = new Counter({
    name: 'enr_discoverer_remote_send_failed_total',
    help: 'The total number of failed sent requests to remote',
  });

  static remoteSendENRs = new Counter({
    name: 'enr_discoverer_remote_send_enrs_total',
    help: 'The total number of enrs sent to remote',
  });

  static async metrics() {
    return register.metrics();
  }

  static nowMicro() {
    const [secs, nano] = process.hrtime();
    return Math.floor(secs * 1000000 + nano / 1000);
  }
}

Metrics.collectDefaultMetrics({ register });

export default Metrics;
