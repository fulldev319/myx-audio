import React, { lazy, useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce/lib';
import InfiniteScroll from 'react-infinite-scroll-component';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import Box from 'shared/ui-kit/Box';
// import { PrimaryButton, SecondaryButton } from 'shared/ui-kit';
// import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
// import {
//   SearchIcon,
//   UnionIcon,
//   DetailIcon
// } from '../../../../components/Icons/SvgIcons';
import { usePageStyles } from './index.styles';
import { getWeb3TracksOfPlatform } from 'shared/services/API';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { useParams } from 'react-router-dom';

// const CustomSelect = lazy(
//   () => import('components/MusicDao/components/CustomSelect')
// );

const NFTTrackCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTTrackCard')
);

const ArtistSongCard = lazy(
  () => import('components/MusicDao/components/Cards/ArtistSongCard')
);

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 4
};

// const FilterSongTypeOptions = ['for sale'];

export default function SongsSubPage() {
  const classes = usePageStyles();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { platformId }: { platformId: string } = useParams();

  const [songs, setSongs] = useState<any[]>([]);
  const [songLastId, setSongLastId] = useState<string>('');
  const [songHasMore, setSongHasMore] = useState<boolean>(true);
  const [songType, setSongType] = useState<string>('for sale');
  const [isSongLoading, setIsSongLoading] = useState<boolean>(false);

  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () =>
      width > 1440
        ? 4
        : width > 1200
        ? 3
        : width > 700
        ? 2
        : width > 400
        ? 2
        : 2,
    [width]
  );

  useEffect(() => {
    if (platformId) {
      loadSongs(true);
    }
  }, [platformId]);

  const onChangeFilter = (val) => {
    setSongType(val);
  };

  const loadSongs = async (init = false) => {
    if (isSongLoading) return;

    if (init) {
      setSongs([]);
      setSongLastId('');
      setSongHasMore(true);
    }

    if (!songHasMore) {
      return;
    }

    try {
      setIsSongLoading(true);
      const res = await getWeb3TracksOfPlatform({
        platformId: platformId,
        lastId: songLastId
      });
      if (res.success) {
        const newSongs = res.data.list;
        setSongs((prev) => (init ? newSongs : [...prev, ...newSongs]));
        setSongLastId(res.data.lastId);
        setSongHasMore(res.data.hasMore);
      } else {
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSongLoading(false);
    }
  };

  return (
    <Box className={classes.root}>
      {/* <Box
        display={'flex'}
        alignItems="center"
        justifyContent={'space-between'}
      >
        <CustomSelect
          label={''}
          containerStyle={classes.filterTag}
          items={FilterSongTypeOptions}
          onSelect={onChangeFilter}
          value={songType}
          theme="dark"
        />
        <Box className={classes.optionSection}>
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
              <SearchIcon color={'#2D3047'} />
            </Box>
          </div>
          {!isMobile && (
            <Box
              className={classes.controlBox}
              ml={2}
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <SecondaryButton
                className={`${classes.showButton} ${
                  isListView ? classes.showButtonSelected : ''
                }`}
                size="small"
                onClick={() => setIsListView(true)}
                isRounded
              >
                <UnionIcon />
              </SecondaryButton>

              <PrimaryButton
                className={`${classes.showButton} ${
                  !isListView ? classes.showButtonSelected : ''
                }`}
                size="small"
                onClick={() => setIsListView(false)}
                isRounded
                style={{ marginLeft: 0 }}
              >
                <DetailIcon />
              </PrimaryButton>
            </Box>
          )}
        </Box>
      </Box> */}
      <Box className={classes.mainContainer}>
        <InfiniteScroll
          hasChildren={songs.length > 0}
          dataLength={songs.length}
          scrollableTarget={'scrollContainer'}
          next={loadSongs}
          hasMore={songHasMore}
          loader={
            isSongLoading && (
              <MasonryGrid
                gutter={isMobile ? '8px' : '16px'}
                data={Array(loadingCount).fill(0)}
                renderItem={(item, _) =>
                  platformId === 'myx' ? (
                    <ArtistSongCard
                      song={item}
                      isLoading={Object.entries(item).length === 0}
                      platform={true}
                    />
                  ) : (
                    <NFTTrackCard
                      data={item}
                      isLoading={Object.entries(item).length === 0}
                      isFullURL={false}
                    />
                  )
                }
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            )
          }
        >
          <Box style={{ marginBottom: isMobile ? '8px' : '16px' }}>
            {!isSongLoading && songs.length === 0 && (
              <Box textAlign="center" mt={6}>
                No Songs
              </Box>
            )}
            <MasonryGrid
              gutter={isMobile ? '8px' : '16px'}
              data={songs}
              renderItem={(item, _) =>
                platformId === 'myx' ? (
                  <ArtistSongCard
                    song={item}
                    isLoading={Object.entries(item).length === 0}
                    platform={true}
                  />
                ) : (
                  <NFTTrackCard
                    data={item}
                    isLoading={Object.entries(item).length === 0}
                    isFullURL={false}
                  />
                )
              }
              columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
            />
          </Box>
        </InfiniteScroll>
      </Box>
    </Box>
  );
}
