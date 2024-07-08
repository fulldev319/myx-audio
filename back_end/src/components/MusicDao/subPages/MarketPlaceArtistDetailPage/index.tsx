import React, { Suspense, lazy, useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

import Box from 'shared/ui-kit/Box';
import Loading from 'shared/ui-kit/Loading';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';
import { usePageStyles } from './index.styles';

import { ArrowIcon } from 'shared/ui-kit/Icons/SvgIcons';
import { getWeb3SongsOfArtist, getWeb3Artist } from 'shared/services/API';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';

const NFTTrackCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTTrackCard')
);

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 4
};

export default function MarketPlaceArtistDetailPage() {
  const classes = usePageStyles();
  const history = useHistory();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const { artistId }: { artistId: string } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [artist, setArtist] = useState<any>({});

  const [songs, setSongs] = useState<any[]>([]);
  const [lastSongId, setLastSongId] = useState<any>();
  const [songHasMore, setSongHasMore] = useState<boolean>(false);
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
    if (artistId) {
      loadArtist();
      loadSongs(true);
    }
  }, [artistId]);

  const loadArtist = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await getWeb3Artist(artistId);
      if (res.success) {
        setArtist(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadSongs = async (init = false) => {
    if (isSongLoading) return;
    try {
      setIsSongLoading(true);

      const response = await getWeb3SongsOfArtist({
        lastId: init ? undefined : lastSongId,
        pageSize: 12,
        status: undefined,
        artistId: artistId
        // search: debouncedSearchValue
      });
      if (response.success) {
        const newCharacters = response.data;
        const newLastId = response.lastId;
        const newhasMore = response.hasMore;
        setSongs((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        setLastSongId(newLastId);
        setSongHasMore(newhasMore);
      } else {
        setSongs([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSongLoading(false);
    }
  };

  const imagePath = useMemo(() => {
    return processImage(artist?.image);
  }, [artist]);

  const handleGoToOpensea = () => {
    // const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(`https://opensea.io/${artist?.address}`, '_blank');
    // window.open(`https://${!isProd ? 'testnets.' : ''}opensea.io/${artist?.name}`,'_blank');
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box className={classes.root} id={'scrollContainerForMarketplaceArtists'}>
        <Box className={classes.headerContainer}>
          <Box className={classes.subContainer}>
            <Box
              display={'flex'}
              flexDirection={isMobile ? 'column' : 'row'}
              gridGap={50}
            >
              <Box flex={1}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => history.goBack()}
                  >
                    <div>
                      <ArrowIcon color={'#2D3047'} />
                    </div>
                    <Box
                      color="#2D3047"
                      fontSize={14}
                      fontWeight={700}
                      ml="5px"
                      mb="4px"
                    >
                      BACK
                    </Box>
                  </Box>
                  <ShareIcon />
                </Box>
                <Box>
                  <Box display="flex" alignItems="center" mt={4}>
                    <Box className={classes.typo1}>Artist Profile</Box>
                    <Box className={classes.socialButtonBox} ml={2}>
                      {artist.twitter && (
                        <Box
                          className={classes.socialButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            window.open(artist.twitter, '_blank');
                          }}
                        >
                          <img
                            src={require('assets/icons/social_twitter.webp')}
                            alt="twitter"
                          />
                        </Box>
                      )}
                      {artist?.instagram && (
                        <Box
                          className={classes.socialButton}
                          onClick={(event) => {
                            event.stopPropagation();
                            window.open(artist.instagram, '_blank');
                          }}
                        >
                          <img
                            src={require('assets/icons/social_instagram.webp')}
                            alt="instagram"
                          />
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Box className={classes.typo2}>{artist?.name}</Box>
                  <Box display={'flex'} alignItems="center" gridGap={8} mb={2}>
                    <Box className={classes.typo3}>{artist?.address}</Box>
                    <CopyIcon />
                  </Box>
                  {isMobile && (
                    <Box>
                      <Box
                        className={classes.image}
                        style={{
                          background: artist?.image
                            ? `url(${imagePath})`
                            : `url(${getDefaultAvatar()})`,
                          width: '100%',
                          height: '300px',
                          borderRadius: 12
                        }}
                      />
                    </Box>
                  )}
                  <Box display={'flex'} gridGap={10} mt={isMobile ? 2 : 4}>
                    <Box className={classes.songs} flex={isMobile && 1}>
                      <Box className={classes.typo4}>{artist?.count}</Box>
                      <Box>
                        <Box className={classes.typo5}>Created</Box>
                        <Box className={classes.typo5}>Songs</Box>
                      </Box>
                    </Box>
                    <Box
                      className={classes.checkOpenSea}
                      flex={isMobile && 1}
                      onClick={() => handleGoToOpensea()}
                    >
                      <OpenSeaIcon />
                      <Box>
                        <Box className={classes.typo6}>Check at</Box>
                        <Box className={classes.typo6}>Opensea</Box>
                      </Box>
                      <LinkIcon />
                    </Box>
                  </Box>
                </Box>
              </Box>
              {!isMobile && (
                <Box
                  width={300}
                  height={240}
                  position={'relative'}
                  overflow={'visible'}
                >
                  <Box
                    className={classes.image}
                    style={{
                      background: artist?.image
                        ? `url(${imagePath})`
                        : `url(${getDefaultAvatar()})`,
                      width: '300px',
                      height: '300px',
                      position: 'absolute',
                      right: 0,
                      bottom: -50,
                      borderRadius: 12
                    }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box className={classes.mainContainer}>
          <Box className={classes.container}>
            <Box className={classes.typo7} mb={2}>
              Explore artist songs
            </Box>
            <InfiniteScroll
              hasChildren={songs.length > 0}
              dataLength={songs.length}
              scrollableTarget={'scrollContainerForMarketplaceArtists'}
              next={loadSongs}
              hasMore={songHasMore}
              loader={
                isSongLoading && (
                  <MasonryGrid
                    gutter={isMobile ? '8px' : '16px'}
                    data={Array(loadingCount).fill(0)}
                    renderItem={(item, _) => (
                      <NFTTrackCard
                        data={item}
                        isLoading={Object.entries(item).length === 0}
                        isFullURL={false}
                      />
                    )}
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
                  renderItem={(item, _) => (
                    <NFTTrackCard
                      data={item}
                      isLoading={Object.entries(item).length === 0}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </Box>
            </InfiniteScroll>
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
}

const ShareIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.9718 14.4913L6.59522 11.303M6.58617 8.71354L12.9687 5.52225M18.4456 15.7838C18.4456 17.3793 17.1522 18.6727 15.5567 18.6727C13.9613 18.6727 12.6679 17.3793 12.6679 15.7838C12.6679 14.1883 13.9613 12.8949 15.5567 12.8949C17.1522 12.8949 18.4456 14.1883 18.4456 15.7838ZM18.4456 4.22824C18.4456 5.82373 17.1522 7.11713 15.5567 7.11713C13.9613 7.11713 12.6679 5.82373 12.6679 4.22824C12.6679 2.63276 13.9613 1.33936 15.5567 1.33936C17.1522 1.33936 18.4456 2.63276 18.4456 4.22824ZM6.89008 10.006C6.89008 11.6015 5.59668 12.8949 4.00119 12.8949C2.4057 12.8949 1.1123 11.6015 1.1123 10.006C1.1123 8.41053 2.4057 7.11713 4.00119 7.11713C5.59668 7.11713 6.89008 8.41053 6.89008 10.006Z"
      stroke="#081831"
      stroke-width="1.5"
    />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.4795 12.3022H16.9795C18.0841 12.3022 18.9795 11.4068 18.9795 10.3022V3.30225C18.9795 2.19768 18.0841 1.30225 16.9795 1.30225H9.97949C8.87492 1.30225 7.97949 2.19768 7.97949 3.30225V4.80225M2.97949 19.3022H9.97949C11.0841 19.3022 11.9795 18.4068 11.9795 17.3022V10.3022C11.9795 9.19768 11.0841 8.30225 9.97949 8.30225H2.97949C1.87492 8.30225 0.979492 9.19768 0.979492 10.3022V17.3022C0.979492 18.4068 1.87492 19.3022 2.97949 19.3022Z"
      stroke="#2D3047"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const OpenSeaIcon = () => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_15571_285468)">
      <path
        d="M26.4025 13.754C26.4025 21.0167 20.5142 26.905 13.2516 26.905C5.98888 26.905 0.100586 21.0167 0.100586 13.754C0.100586 6.49132 5.98888 0.603027 13.2516 0.603027C20.5158 0.603027 26.4025 6.49132 26.4025 13.754Z"
        fill="#2081E2"
      />
      <path
        d="M6.58862 14.1959L6.64535 14.1067L10.0664 8.75486C10.1164 8.6765 10.234 8.6846 10.2718 8.76972C10.8433 10.0506 11.3365 11.6436 11.1055 12.6353C11.0068 13.0434 10.7366 13.596 10.4326 14.1067C10.3934 14.181 10.3502 14.254 10.3042 14.3243C10.2826 14.3567 10.2461 14.3756 10.2069 14.3756H6.68859C6.59401 14.3756 6.53862 14.2729 6.58862 14.1959Z"
        fill="white"
      />
      <path
        d="M21.8377 15.1902V16.0374C21.8377 16.086 21.808 16.1292 21.7647 16.1482C21.4999 16.2616 20.5933 16.6778 20.2163 17.202C19.2543 18.541 18.5193 20.4556 16.8763 20.4556H10.022C7.59264 20.4556 5.62402 18.4802 5.62402 16.0428V15.9644C5.62402 15.8995 5.67671 15.8469 5.74157 15.8469H9.56261C9.63825 15.8469 9.69364 15.9171 9.68691 15.9914C9.65987 16.24 9.70582 16.4941 9.82336 16.7251C10.0503 17.1858 10.5205 17.4736 11.0286 17.4736H12.9202V15.9968H11.0502C10.9543 15.9968 10.8975 15.886 10.9529 15.8077C10.9732 15.7766 10.9962 15.7442 11.0205 15.7077C11.1975 15.4564 11.4501 15.0659 11.7015 14.6214C11.873 14.3214 12.0392 14.0012 12.173 13.6796C12.2 13.6215 12.2216 13.5621 12.2432 13.504C12.2797 13.4013 12.3176 13.3054 12.3446 13.2094C12.3716 13.1283 12.3932 13.0432 12.4148 12.9635C12.4784 12.6906 12.5054 12.4014 12.5054 12.1015C12.5054 11.984 12.5 11.861 12.4892 11.7434C12.4838 11.6151 12.4676 11.4867 12.4513 11.3584C12.4405 11.2449 12.4203 11.1327 12.3986 11.0152C12.3716 10.8436 12.3338 10.6734 12.2905 10.5017L12.2757 10.4369C12.2432 10.3193 12.2162 10.2072 12.1784 10.0897C12.0717 9.72078 11.9487 9.36139 11.819 9.02496C11.7717 8.89119 11.7177 8.76283 11.6636 8.63448C11.5839 8.44127 11.5028 8.26562 11.4285 8.09942C11.3907 8.02375 11.3583 7.95484 11.3258 7.88458C11.2894 7.80486 11.2515 7.72514 11.2137 7.6495C11.1867 7.5914 11.1556 7.53735 11.134 7.4833L10.9029 7.05634C10.8705 6.99824 10.9245 6.92932 10.988 6.94689L12.4338 7.33871H12.4378C12.4405 7.33871 12.4419 7.34008 12.4432 7.34008L12.6337 7.39277L12.8432 7.45223L12.9202 7.47383V6.61452C12.9202 6.19971 13.2526 5.86328 13.6633 5.86328C13.8687 5.86328 14.0551 5.94705 14.1889 6.08351C14.3227 6.21999 14.4064 6.40644 14.4064 6.61452V7.89L14.5605 7.93322C14.5726 7.93729 14.5848 7.94269 14.5956 7.95079C14.6334 7.97917 14.6875 8.02104 14.7564 8.07241C14.8104 8.11562 14.8685 8.16833 14.9388 8.22238C15.0779 8.33451 15.2441 8.47909 15.4265 8.64529C15.4752 8.68716 15.5225 8.7304 15.5657 8.77364C15.8008 8.99253 16.0643 9.24924 16.3156 9.53298C16.3859 9.6127 16.4548 9.69376 16.525 9.77888C16.5953 9.86536 16.6696 9.95047 16.7344 10.0356C16.8196 10.1491 16.9114 10.2666 16.9912 10.3896C17.029 10.4477 17.0722 10.5072 17.1087 10.5653C17.2114 10.7206 17.3019 10.8814 17.3884 11.0422C17.4249 11.1165 17.4627 11.1976 17.4951 11.2773C17.5911 11.4921 17.6667 11.711 17.7154 11.9299C17.7302 11.9772 17.741 12.0285 17.7465 12.0745V12.0853C17.7627 12.1501 17.7681 12.219 17.7735 12.2893C17.7951 12.5136 17.7843 12.7379 17.7356 12.9635C17.7154 13.0595 17.6884 13.15 17.6559 13.2459C17.6235 13.3378 17.5911 13.4337 17.5492 13.5242C17.4681 13.712 17.3722 13.8999 17.2587 14.0755C17.2222 14.1404 17.179 14.2093 17.1357 14.2741C17.0884 14.343 17.0398 14.4079 16.9966 14.4714C16.9371 14.5525 16.8736 14.6376 16.8088 14.7133C16.7507 14.793 16.6912 14.8727 16.6264 14.9429C16.5358 15.0497 16.4493 15.151 16.3588 15.2483C16.3048 15.3118 16.2467 15.3767 16.1872 15.4348C16.1291 15.4996 16.0697 15.5577 16.0156 15.6118C15.9251 15.7023 15.8495 15.7725 15.7859 15.8306L15.6373 15.9671C15.6157 15.986 15.5873 15.9968 15.5576 15.9968H14.4064V17.4736H15.8548C16.1791 17.4736 16.4872 17.3588 16.7358 17.148C16.8209 17.0737 17.1925 16.7521 17.6316 16.2671C17.6465 16.2508 17.6654 16.2387 17.687 16.2333L21.6877 15.0767C21.7621 15.0551 21.8377 15.1118 21.8377 15.1902Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_15571_285468">
        <rect
          width="26.3019"
          height="26.3019"
          fill="white"
          transform="translate(0.100586 0.603027)"
        />
      </clipPath>
    </defs>
  </svg>
);

const LinkIcon = () => (
  <svg
    width="23"
    height="23"
    viewBox="0 0 23 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_15571_285470)">
      <path
        d="M10.1246 6.35498H4.67217C4.09374 6.35498 3.53901 6.58476 3.13 6.99377C2.72099 7.40278 2.49121 7.95751 2.49121 8.53594V18.3502C2.49121 18.9287 2.72099 19.4834 3.13 19.8924C3.53901 20.3014 4.09374 20.5312 4.67217 20.5312H14.4865C15.0649 20.5312 15.6196 20.3014 16.0286 19.8924C16.4377 19.4834 16.6674 18.9287 16.6674 18.3502V12.8979"
        stroke="#2081E2"
        stroke-width="2.18096"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9.03418 13.9883L19.939 3.0835"
        stroke="#2081E2"
        stroke-width="2.18096"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14.4873 3.0835H19.9397V8.53589"
        stroke="#2081E2"
        stroke-width="2.18096"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_15571_285470">
        <rect
          width="22"
          height="22"
          fill="white"
          transform="translate(0.100586 0.694824)"
        />
      </clipPath>
    </defs>
  </svg>
);
