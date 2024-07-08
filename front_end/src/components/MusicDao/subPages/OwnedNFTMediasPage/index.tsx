import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import styled from 'styled-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebounce } from 'use-debounce/lib';

import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import Box from 'shared/ui-kit/Box';
import { Color } from 'shared/ui-kit';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { SearchIcon, ArrowIcon } from '../../components/Icons/SvgIcons';
import { ownedNFTMediasPageStyles } from './index.styles';
import ArtistSongCard from 'components/MusicDao/components/Cards/ArtistSongCard';
import { musicDaoGetCopyrightNFTs } from 'shared/services/API';
import MediaNFTCard from '../ProfilePage/components/MediaNFTCard';

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default function OwnedNFTMediasPage() {
  const classes = ownedNFTMediasPageStyles();

  const { userId } = useParams<{ userId: string }>();

  const history = useHistory();

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [songs, setMedias] = useState<any[]>([]);
  const [isMediaLoading, setIsMediaLoading] = useState<boolean>(false);
  const [hasMoreMedia, setHasMoreMedia] = useState<boolean>(true);
  const lastMediaId = React.useRef<string | undefined>();

  useEffect(() => {
    lastMediaId.current = undefined;
    setMedias([]);
    setHasMoreMedia(true);
    setTimeout(() => loadMore());
  }, [debouncedSearchValue]);

  const loadMore = async () => {
    if (lastMediaId.current && (!hasMoreMedia || isMediaLoading)) return;
    setIsMediaLoading(true);
    const response = await musicDaoGetCopyrightNFTs(userId);
    if (response.success) {
      setMedias(response.data);
      setHasMoreMedia(false);
    }
    setIsMediaLoading(false);
  };

  return (
    <Box
      className={classes.background}
      position="relative"
      id={'scrollContainer'}
    >
      <Box className={classes.content}>
        <Box
          className={classes.flexBox}
          position="relative"
          justifyContent="space-between"
          width={1}
          zIndex={1}
        >
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            style={{ cursor: 'pointer' }}
            zIndex={1}
            onClick={() => history.goBack()}
          >
            <div>
              <ArrowIcon color={'white'} />
            </div>
            <Box color="white" fontSize={14} fontWeight={700} ml="5px" mb="4px">
              BACK
            </Box>
          </Box>
          <Box className={classes.optionSection} zIndex={1}>
            <div className={classes.filterButtonBox}>
              {showSearchBox && (
                <InputWithLabelAndTooltip
                  type="text"
                  inputValue={searchValue}
                  placeHolder="Search"
                  onInputValueChange={(e) => {
                    setSearchValue(e.target.value);
                  }}
                  style={{
                    background: 'transparent',
                    margin: 0,
                    marginRight: 8,
                    padding: 0,
                    border: 'none',
                    height: 'auto'
                  }}
                  theme="music dao"
                />
              )}
              <Box
                onClick={() => setShowSearchBox((prev) => !prev)}
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ cursor: 'pointer' }}
              >
                <SearchIcon color={Color.MusicDAODark} />
              </Box>
            </div>
          </Box>
          <Hidden smDown>
            <Box
              className={classes.flexBox}
              justifyContent="center"
              position="absolute"
              width={1}
            >
              <Box className={classes.header1}>All NFT Media Fractions</Box>
            </Box>
          </Hidden>
        </Box>
        <Hidden mdUp>
          <Box className={classes.header1} mt={3}>
            All NFT Media Fractions
          </Box>
        </Hidden>
        <Box zIndex={1}>
          {!isMediaLoading && !hasMoreMedia && songs.length === 0 && (
            <Box textAlign="center" mt={2}>
              No NFT Media Fractions
            </Box>
          )}
          <InfiniteScroll
            hasChildren={songs.length > 0}
            dataLength={songs.length}
            scrollableTarget={'scrollContainer'}
            next={loadMore}
            hasMore={hasMoreMedia}
            loader={
              isMediaLoading && (
                <LoadingIndicatorWrapper>
                  <CircularLoadingIndicator />
                </LoadingIndicatorWrapper>
              )
            }
            style={{ overflow: 'inherit' }}
          >
            <Box mt={4}>
              <Grid container spacing={2} wrap="wrap">
                {songs.map((item, index) => (
                  <Grid key={`nfts-${index}`} item xs={12} sm={6} md={4} lg={3}>
                    <MediaNFTCard nft={item} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </InfiniteScroll>
        </Box>
      </Box>
    </Box>
  );
}
