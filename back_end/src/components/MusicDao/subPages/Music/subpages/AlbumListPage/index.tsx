import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import SpringCarousel from 'react-spring-3d-carousel';

import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { musicDaoGetPlayerAlbums } from 'shared/services/API';
import Box from 'shared/ui-kit/Box';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
// import { processImage } from 'shared/helpers';
import CollectionCard from '../../components/Cards/CollectionCard';
import { usePageStyles } from './index.styles';

export const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  400: 1,
  800: 2,
  1440: 3
};

enum OpenType {
  Home = 'HOME',
  Playlist = 'PLAYLIST',
  MyPlaylist = 'MYPLAYLIST',
  Album = 'ALBUM',
  Artist = 'ARTIST',
  Liked = 'LIKED',
  Library = 'LIBRARY',
  Search = 'SEARCH',
  Queue = 'QUEUE'
}

const Static_Data = [
  {
    image: require('assets/backgrounds/profile/profile_bg_001.webp'),
    name: 'Collection Name1'
  },
  {
    image: require('assets/backgrounds/profile/profile_bg_002.webp'),
    name: 'Collection Name2'
  },
  {
    image: require('assets/backgrounds/profile/profile_bg_003.webp'),
    name: 'Collection Name3'
  }
];

export default function AlbumListPage() {
  const classes = usePageStyles();

  const [albums, setAlbums] = useState<any[]>([]);
  const [lastStamp, setLastStamp] = useState<any>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [topAlbums, setTopAlbums] = useState<any[]>(Static_Data);

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const resp = await musicDaoGetPlayerAlbums(lastStamp, undefined);
      setLoading(false);
      if (resp.success) {
        let newAlbums: any[] = [];
        for (let i = 0; i < resp.data.albums.length; i++) {
          newAlbums.push({
            Type: OpenType.Album,
            ...resp.data.albums[i]
          });
        }
        setAlbums((prev) => [...prev, ...newAlbums]);
        setHasMore(resp.data.hasMore ?? false);
        if (newAlbums.length > 0) setLastStamp(resp.data.lastOffsetEnd);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div className={classes.page} id={'scrollContainer'}>
      <div className={classes.content}>
        <Box
          display={'flex'}
          alignItems="center"
          justifyContent={'space-between'}
        >
          <Box className={classes.title}>Top Collections</Box>
          <Box display={'flex'} alignItems="center">
            <Box
              style={{
                cursor: 'pointer',
                background:
                  'linear-gradient(147.68deg, #4D08BC 21.73%, #2A9FE2 74.27%)',
                borderRadius: '100px',
                padding: '22px 29px'
              }}
              mr={4}
              onClick={() =>
                setCurrentSlider((prev) => (prev === 0 ? 4 : prev - 1))
              }
            >
              <ArrowIcon />
            </Box>
            <Box
              style={{
                transform: 'scaleX(-1)',
                cursor: 'pointer',
                background:
                  'linear-gradient(147.68deg, #4D08BC 21.73%, #2A9FE2 74.27%)',
                borderRadius: '100px',
                padding: '22px 29px'
              }}
              onClick={() =>
                setCurrentSlider((prev) => (prev === 4 ? 0 : prev + 1))
              }
            >
              <ArrowIcon />
            </Box>
          </Box>
        </Box>
        <Box className={classes.carouselWrapper}>
          <SpringCarousel
            slides={topAlbums.map((item, index) => ({
              key: `collection_image_${index}`,
              content: (
                <img
                  src={item?.image ?? getDefaultBGImage()}
                  onClick={() => {}}
                  alt="platform image"
                  className={classes.collectionImg}
                  style={{
                    objectFit: 'cover',
                    cursor: 'pointer'
                  }}
                  width="250px"
                />
              )
            }))}
            goToSlide={currentSlider + 1}
            showNavigation={false}
            offsetRadius={2}
          />
        </Box>
        <Box className={classes.title} mt={15} mb={7}>
          All Collections
        </Box>
        <div>
          <InfiniteScroll
            style={{ overflow: 'unset' }}
            hasChildren={albums.length > 0}
            dataLength={albums.length}
            scrollableTarget={'scrollContainer'}
            next={loadMore}
            hasMore={hasMore}
            loader={
              loading && (
                <MasonryGrid
                  gutter={'30px'}
                  data={Array(6).fill(0)}
                  renderItem={(item, index) => (
                    <CollectionCard
                      item={item}
                      key={`item-${index}`}
                      isLoading={loading}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                />
              )
            }
          >
            <div style={{ marginBottom: 20 }}>
              <MasonryGrid
                gutter={'30px'}
                data={albums}
                renderItem={(item, index) => (
                  <CollectionCard item={item} key={`item-${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
              />
              {!loading && !hasMore && albums.length === 0 && (
                <div className={classes.empty}>No Albums Yet</div>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}

const ArrowIcon = () => (
  <svg
    width="12"
    height="24"
    viewBox="0 0 12 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.7905 24C11.1068 24 11.3914 23.8592 11.6443 23.6125C12.1186 23.0841 12.1186 22.2385 11.6443 21.7453L2.88534 11.9867L11.6127 2.26342C12.0869 1.73508 12.0869 0.889468 11.6127 0.396256C11.1385 -0.132085 10.3795 -0.132085 9.9368 0.396256L0.355668 11.0356C-0.118556 11.5639 -0.118556 12.4095 0.355668 12.9027L9.9368 23.5772C10.1583 23.8591 10.4743 23.9999 10.7906 23.9999L10.7905 24Z"
      fill="white"
    />
  </svg>
);
