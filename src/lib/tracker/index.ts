import { TrackerPlugin, Tracker } from './types';
import { consolePlugin } from './plugins/console-plugin';

export function createTracker(plugins: TrackerPlugin[]): Tracker {
  return {
    track(eventName, properties) {
      plugins.forEach((plugin) => plugin.track(eventName, properties));
    },
  };
}

export const tracker = createTracker([consolePlugin]);
export * from './types';
