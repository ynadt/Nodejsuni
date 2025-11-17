const os = require('os');

/**
 * Logger utility with quiet and verbose modes.
 *
 * Quiet mode   (--quiet)   → suppress all logs.
 * Verbose mode (--verbose) → print extra system information.
 *
 * Modes are determined either by constructor arguments or CLI flags.
 */
class Logger {
  #isVerboseModeEnabled = false;
  #isQuietModeEnabled = false;

  /**
   * Creates a Logger instance.
   *
   * If both parameters are omitted, logger checks CLI args:
   * - --verbose enables verbose mode
   * - --quiet   enables quiet mode
   *
   * @param {boolean} [verbose] Explicit verbose mode
   * @param {boolean} [quiet]   Explicit quiet mode
   */
  constructor(verbose, quiet) {
    if (typeof verbose === 'undefined' && typeof quiet === 'undefined') {
      const argv = process.argv.slice(2);
      this.#isVerboseModeEnabled = argv.includes('--verbose');
      this.#isQuietModeEnabled = argv.includes('--quiet');
    } else {
      this.#isVerboseModeEnabled = Boolean(verbose);
      this.#isQuietModeEnabled = Boolean(quiet);
    }
  }

  /**
   * Logs data to console depending on the logger mode.
   *
   * - In quiet mode → does nothing.
   * - In normal mode → prints timestamp + message.
   * - In verbose mode → prints message + system information.
   *
   * @param {...any} data Message or data to log
   */
  log(...data) {
    if (this.#isQuietModeEnabled) return;

    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]`, ...data);

    if (this.#isVerboseModeEnabled) {
      try {
        const cpus = os.cpus() || [];

        console.log('--- system info ---');
        console.log({
          timestamp,
          platform: os.platform(),
          release: os.release(),
          arch: os.arch(),
          totalMemory: os.totalmem(),
          freeMemory: os.freemem(),
          cpuModels: cpus.map(c => c.model),
        });
        console.log('--------------------');
      } catch (err) {
        console.log('Could not collect system info:', err?.message || err);
      }
    }
  }
}

module.exports = Logger;
