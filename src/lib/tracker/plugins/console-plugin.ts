import { TrackerPlugin } from '../types';

export const consolePlugin: TrackerPlugin = {
  name: 'console',
  track(eventName, properties) {
    console.log(
      `%c[Tracker] ${eventName}`,
      'color: #6366f1; font-weight: bold;',
      properties
    );
  },
  captureError(error) {
    console.error('%c[Tracker] Error Captured:', 'color: #ef4444; font-weight: bold;', error);
  }
};
