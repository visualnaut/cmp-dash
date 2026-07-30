export interface TrackerPlugin {
  name: string;
  track(eventName: string, properties: Record<string, unknown>): void;
  captureError(error: Error): void;
}

export interface Tracker {
  track(eventName: string, properties: Record<string, unknown>): void;
  captureError(error: Error): void;
}
