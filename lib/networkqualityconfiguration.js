'use strict';

const EventEmitter = require('events').EventEmitter;
const { DEFAULT_NQ_LEVEL_LOCAL, DEFAULT_NQ_LEVEL_REMOTE } = require('./util/constants');
const inRange = require('./util/index').inRange;

/**
 * {@link NetworkQualityConfigurationImpl} represents an object which notifies its
 * listeners of any changes in the values of its properties.
 * @extends EventEmitter
 * @implements NetworkQualityConfiguration
 * @property {?NetworkQualityVerbosity} local - Verbosity level for {@link LocalParticipant}
 * @property {?NetworkQualityVerbosity} remote - Verbosity level for {@link RemoteParticipant}s
 */
class NetworkQualityConfigurationImpl extends EventEmitter {
  /**
   * Construct an {@link NetworkQualityConfigurationImpl}.
   * @param {NetworkQualityConfiguration} networkQualityConfiguration - Initial {@link NetworkQualityConfiguration}
   */
  constructor(networkQualityConfiguration) {
    super();
    networkQualityConfiguration = Object.assign({ local: 1, remote: 0 }, networkQualityConfiguration);
    Object.defineProperties(this, {
      local: {
        value: networkQualityConfiguration.local,
        writable: true
      },
      remote: {
        value: networkQualityConfiguration.remote,
        writable: true
      }
    });
  }

  /**
   * Update the verbosity levels for network quality information for
   * {@link LocalParticipant} and {@link RemoteParticipant} with those
   * in the given {@link NetworkQualityConfiguration}.
   * @param {NetworkQualityConfiguration} networkQualityConfiguration - The new {@link NetworkQualityConfiguration}
   * @fires NetworkQualityConfigurationImpl#changed
   */
  update(networkQualityConfiguration) {
    networkQualityConfiguration = Object.assign({
      local: DEFAULT_NQ_LEVEL_LOCAL,
      remote: DEFAULT_NQ_LEVEL_REMOTE
    }, networkQualityConfiguration);

    [
      ['local', 1, 3, DEFAULT_NQ_LEVEL_LOCAL],
      ['remote', 0, 3, DEFAULT_NQ_LEVEL_REMOTE]
    ].forEach(([localOrRemote, min, max, defaultLevel]) => {
      this[localOrRemote] = typeof networkQualityConfiguration[localOrRemote] === 'number'
        && inRange(networkQualityConfiguration[localOrRemote], min, max)
        ? networkQualityConfiguration[localOrRemote]
        : defaultLevel;
    });
  }
}

module.exports = NetworkQualityConfigurationImpl;