import React, { lazy, useState, useEffect, useMemo } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import clsx from 'clsx';

import useMediaQuery from '@material-ui/core/useMediaQuery';
import useTheme from '@material-ui/core/styles/useTheme';

// import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import { listenerSocket } from 'components/Login/Auth';
import Box from 'shared/ui-kit/Box';
import { getDefaultBGImage } from 'shared/services/user/getUserAvatar';
import { processImage } from 'shared/helpers';
import { ArrowIcon } from 'shared/ui-kit/Icons/SvgIcons';
import {
  getSongNftFeed,
  getWeb3Platform,
  geTopCollectionsOfPlatform,
  geCollectionsOfPlatform
} from 'shared/services/API';
import { CircularLoadingIndicator } from 'shared/ui-kit';
import { usePageStyles } from './index.styles';

// const COLUMNS_COUNT_BREAK_POINTS_THREE = {
//   400: 2,
//   700: 2,
//   1200: 3,
//   1440: 3
// };

const Songs = lazy(() => import('./components/Songs'));
const Feeds = lazy(() => import('./components/Feeds'));
const Owners = lazy(() => import('./components/Owners'));
const Collections = lazy(() => import('./components/Collections'));

const NFTCollectionCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTCollectionCard')
);

export default function PlatformDetailPage() {
  const classes = usePageStyles();
  const history = useHistory();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [activeTab, setActiveTab] = useState<number>(0);

  const { platformId }: { platformId: string } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [platform, setPlatform] = useState<any>();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionloading, setTransactionLoading] = useState<boolean>(false);
  const [transactionHasMore, setTransactionHasMore] = useState<boolean>(false);
  const [lastTransactionId, setLastTransactionId] = useState<any>();

  const [collections, setCollections] = useState<any[]>([]);
  const [isCollectionLoading, setIsCollectionLoading] = useState<boolean>(
    false
  );

  const [isShowFeed, setIsShowFeed] = useState<boolean>(false);
  const [isShowCollections, setIsShowCollections] = useState<boolean>(false);

  useEffect(() => {
    if (platformId) {
      loadPlatform();
      loadTransactions(true);
      // loadCollections();
      checkCollections();
    }
  }, [platformId]);

  useEffect(() => {
    if (listenerSocket) {
      const updateMarketPlaceFeedHandler = (_transaction) => {
        if (_transaction.source !== platformId) {
          return;
        }

        setTransactions((prev) => {
          let _transactions = prev.map((transaction) =>
            _transaction.id === transaction.id ? _transaction : transaction
          );
          if (
            _transactions.length === 0 ||
            _transactions[0].createdAt <= _transaction.createdAt
          ) {
            _transactions = [_transaction].concat(_transactions);
          }
          if (!isShowFeed && transactions.length > 0) {
            setIsShowFeed(true);
          }
          return _transactions;
        });
      };

      listenerSocket.on('updateMarketPlaceFeed', updateMarketPlaceFeedHandler);

      return () => {
        listenerSocket.removeListener(
          'updateMarketPlaceFeed',
          updateMarketPlaceFeedHandler
        );
      };
    }
  }, [listenerSocket]);

  const checkCollections = async () => {
    if (isShowCollections) {
      return;
    }
    try {
      const response = await geCollectionsOfPlatform({
        platformId: platformId,
        lastId: undefined,
        type: undefined
      });
      if (response.success) {
        if (response.data.length > 1) {
          setIsShowCollections(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadTransactions = async (init = false) => {
    if (transactionloading) return;
    try {
      setTransactionLoading(true);

      const response = await getSongNftFeed({
        platformId: platformId,
        lastId: init ? undefined : lastTransactionId,
        type: undefined
      });
      if (response.success) {
        const newCharacters = response.data.list;
        const newLastId = response.data.lastId;
        const newhasMore = response.data.hasMore;
        if (!isShowFeed && newCharacters.length > 0) {
          setIsShowFeed(true);
        }
        setTransactions((prev) =>
          init ? newCharacters : [...prev, ...newCharacters]
        );
        setLastTransactionId(newLastId);
        setTransactionHasMore(newhasMore);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setTransactionLoading(false);
    }
  };

  const loadPlatform = async () => {
    if (loading) return;
    try {
      setLoading(true);
      const res = await getWeb3Platform(platformId);
      console.log(res);
      if (res.success) {
        setPlatform(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const loadCollections = async () => {
    if (isCollectionLoading) return;
    try {
      setIsCollectionLoading(true);
      const res = await geTopCollectionsOfPlatform({
        platformId: platformId,
        pageSize: 3
      });
      if (res.success) {
        setCollections(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCollectionLoading(false);
    }
  };

  // const shortId = (id) => {
  //   if (!id || id.length < 12) {
  //     return id;
  //   }
  //   return id.substring(0, 6) + '...' + id.substring(id.length - 4);
  // };

  const imagePath = useMemo(() => {
    return processImage(platform?.image);
  }, [platform]);

  // const handleGotoScan = () => {
  //   const isProd = process.env.REACT_APP_ENV === 'prod';
  //   platform.chain == 'Ethereum'
  //     ? window.open(
  //         `https://${!isProd ? 'rinkeby.' : ''}etherscan.io/address/${
  //           platform.address
  //         }`,
  //         '_blank'
  //       )
  //     : window.open(
  //         `https://${!isProd ? 'mumbai.' : ''}polygonscan.com/address/${
  //           platform.address
  //         }`,
  //         '_blank'
  //       );
  // };

  const handleGoToNFT = (collection, tokenId, source) => {
    if (source === 'myx') {
      history.push(`/music/myx-track/${collection}-${tokenId}`);
    } else {
      history.push(`/music/web3-track/${collection}-${tokenId}`);
    }
  };

  return (
    <Box className={classes.root} id={'scrollContainer'}>
      <Box
        position="absolute"
        width={1}
        height="40%"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(243, 254, 247, 0) -1.49%, #EEF2F6 56.9%), url(${processImage(imagePath) ?? getDefaultBGImage()
            })`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(101px)'
        }}
      />
      <Box className={classes.container}>
        <img
          src={require('assets/musicDAOImages/platform_detail_effect_1.webp')}
          alt="effect1"
          style={{ position: 'absolute', top: 0, left: 190 }}
        />
        <img
          src={require('assets/musicDAOImages/platform_detail_effect_2.webp')}
          alt="effect2"
          style={{ position: 'absolute', top: 0, left: 90 }}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent={isMobile ? 'center' : 'space-between'}
          px={6.5}
          mt={4}
          zIndex={1}
        >
          {!isMobile && (
            <>
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                style={{ cursor: 'pointer' }}
                onClick={() => history.goBack()}
              >
                <div>
                  <ArrowIcon color={'#fff'} />
                </div>
                <Box
                  color="#fff"
                  fontSize={14}
                  fontWeight={700}
                  ml="5px"
                  mb="4px"
                >
                  BACK
                </Box>
              </Box>
            </>
          )}
          {platform?.externalURL && (
            <Box
              className={classes.externalURL}
              px={20}
              onClick={() => {
                window.open(platform.externalURL);
              }}
            >
              <Box className="link">{platform.externalURL}</Box>
              <Box className="button">
                <UrlLinkIcon />
              </Box>
            </Box>
          )}
        </Box>
        <Box className={classes.mainContainer}>
          {platform && (
            <>
              <Box className={classes.infoContainer}>
                <img
                  src={require('assets/musicDAOImages/platform_detail_effect_3.webp')}
                  alt="effect3"
                  style={{ position: 'absolute', top: -38, left: -91 }}
                />
                <img
                  src={require('assets/musicDAOImages/platform_detail_effect_4.webp')}
                  alt="effect4"
                  style={{ position: 'absolute', top: -29, left: -87 }}
                />
                <img
                  className={classes.image}
                  src={processImage(imagePath) ?? getDefaultBGImage()}
                  alt="collection image"
                />
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="start"
                  ml={9}
                >
                  <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                  >
                    <Box
                      className={classes.typo3}
                      display="flex"
                      alignItems="center"
                      pl={0.4}
                    >
                      {platform.chain == 'Ethereum' ? (
                        <>
                          <EtherIcon />
                          &nbsp;&nbsp;&nbsp;{platform.chain} chain
                        </>
                      ) : platform.chain == 'Polygon' ? (
                        <>
                          <PolygonIcon />
                          &nbsp;&nbsp;&nbsp;{platform.chain} chain
                        </>
                      ) : (
                        <></>
                      )}
                    </Box>
                    <Box className={classes.typo1}>{platform.name}</Box>
                    {/* <Box className={classes.collectionId} mt={2.5}>
                      <Box className={classes.typo4}>Platform ID:</Box>
                      <Box className={classes.typo4}>
                        {shortId(platform.address)}
                      </Box>
                      <Box
                        className={classes.link}
                        onClick={() => handleGotoScan()}
                      >
                        <LinkIcon />
                      </Box>
                    </Box> */}
                  </Box>
                  <Box className={classes.description} mt={2}>
                    <Box className={classes.scrollContainer}>
                      <Box className={classes.typo4_1}>
                        {platform.description}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box className={classes.statisticsContainer} mt={5}>
                <Box width={!isTablet ? 305 : '100%'}>
                  <Box className={classes.typo10} mb={isTablet ? 2 : 3}>
                    Daily stats
                  </Box>
                  <Box className={classes.stats}>
                    <Box className={classes.tr_stats}>
                      <Box className={classes.typo7}>Minted NFTs</Box>
                      <Box className={classes.typo6}>{platform.nftCount}</Box>
                    </Box>
                    <Box className={classes.divider}></Box>
                    <Box className={classes.tr_stats}>
                      <Box className={classes.typo7}>Collectors</Box>
                      <Box className={classes.typo6}>
                        {platform.holdersCount}
                      </Box>
                    </Box>
                    <Box className={classes.divider}></Box>
                    <Box className={classes.tr_stats}>
                      <Box className={classes.typo7}>Total Sales</Box>
                      <Box className={classes.typo6}>{platform.salesCount}</Box>
                    </Box>
                  </Box>
                </Box>
                <Box className={classes.rightFix}>
                  <Box className={classes.typo10} mb={isTablet ? 2 : 3}>
                    Latest transfers
                  </Box>
                  <Box className={classes.transfers}>
                    <Box className={classes.transferHistoryHeader}>
                      <Box width={'50%'}>Name</Box>
                      <Box width={'20%'} textAlign="center">
                        Status
                      </Box>
                      <Box width={'30%'} textAlign="right">
                        Price
                      </Box>
                    </Box>
                    <Box
                      className={classes.scrollContainer}
                      style={{ margin: '0px 21px 0px 36px' }}
                    >
                      {transactionloading ? (
                        <Box display={'flex'} justifyContent="center" mt={3}>
                          <CircularLoadingIndicator />
                        </Box>
                      ) : transactions && transactions.length ? (
                        transactions.map((item, index) => (
                          <Box
                            display={'flex'}
                            alignItems="center"
                            pb={1.5}
                            pt={1.5}
                            borderBottom="1px solid #ffffff10"
                          >
                            <Box
                              display={'flex'}
                              alignItems="center"
                              width={'50%'}
                              justifyContent="start"
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                handleGoToNFT(
                                  item.collection,
                                  item.tokenId,
                                  item.source
                                )
                              }
                            >
                              <div className={classes.avatar}>
                                <img
                                  src={
                                    processImage(item?.image) ??
                                    require('assets/musicDAOImages/marketplace_avatar_sample.webp')
                                  }
                                  alt="nft image"
                                />
                              </div>
                              <Box>{item.name}</Box>
                            </Box>
                            <Box
                              width={'20%'}
                              display="flex"
                              justifyContent={'center'}
                              ml={2}
                            >
                              <Box
                                className={classes.transferType}
                                style={{
                                  background:
                                    item.type.toLowerCase() === 'transfer'
                                      ? '#65CB63'
                                      : item.type.toLowerCase() === 'sold'
                                        ? '#29BAF9'
                                        : item.type.toLowerCase() === 'mint'
                                          ? '#2D3047'
                                          : '#65CB63'
                                }}
                              >
                                {item.type}
                              </Box>
                            </Box>
                            <Box
                              width={'30%'}
                              display="flex"
                              justifyContent={'right'}
                              textAlign="right"
                            >
                              {item.price ? `${Number(item.price).toFixed(4)} ${item.symbol ? item.symbol : 'USDT'}` : '-'}
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Box
                          style={{
                            flex: '1',
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gridGap: '13px'
                          }}
                        >
                          <NoHistoryIcon />
                          <Box className={classes.noHistory}>
                            No transaction history yet.
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
              {/* <Box mt={5}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box className={classes.typo10} style={{ color: '#2D3047' }}>
                    NFT Collections
                  </Box>
                </Box>
                <Box>
                  <Box
                    mt={4}
                    style={{ marginBottom: isMobile ? '8px' : '16px' }}
                  >
                    {!isCollectionLoading && collections.length < 2 ? (
                      <Box textAlign="center" mt={5} fontSize={18}>
                        No NFT Collections
                      </Box>
                    ) : (
                      <MasonryGrid
                        gutter={isMobile ? '8px' : '16px'}
                        data={collections}
                        renderItem={(item, _) => (
                          <NFTCollectionCard
                            collection={item}
                            isLoading={Object.entries(item).length === 0}
                          />
                        )}
                        columnsCountBreakPoints={
                          COLUMNS_COUNT_BREAK_POINTS_THREE
                        }
                      />
                    )}
                  </Box>
                </Box>
              </Box> */}
            </>
          )}
          <Box className={classes.tabContainer}>
            <Box
              className={clsx(classes.tabItem, {
                [classes.tabItemActive]: activeTab === 0
              })}
              onClick={() => setActiveTab(0)}
            >
              <div className={classes.typo9}>All Songs</div>
            </Box>
            {isShowFeed && (
              <Box
                className={clsx(classes.tabItem, {
                  [classes.tabItemActive]: activeTab === 1
                })}
                ml={3}
                onClick={() => setActiveTab(1)}
              >
                <div className={classes.typo9}>Feed</div>
              </Box>
            )}
            <Box
              className={clsx(classes.tabItem, {
                [classes.tabItemActive]: activeTab === 2
              })}
              ml={3}
              onClick={() => setActiveTab(2)}
            >
              <div className={classes.typo9}>Owners</div>
            </Box>
            {isShowCollections && (
              <Box
                className={clsx(classes.tabItem, {
                  [classes.tabItemActive]: activeTab === 3
                })}
                ml={3}
                onClick={() => setActiveTab(3)}
              >
                <div className={classes.typo9}>Collections</div>
              </Box>
            )}
          </Box>
          <Box mt={isTablet ? 6 : 8.5}>
            {activeTab === 0 ? (
              <Songs />
            ) : activeTab === 1 ? (
              <Feeds platform={platform} />
            ) : activeTab === 2 ? (
              <Owners platform={platform} />
            ) : (
              <Collections platform={platform} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const NoHistoryIcon = () => (
  <svg
    width="62"
    height="56"
    viewBox="0 0 62 56"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.5"
      d="M33.1805 7.96465e-06C22.2684 7.96465e-06 12.771 6.22449 8.20438 15.3201L7.21263 13.5454C6.61236 12.4362 5.44119 11.7609 4.1852 11.7967C3.00421 11.8228 1.92444 12.4688 1.34701 13.4964C0.769578 14.5273 0.776109 15.7833 1.36659 16.8076L5.95993 25.0026C6.831 26.575 8.7916 27.1753 10.3967 26.3597L18.5655 22.184C19.3909 21.8023 20.027 21.1041 20.3272 20.2461C20.6273 19.3849 20.5621 18.442 20.151 17.6298C19.7367 16.8207 19.0124 16.2107 18.1415 15.9497C17.2704 15.6854 16.3308 15.7866 15.5381 16.2335L15.2771 16.364C19.0288 10.5571 25.6188 6.68123 33.1812 6.68123C44.9552 6.68123 54.3991 16.0149 54.3991 27.5601C54.3991 39.0109 45.1046 48.2886 33.4684 48.4389C32.5811 48.452 31.7362 48.8174 31.1196 49.4535C30.503 50.0896 30.1637 50.9444 30.1768 51.8317C30.1931 52.7158 30.5585 53.5608 31.1947 54.1774C31.8308 54.7939 32.6856 55.1332 33.5729 55.1202C48.7427 54.9244 61.0812 42.6421 61.0812 27.5601C61.0812 12.3544 48.5164 7.96465e-06 33.1805 7.96465e-06Z"
      fill="#F0F2F5"
    />
    <path
      opacity="0.8"
      d="M31.2234 16.6882C31.6797 16.2352 32.3048 15.975 32.9614 15.9657C33.63 15.9541 34.2745 16.2053 34.7476 16.6607C35.2207 17.116 35.4814 17.7386 35.4718 18.3821V26.7451L40.7243 30.7967C41.7888 31.6168 41.9626 33.1152 41.1105 34.142C40.256 35.1666 38.6991 35.3338 37.6346 34.5137L31.4552 29.7559C30.8686 29.3029 30.5258 28.6199 30.5283 27.8974V18.3818C30.5162 17.7499 30.7672 17.1412 31.2234 16.6882Z"
      fill="white"
    />
  </svg>
);

// const LinkIcon = () => (
//   <svg
//     width="17"
//     height="17"
//     viewBox="0 0 17 17"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <path
//       d="M8.85425 10.4479H7.08341C6.793 10.4479 6.55216 10.2071 6.55216 9.91667C6.55216 9.62625 6.793 9.38542 7.08341 9.38542H8.85425C10.7101 9.38542 12.2188 7.87667 12.2188 6.02083C12.2188 4.165 10.7101 2.65625 8.85425 2.65625H5.31258C3.45675 2.65625 1.948 4.165 1.948 6.02083C1.948 6.8 2.22425 7.55792 2.72008 8.16C2.90425 8.38667 2.87591 8.71958 2.64925 8.91083C2.42258 9.095 2.08966 9.06667 1.89841 8.84C1.24675 8.04667 0.885498 7.04792 0.885498 6.02083C0.885498 3.57708 2.86883 1.59375 5.31258 1.59375H8.85425C11.298 1.59375 13.2813 3.57708 13.2813 6.02083C13.2813 8.46458 11.298 10.4479 8.85425 10.4479Z"
//       fill="#2D3047"
//       stroke="#2D3047"
//       stroke-width="0.5"
//     />
//     <path
//       d="M11.6875 15.4062H8.14583C5.70208 15.4062 3.71875 13.4228 3.71875 10.9791C3.71875 8.53534 5.70208 6.552 8.14583 6.552H9.91667C10.2071 6.552 10.4479 6.79284 10.4479 7.08325C10.4479 7.37367 10.2071 7.6145 9.91667 7.6145H8.14583C6.29 7.6145 4.78125 9.12325 4.78125 10.9791C4.78125 12.8349 6.29 14.3437 8.14583 14.3437H11.6875C13.5433 14.3437 15.0521 12.8349 15.0521 10.9791C15.0521 10.1999 14.7758 9.442 14.28 8.83992C14.0958 8.61325 14.1242 8.28034 14.3508 8.08909C14.5775 7.89784 14.9104 7.93325 15.1017 8.15992C15.7604 8.95325 16.1217 9.952 16.1217 10.9791C16.1146 13.4228 14.1312 15.4062 11.6875 15.4062Z"
//       fill="#2D3047"
//       stroke="#2D3047"
//       stroke-width="0.5"
//     />
//   </svg>
// );

const EtherIcon = () => (
  <svg
    width="23"
    height="22"
    viewBox="0 0 23 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.5 11C0.5 4.92487 5.42487 0 11.5 0C17.5751 0 22.5 4.92487 22.5 11C22.5 17.0751 17.5751 22 11.5 22C5.42487 22 0.5 17.0751 0.5 11Z"
      fill="#17172D"
    />
    <path
      d="M0.5 11C0.5 4.92487 5.42487 0 11.5 0C17.5751 0 22.5 4.92487 22.5 11C22.5 17.0751 17.5751 22 11.5 22C5.42487 22 0.5 17.0751 0.5 11Z"
      fill="white"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M16.0991 11.1405L11.3005 3.31982L6.50195 11.1405L11.3005 13.9266L16.0991 11.1405ZM16.1 12.0344L11.2986 14.819V14.819L6.5 12.0343L11.2985 18.6762L11.2985 18.6764L16.1 12.0344Z"
      fill="black"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M11.2986 14.819L16.1 12.0344L11.2985 18.6764L11.2985 18.6762L6.5 12.0343L11.2986 14.819V14.819ZM11.3005 3.31982L16.0991 11.1405L11.3005 13.9266L6.50195 11.1405L11.3005 3.31982Z"
      fill="white"
      fill-opacity="0.01"
    />
    <path
      d="M11.2988 3.31982V8.99662L16.0969 11.1406L11.2988 3.31982Z"
      fill="white"
      fill-opacity="0.602"
    />
    <path
      d="M11.3007 3.31982L6.50195 11.1406L11.3007 8.99662V3.31982Z"
      fill="#CCCCCC"
    />
    <path
      d="M11.2988 14.8195V18.6767L16.1001 12.0342L11.2988 14.8195Z"
      fill="white"
      fill-opacity="0.602"
    />
    <path
      d="M11.2987 18.6767V14.8188L6.5 12.0342L11.2987 18.6767Z"
      fill="#CCCCCC"
    />
    <path
      d="M11.2988 13.9267L16.0969 11.1408L11.2988 8.99805V13.9267Z"
      fill="white"
      fill-opacity="0.2"
    />
    <path
      d="M6.5 11.1408L11.2987 13.9267V8.99805L6.5 11.1408Z"
      fill="white"
      fill-opacity="0.602"
    />
    <path
      d="M11.5 21.2667C5.82988 21.2667 1.23333 16.6701 1.23333 11H-0.233333C-0.233333 17.4801 5.01986 22.7333 11.5 22.7333V21.2667ZM21.7667 11C21.7667 16.6701 17.1701 21.2667 11.5 21.2667V22.7333C17.9801 22.7333 23.2333 17.4801 23.2333 11H21.7667ZM11.5 0.733333C17.1701 0.733333 21.7667 5.32988 21.7667 11H23.2333C23.2333 4.51986 17.9801 -0.733333 11.5 -0.733333V0.733333ZM11.5 -0.733333C5.01986 -0.733333 -0.233333 4.51986 -0.233333 11H1.23333C1.23333 5.32988 5.82988 0.733333 11.5 0.733333V-0.733333Z"
      fill="#A8A8A8"
      fill-opacity="0.38"
    />
  </svg>
);

const PolygonIcon = () => (
  <svg
    width="23"
    height="22"
    viewBox="-5 -5 33 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="10" r="14" fill="white" />
    <circle cx="12" cy="10" r="14" stroke="#dddddd" strokeWidth={1} />
    <circle cx="12" cy="10" r="15" stroke="#ffffff55" strokeWidth={1} />
    <path
      d="M17.3888 6.27468C17.1703 6.15256 16.9242 6.08845 16.6738 6.08845C16.4235 6.08845 16.1774 6.15256 15.9589 6.27468L12.6784 8.17742L10.4494 9.41834L7.16907 11.3211C6.95054 11.4431 6.70442 11.5072 6.45413 11.5072C6.20385 11.5072 5.95773 11.4431 5.7392 11.3211L3.13158 9.83198C2.91942 9.71032 2.74221 9.53601 2.61705 9.32589C2.4919 9.11576 2.42304 8.87692 2.41711 8.63243V5.69559C2.41417 5.44924 2.47934 5.20686 2.60541 4.99519C2.73148 4.78352 2.91356 4.61079 3.13158 4.49603L5.69708 3.0483C5.91561 2.92628 6.16173 2.86223 6.41202 2.86223C6.6623 2.86223 6.90843 2.92628 7.12696 3.0483L9.69246 4.49603C9.90462 4.6177 10.0818 4.79201 10.207 5.00213C10.3321 5.21225 10.401 5.45109 10.4069 5.69559V7.59833L12.6359 6.31605V4.41331C12.6388 4.16695 12.5737 3.92458 12.4476 3.71291C12.3215 3.50124 12.1394 3.3285 11.9214 3.21375L7.16907 0.483922C6.95054 0.361907 6.70442 0.297852 6.45413 0.297852C6.20385 0.297852 5.95773 0.361907 5.7392 0.483922L0.902063 3.21394C0.684078 3.32868 0.502012 3.50138 0.375942 3.71302C0.249872 3.92465 0.184694 4.16699 0.187595 4.41331V9.91471C0.184659 10.1611 0.24982 10.4034 0.375893 10.6151C0.501965 10.8268 0.684049 10.9995 0.902063 11.1143L5.73863 13.8443C5.95716 13.9663 6.20328 14.0304 6.45357 14.0304C6.70386 14.0304 6.94998 13.9663 7.16851 13.8443L10.4489 11.9829L12.6778 10.7006L15.9583 8.83925C16.1768 8.71713 16.423 8.65301 16.6733 8.65301C16.9236 8.65301 17.1697 8.71713 17.3882 8.83925L19.9537 10.287C20.1659 10.4087 20.3431 10.583 20.4682 10.7931C20.5934 11.0032 20.6622 11.242 20.6682 11.4865V14.4234C20.6711 14.6697 20.606 14.9121 20.4799 15.1238C20.3538 15.3354 20.1717 15.5082 19.9537 15.6229L17.3882 17.112C17.1697 17.234 16.9236 17.2981 16.6733 17.2981C16.423 17.2981 16.1769 17.234 15.9583 17.112L13.3928 15.6643C13.1807 15.5426 13.0035 15.3683 12.8783 15.1582C12.7532 14.9481 12.6843 14.7092 12.6784 14.4647V12.5618L10.4494 13.8441V15.7468C10.4465 15.9932 10.5116 16.2356 10.6377 16.4472C10.7638 16.6589 10.9459 16.8316 11.1639 16.9464L16.0005 19.6764C16.219 19.7984 16.4651 19.8625 16.7154 19.8625C16.9657 19.8625 17.2118 19.7984 17.4303 19.6764L22.2669 16.9464C22.4791 16.8247 22.6563 16.6504 22.7814 16.4403C22.9066 16.2302 22.9754 15.9913 22.9814 15.7468V10.2456C22.9843 9.99927 22.9191 9.75689 22.7931 9.54522C22.667 9.33355 22.4849 9.16082 22.2669 9.04607L17.3888 6.27468Z"
      fill="#8247E5"
    />
  </svg>
);

const UrlLinkIcon = () => (
  <svg
    width="19"
    height="18"
    viewBox="0 0 19 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.00586 5.25H5.25586C4.85803 5.25 4.4765 5.40804 4.1952 5.68934C3.91389 5.97064 3.75586 6.35218 3.75586 6.75V13.5C3.75586 13.8978 3.91389 14.2794 4.1952 14.5607C4.4765 14.842 4.85803 15 5.25586 15H12.0059C12.4037 15 12.7852 14.842 13.0665 14.5607C13.3478 14.2794 13.5059 13.8978 13.5059 13.5V9.75"
      stroke="#2D3047"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M8.25586 10.5L15.7559 3"
      stroke="#2D3047"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.0059 3H15.7559V6.75"
      stroke="#2D3047"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
