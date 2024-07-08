import React from 'react';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';

import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import { processImage } from 'shared/helpers';

import { albumCardStyles } from './index.styles';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';

export default function AlbumCard({
  item,
  isLoading = false
}: {
  item: any;
  isLoading?: boolean;
}) {
  const classes = albumCardStyles();
  const history = useHistory();

  return (
    <div
      className={classes.card}
      onClick={() => {
        if (!isLoading) {
          history.push(`/player/albums/${item.id}`);
        }
      }}
    >
      <Box width={1} mx={2} mt={2} display="flex" justifyContent="center">
        <SkeletonBox
          className={classes.album}
          loading={isLoading}
          image={
            item.Image && item.Image !== ''
              ? processImage(item.Image)
              : getDefaultBGImage()
          }
          height={1}
          style={{
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
            borderRadius: 8,
            width: `calc(100% - 32px)`
          }}
        />
      </Box>
      {/* <div
        className={classes.album}
        style={{
          backgroundImage: item.album_image && item.album_image !== "" ? `url(${item.album_image})` : "none",
        }}
      /> */}
      <div className={classes.title}>{item.Name ?? 'Title'}</div>
      <div className={classes.description}>
        {item.Description ?? 'Description and creator name'}
      </div>
    </div>
  );
}
