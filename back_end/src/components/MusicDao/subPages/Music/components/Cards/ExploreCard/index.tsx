import React from 'react';
import { useHistory } from 'react-router-dom';

import { exploreMock } from '../../../mockData';
import { processImage } from 'shared/helpers';

import { exploreCardStyles } from './index.styles';

export default function ExploreCard({ item }) {
  const classes = exploreCardStyles();
  const historyUse = useHistory();

  let imageUrl;
  if (item.imageUrl) {
    imageUrl = item.imageUrl;
  } else {
    const len = exploreMock.length;
    const index = Math.floor(Math.random() * len);
    imageUrl = exploreMock[index].ImageUrl;
  }
  return (
    <div
      className={classes.card}
      onClick={() => {
        historyUse.push(`/player/playlist/${item.id}`);
      }}
      style={{
        backgroundImage: imageUrl ? `url(${processImage(imageUrl)})` : 'none'
      }}
    >
      <div className={classes.filter}>
        <div className={classes.name}>{item.title}</div>
      </div>
    </div>
  );
}
