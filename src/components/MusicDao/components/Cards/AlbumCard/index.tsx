import React from 'react';
import { useHistory } from 'react-router-dom';

import { processImage } from 'shared/helpers';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import Box from 'shared/ui-kit/Box';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';

import { albumCardStyles } from './index.styles';

const defaultImage = getDefaultBGImage();

export default function AlbumCard({ item, isLoading = false }) {
  const classes = albumCardStyles();
  const historyUse = useHistory();

  const year = React.useMemo(
    () => new Date(item.createdAt).getFullYear(),
    [item.createdAt]
  );

  return (
    <Box
      className={classes.card}
      onClick={() => {
        if (!isLoading) historyUse.push(`/music/collection/${item.id}`);
      }}
    >
      <SkeletonBox
        className={classes.collection}
        loading={isLoading}
        image={processImage(item?.image) ?? defaultImage}
        width={1}
        height={1}
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden'
        }}
      />
      <Box className={classes.infoSection}>
        {isLoading ? (
          <SkeletonBox loading width="70%" height="30px" mb={1} />
        ) : (
          <Box className={classes.title} mb={0.5}>
            {item.name ?? 'Title'}
          </Box>
        )}
        {isLoading ? (
          <SkeletonBox loading width="100%" height="30px" mb={0.5} />
        ) : (
          <Box className={classes.description}>
            {year} • {`${item.songCount} Tracks`}
          </Box>
        )}
      </Box>
    </Box>
  );
}
