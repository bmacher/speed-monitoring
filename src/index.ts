import sh from 'shelljs';
import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { SpeedTestResult } from './interfaces';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DUMMY_DATA: SpeedTestResult = require('./dummy-data.json');

// #region Init
const resolve = (file: string) => path.resolve(__dirname, file);
const { info, error } = console;
const NEW_LINE = '\n';

// param --interval=<seconds>
const [intervalParam] = process.argv
  .slice(2)
  .filter((param) => /^--interval=\d+$/.test(param))
  .map((param) => param.replace('--interval=', ''));

const checkPresentsSpeedtestCli = sh.which('speedtest-cli');

if (!checkPresentsSpeedtestCli || checkPresentsSpeedtestCli.stderr !== null) {
  throw new Error('speedtest-cli needs to be installed properly');
  sh.exit(1);
}
// #endregion

// #region Utilities
function writeJsonResult(body: SpeedTestResult): void {
  const jsonLogFilePath = resolve('logs/speedtest.json');

  info('Reading current JSON logs');
  const jsonLogs: SpeedTestResult[] = JSON.parse(
    readFileSync(jsonLogFilePath).toString(),
  );

  info('Writing new JSON logs');
  writeFileSync(jsonLogFilePath, JSON.stringify([...jsonLogs, body]));
}

function writeJsonResultAsCsv(body: SpeedTestResult): void {
  const csvLogFilePath = resolve('logs/speedtest.csv');

  info('Reading current CSV logs');
  const csvLogs = readFileSync(csvLogFilePath).toString();

  // Header: timestamp;isp;ping;download;bytes_received;upload;bytes_sent;location;country;
  const entry = `${
    body.timestamp};${
    body.client.isp};${
    body.download};${
    body.bytes_received};${
    body.upload};${
    body.bytes_sent};${
    body.server.name};${
    body.server.country
  };${NEW_LINE}`;

  info('Writing new CSV logs');
  writeFileSync(csvLogFilePath, csvLogs + entry);
}

function speedTestRun(): void {
  info('Starting speedtest');
  // const speedTestResult = sh.exec('whoami');
  const speedTestResult = sh.exec('speedtest-cli --secure --json');

  info('Processing speedtest result');
  if (speedTestResult.code === 0 && speedTestResult.stdout !== '' && speedTestResult.stderr === '') {
    const result: SpeedTestResult = JSON.parse(speedTestResult.stdout);

    try {
      writeJsonResult(result);
      writeJsonResultAsCsv(result);
    } catch (err) {
      error(err);
    }
  } else {
    error('speedtest failed: %s', speedTestResult.stderr);
  }

  info('==============================');
}
// #region

// #region Main
function main(interval: number): void {
  speedTestRun();

  setInterval(speedTestRun, interval * 1000);
}

main(Number(intervalParam ?? 60 * 5));
// #region
