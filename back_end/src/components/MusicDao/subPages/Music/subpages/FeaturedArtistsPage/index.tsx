import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'js-cookie';
import SpringCarousel from 'react-spring-3d-carousel';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';

import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import URL from 'shared/functions/getURL';
import { processImage } from 'shared/helpers';
import ArtistCard from '../../components/Cards/ArtistCard';
import { featuredArtistsStyles } from './index.styles';

export default function FeaturedArtistsPage() {
  const classes = featuredArtistsStyles();

  const [artists, setArtists] = useState<any[]>([]);
  const [hasMoreArtist, setHasMoreArtist] = useState<boolean>(true);
  const [loadingArtists, setLoadingArtists] = useState<boolean>(false);
  const [pagination, setPagination] = useState<number>(1);
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [topArtists, setTopArtists] = useState<any[]>([]);

  const width = useWindowDimensions().width;
  const loadingCount = React.useMemo(
    () => (width >= 1280 ? 4 : width >= 960 ? 3 : width >= 600 ? 2 : 1),
    [width]
  );

  useEffect(() => {
    getArtists();
  }, [pagination]);

  const loadMore = () => {
    if (loadingArtists || artists.length === 0) return;
    setPagination((prev) => prev + 1);
  };

  const getArtists = async () => {
    if (loadingArtists) return;
    setLoadingArtists(true);
    const token: string = Cookies.get('accessToken') || '';
    axios
      .get(`${URL()}/musicDao/getPlayerAllArtists/${pagination}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          sortBy: 'Recent'
        }
      })
      .then((response) => {
        if (response.data.success) {
          const newTopArtists = response.data.data.artists.map((v, index) => {
            return { ...v, ImageUrl: processImage(v.ImageUrl), key: index };
          });
          setArtists((prev) => [...prev, ...newTopArtists]);
          setTopArtists(
            newTopArtists && newTopArtists.length > 0
              ? newTopArtists.slice(0, 5)
              : []
          );
          setHasMoreArtist(response.data.data.hasMore);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoadingArtists(false));
  };

  return (
    <div className={classes.root} id={'scrollContainer'}>
      <Box>
        <Box className={classes.sectionTitle}>Top Artists</Box>
        {topArtists && topArtists.length > 0 && (
          <Box
            display={'flex'}
            alignItems="center"
            justifyContent={'space-between'}
            px={10}
            my={5}
          >
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
                setCurrentSlider((prev) => (prev === 0 ? 4 : prev - 1))
              }
            >
              <ArrowIcon />
            </Box>
            <Box className={classes.carouselWrapper}>
              <SpringCarousel
                slides={topArtists.map((item, index) => ({
                  key: `artist_image_${index}`,
                  content: (
                    <img
                      src={item?.ImageUrl ?? getDefaultAvatar()}
                      onClick={() => {}}
                      alt="artist image"
                      style={{
                        cursor: 'pointer',
                        width: '100%',
                        objectFit: 'cover',
                        borderRadius: '50%'
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
            <Box
              style={{
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
        )}
        <Box className={classes.sectionTitle}>All Artirsts</Box>
        <Box zIndex={1}>
          <InfiniteScroll
            hasChildren={artists.length > 0}
            dataLength={artists.length}
            scrollableTarget={'scrollContainer'}
            next={loadMore}
            hasMore={hasMoreArtist}
            loader={
              loadingArtists && (
                <Box px={4} pb={6}>
                  <Grid container spacing={2}>
                    {Array(loadingCount)
                      .fill(0)
                      .map((artist, index) => (
                        <Grid
                          key={`artists-${index}`}
                          item
                          xs={12}
                          sm={6}
                          md={4}
                          lg={3}
                        >
                          <ArtistCard item={artist} isLoading />
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              )
            }
          >
            <Box p={4}>
              {!loadingArtists && !hasMoreArtist && artists.length === 0 && (
                <Box textAlign="center" mt={6}>
                  No Artist
                </Box>
              )}
              <Grid container spacing={2} style={{ margin: 0 }}>
                {artists.map((artist, index) => (
                  <Grid
                    key={`artists-${index}`}
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                  >
                    <ArtistCard item={artist} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </InfiniteScroll>
        </Box>
      </Box>
    </div>
  );
}

const ArrowIcon = () => (
  <svg
    width="13"
    height="25"
    viewBox="0 0 13 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1.25624 0.842511C0.940286 0.857358 0.662654 1.01137 0.421546 1.2697C-0.0273547 1.81972 0.0123367 2.66439 0.509188 3.1348L9.71658 12.4715L1.45522 22.5937C1.00632 23.1437 1.04601 23.9884 1.54287 24.4588C2.04137 24.9643 2.79952 24.9287 3.21693 24.3802L12.2881 13.3029C12.737 12.7529 12.6973 11.9082 12.2005 11.4378L2.12885 1.22474C1.89441 0.953577 1.57207 0.82776 1.25613 0.842606L1.25624 0.842511Z"
      fill="white"
    />
  </svg>
);
