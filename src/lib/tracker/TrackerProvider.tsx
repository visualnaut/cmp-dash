import React, { createContext, useContext, ReactNode } from 'react';
import { Tracker } from './types';
import { tracker as trackerInstance } from './index';

const TrackerContext = createContext<Tracker>(trackerInstance);

export const TrackerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TrackerContext.Provider value={trackerInstance}>
      {children}
    </TrackerContext.Provider>
  );
};

export function useTracker(): Tracker {
  return useContext(TrackerContext);
}
