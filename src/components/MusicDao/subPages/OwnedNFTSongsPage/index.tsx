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
import { ownedNFTSongsPageStyles } from './index.styles';
import ArtistSongCard from 'components/MusicDao/components/Cards/ArtistSongCard';
import { musicDaoGetOwnedSongNFts } from 'shared/services/API';

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default function OwnedNFTSongsPage() {
  const classes = ownedNFTSongsPageStyles();

  const { userId } = useParams<{ userId: string }>();

  const history = useHistory();

  const [searchValue, setSearchValue] = React.useState<string>('');
  const [debouncedSearchValue] = useDebounce(searchValue, 500);
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [songs, setSongs] = useState<any[]>([]);
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);
  const [hasMoreSong, setHasMoreSong] = useState<boolean>(true);
  const lastSongId = React.useRef<string | undefined>();

  useEffect(() => {
    lastSongId.current = undefined;
    setSongs([]);
    setHasMoreSong(true);
    setTimeout(() => loadMore());
  }, [debouncedSearchValue]);

  const loadMore = async () => {
    if (lastSongId.current && (!hasMoreSong || isSongLoading)) return;
    setIsSongLoading(true);
    const response = await musicDaoGetOwnedSongNFts(userId, lastSongId.current);
    if (response.success) {
      const newSongs = response.data.nfts || [];
      if (lastSongId.current === undefined) {
        setSongs(newSongs);
      } else {
        setSongs([...songs, ...newSongs]);
      }
      setHasMoreSong(response.data.hasMore);
      lastSongId.current = newSongs.length
        ? newSongs[newSongs.length - 1].Id
        : '';
    }
    setIsSongLoading(false);
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
              <Box className={classes.header1}>All NFT of Tracks Owned</Box>
            </Box>
          </Hidden>
        </Box>
        <Hidden mdUp>
          <Box className={classes.header1} mt={3}>
            All NFT of Tracks Owned
          </Box>
        </Hidden>
        <Box zIndex={1}>
          {!isSongLoading && !hasMoreSong && songs.length === 0 && (
            <Box textAlign="center" mt={2}>
              No NFT of Tracks Owned
            </Box>
          )}
          <InfiniteScroll
            hasChildren={songs.length > 0}
            dataLength={songs.length}
            scrollableTarget={'scrollContainer'}
            next={loadMore}
            hasMore={hasMoreSong}
            loader={
              isSongLoading && (
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
                  <Grid
                    key={`songs-${index}`}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <ArtistSongCard song={item} isShowEditionControl={true} />
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
