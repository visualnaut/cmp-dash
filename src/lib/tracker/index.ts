import { TrackerPlugin, Tracker } from './types';
import { consolePlugin } from './plugins/console-plugin';

export function createTracker(plugins: TrackerPlugin[]): Tracker {
  return {
    track(eventName, properties) {
      plugins.forEach((plugin) => plugin.track(eventName, properties));
    },
    captureError(error) {
      plugins.forEach((plugin) => plugin.captureError(error));
    }
  };
}

export const tracker = createTracker([consolePlugin]);
export * from './types';
