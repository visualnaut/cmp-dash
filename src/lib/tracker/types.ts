export interface TrackerPlugin {
  name: string;
  track(eventName: string, properties: Record<string, unknown>): void;
}

export interface Tracker {
  track(eventName: string, properties: Record<string, unknown>): void;
}
