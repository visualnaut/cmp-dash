import React from 'react';
import { AttentionBadge } from './AttentionBadge';

interface SLABadgeProps {
  minutesElapsed: number;
}

export const SLABadge: React.FC<SLABadgeProps> = (props) => {
  return <AttentionBadge {...props} />;
};
