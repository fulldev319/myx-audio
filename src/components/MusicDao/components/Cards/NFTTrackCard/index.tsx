import React from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from 'shared/ui-kit/Avatar';
import { getChainImageUrl } from 'shared/functions/chainFucntions';
import Box from 'shared/ui-kit/Box';
import { processImage } from 'shared/helpers';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
import ButtonMusicPlayer from '../../MusicPlayer/ButtonMusicPlayer';
import { nftTrackCardStyles } from './index.style';

const NFTTrackCard = ({
  data,
  isLoading = false,
  isFullURL = true,
  handleClick,
  selected = false
}: {
  data: any;
  isLoading?: boolean;
  isFullURL?: boolean;
  handleClick?: (id: string) => void;
  selected?: boolean;
}) => {
  const history = useHistory();
  const classes = nftTrackCardStyles();

  const imagePath = React.useMemo(() => {
    return processImage(data?.Image || data?.image);
  }, [data]);

  const avatarPath = React.useMemo(() => {
    return processImage(data?.creator?.imageUrl);
  }, [data]);

  const handleCardClick = () => {
    data?.Id
      ? history.push(`/music/web3-track/${data?.Id}`)
      : history.push(
          `/music/web3-track/${data?.CollectionAddress}-${data?.TokenId}`
        );
  };

  return (
    <Box
      className={classes.container}
      style={selected ? { border: '2px solid #0D59EE' } : {}}
      onClick={() => {
        if (!isLoading) return;
        if (handleClick) handleClick(data?.Id);
        else handleCardClick();
      }}
    >
      <Box className={classes.imageContainer}>
        <Box
          className={classes.image}
          style={{
            backgroundImage: isLoading ? 'none' : `url(${imagePath})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
          }}
        >
          {isLoading ? (
            <SkeletonBox loading width="100%" height="100%" />
          ) : (
            data?.Genre && <Box className={classes.tag}>{data?.Genre}</Box>
          )}
        </Box>
      </Box>
      <Box className={classes.avatarContainer}>
        {isLoading ? (
          <SkeletonBox loading width="32px" height="32px" borderRadius={20} />
        ) : (
          <Box
            onClick={(event) => {
              event.stopPropagation();
              console.log(data);
              history.push(`/marketplace/artists/${data.CreatorAddress}`);
            }}
          >
            <Avatar
              size={32}
              rounded
              image={avatarPath || getDefaultAvatar()}
            />
          </Box>
        )}

        {/* {data?.creator?.avatar && (
          <Box className={classes.avatar}>
            <img
              src={data?.creator?.avatar}
              width="100%"
              height="100%"
              style={{ borderRadius: '100%' }}
              title={data?.creator?.name || ''}
            />
          </Box>
        )} */}
        {/* <Box className={classes.priceContainer}>
          <Box className={classes.priceLable}>Price</Box>
          <Box className={classes.priceValue}>{data?.price || 0} USDT</Box>
        </Box> */}
      </Box>
      <Box className={classes.divider} />
      <Box className={classes.infoContainer}>
        {isLoading ? (
          <SkeletonBox loading className={classes.skel_infoContainer} />
        ) : (
          <>
            <Box
              display={'flex'}
              flexDirection="column"
              mr={1}
              style={{
                flex: 1,
                overflow: 'hidden',
                minHeight: 48
              }}
            >
              <Box
                className={classes.tracNftName}
                title={data?.name ?? data?.Name}
              >
                {data?.name ?? data?.Name}
              </Box>
              <Box
                className={classes.collectionName}
                title={data?.collection?.name}
              >
                {data?.collection?.name}
              </Box>
            </Box>
            <Box>
              <ButtonMusicPlayer
                isPlayerMeida={true}
                media={data}
                songId={data.id ?? data.Id ?? data.songId ?? data.draftId}
              />
            </Box>
          </>
        )}
      </Box>
      <Box className={classes.chainContainer}>
        {isLoading ? (
          <SkeletonBox loading className={classes.skel_chain} />
        ) : (
          getChainImageUrl(data?.collection?.chain) && (
            <img
              className={classes.chain}
              src={getChainImageUrl(data?.collection?.chain)}
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default NFTTrackCard;
