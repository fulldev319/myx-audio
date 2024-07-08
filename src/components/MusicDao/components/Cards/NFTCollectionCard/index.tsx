import React from 'react';
import { useHistory } from 'react-router-dom';

import Box from 'shared/ui-kit/Box';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';

import { useCardStyles } from './index.styles';

export default function NFTCollectionCard({ collection, isLoading = false }) {
  const classes = useCardStyles();
  const history = useHistory();

  return (
    <Box
      className={classes.collectionCardRoot}
      onClick={() =>
        !isLoading && history.push(`/collections/${collection.id}`)
      }
    >
      <Box className={classes.image}>
        {isLoading ? (
          <SkeletonBox loading width="100%" height="100%" />
        ) : (
          <img
            src={processImage(collection?.image) ?? getDefaultBGImage()}
            alt="nft collection image"
          />
        )}
      </Box>
      <Box className={classes.typo1}>
        {isLoading ? (
          <SkeletonBox loading width="100%" height="20px" />
        ) : (
          collection?.name
        )}
      </Box>
      <Box className={classes.typo2} fontSize={14}>
        {isLoading ? (
          <SkeletonBox loading width="100%" height="50px" />
        ) : (
          collection?.description
        )}
      </Box>
    </Box>
  );
}
