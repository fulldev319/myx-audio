import CircularProgress from '@material-ui/core/CircularProgress';
import React from 'react';
import { Color } from '../../constants/const';

export const CircularLoadingIndicator = ({
  theme
}: {
  theme?: 'dark' | 'light' | 'green' | 'light dark' | 'blue';
}) => (
  <CircularProgress
    style={{
      color:
        theme && theme === 'dark'
          ? '#7EDA5E'
          : theme && theme === 'light dark'
          ? '#FF5954'
          : theme && theme === 'green'
          ? '#B1FF00'
          : theme && theme === 'blue'
          ? '#431AB7'
          : Color.Mint
    }}
  />
);
