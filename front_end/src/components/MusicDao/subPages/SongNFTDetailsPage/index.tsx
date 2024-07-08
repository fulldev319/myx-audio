import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import Loading from 'shared/ui-kit/Loading';
import Avatar from 'shared/ui-kit/Avatar';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import { PagePreviewSmallIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import { usePageStyles } from './index.styles';
import {
  addWeb3SongComments,
  getWeb3OtherSongsInCollection,
  getWeb3Song,
  getWeb3SongComments
} from 'shared/services/API';
import { processImage } from 'shared/helpers';
import Moment from 'react-moment';
import { useTypedSelector } from 'store/reducers/Reducer';
import { getUser } from 'store/selectors';
import { getAllTokenInfos } from 'shared/services/API/TokenAPI';
import { MusicPlatformPictures } from 'shared/constants/constants';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';

const NFTTrackCard = lazy(
  () => import('components/MusicDao/components/Cards/NFTTrackCard')
);

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 2,
  700: 2,
  1200: 3,
  1440: 4
};

export default function SongNFTDetailsPage() {
  const classes = usePageStyles();
  const user = useTypedSelector(getUser);
  const params: any = useParams();
  const id = params?.id;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const isTablet = useMediaQuery(theme.breakpoints.down('sm'));
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

  const [songDetailData, setSongDetailData] = useState<any>(null);
  const [message, setMessage] = useState<string>('');
  const [comments, setComments] = useState<any[]>([]);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(false);
  const lastDate = useRef<number | undefined>();

  const [isOtherSongsLoading, setIsOtherSongsLoading] =
    useState<boolean>(false);
  const [otherSongs, setOtherSongs] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any>([]);

  useEffect(() => {
    const getSongDetail = async () => {
      const response = await getWeb3Song(id);
      if (response.success) {
        let scanNetworkName = '';
        if (response.data.Chain === 'Polygon') scanNetworkName = 'Polygonscan';
        else if (response.data.Chain === 'Ethereum')
          scanNetworkName = 'Etherscan';
        else if (response.data.Chain === 'Binance') scanNetworkName = 'BscScan';
        setSongDetailData({
          ...response.data,
          scanNetworkName: scanNetworkName,
          Artist: response.data.Artist?.replace(' ,', ', ')
        });
      }
    };
    getComments();
    getSongDetail();
    getAllTokenInfos().then((resp) => {
      if (resp.success && resp.tokens) {
        setTokens(resp.tokens);
      }
    });
  }, [id]);

  useEffect(() => {
    if (songDetailData?.CollectionAddress) {
      setIsOtherSongsLoading(true);
      getWeb3OtherSongsInCollection(songDetailData.CollectionAddress)
        .then((res) => {
          if (res.success) {
            setOtherSongs(
              res.data.filter((item) => item && (item.Image || item.image))
            );
          }
        })
        .finally(() => {
          setIsOtherSongsLoading(false);
        });
    }
  }, [songDetailData?.CollectionAddress]);

  const getComments = () => {
    getWeb3SongComments(id, lastDate.current).then((res) => {
      if (res.success) {
        setComments((prev) => [...prev, ...res.data]);
        lastDate.current =
          res.data.length > 0 ? res.data[res.data.length - 1].date : undefined;
        setHasMoreComments(res.data.length === 10);
      }
    });
  };

  const addComment = () => {
    if (message && id && user?.id) {
      addWeb3SongComments(id, message).then((res) => {
        if (res.success) {
          setSongDetailData((prev) => ({
            ...prev,
            commentCount: prev.commentCount + 1
          }));
          setComments((prev) => [
            {
              id: res.docId,
              response: message,
              userName: `${user.firstName} ${user.lastName}`,
              imageUrl: user.urlIpfsImage,
              date: Date.now()
            },
            ...prev
          ]);
          setMessage('');
        }
      });
    }
  };

  const getTokenName = (addr) => {
    if (tokens.length == 0) return '';
    const token = tokens.find(
      (token) =>
        token.Address?.toLowerCase() === addr?.toLowerCase() ||
        token.Symbol?.toLowerCase() === addr?.toLowerCase()
    );
    return token?.Symbol ?? '';
  };

  const getTokenPrice = (price, addr) => {
    if (tokens.length == 0) return 0;
    const token = tokens.find(
      (token) =>
        token.Address?.toLowerCase() === addr?.toLowerCase() ||
        token.Symbol?.toLowerCase() === addr?.toLowerCase()
    );
    return token ? price / 10 ** token.Decimals : 0;
  };

  const shortId = (id) => {
    if (!id || id.length < 12) {
      return id;
    }
    return id.substring(0, 6) + '...' + id.substring(id.length - 4);
  };

  return (
    <Suspense fallback={<Loading />}>
      <Box className={classes.web3ArtistRoot}>
        <Box className={classes.gradientBox}>
          <Box className={classes.headerContentBox}>
            <Box display={'flex'} alignItems="center" justifyContent={'end'}>
              <Box display={'flex'} alignItems="center">
                <CommentsIcon />
                <Box
                  className={classes.typo2}
                  fontWeight={700}
                  color="#fff"
                  ml={1.5}
                >
                  {songDetailData?.commentCount || 0} Comments
                </Box>
              </Box>
              <Box width={'1px'} height={'12px'} bgcolor="#fff" mx={3} />
              <Box
                style={{
                  width: 29,
                  height: 29,
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff',
                  cursor: 'pointer'
                }}
              >
                <ShareIcon />
              </Box>
            </Box>
            <Box
              display={'flex'}
              alignItems={isTablet ? 'start' : 'center'}
              justifyContent={'center'}
              flexDirection={isMobile ? 'column' : 'row'}
              mt={4}
            >
              <img
                src={processImage(songDetailData?.Image) ?? getDefaultBGImage()}
                height={320}
                width={320}
                style={{
                  borderRadius: 11,
                  objectFit: 'cover',
                  width: isMobile ? '100%' : '320px'
                }}
              />
              <Box
                display={'flex'}
                flexDirection="column"
                ml={isMobile ? 0 : 9}
                mt={isMobile ? 4 : 0}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  className={classes.typo2}
                  fontWeight={700}
                  color="#fff"
                >
                  <EtherIcon />
                  &nbsp;&nbsp;&nbsp;{songDetailData?.scanNetworkName} chain
                </Box>
                <Box className={classes.title}>{songDetailData?.Name}</Box>
                <Box className={classes.typo1} fontWeight={700} mt={1}>
                  Sabrina Spellman
                </Box>
                <Box className={classes.typo1} fontWeight={400} mt={0.5}>
                  {songDetailData?.Source}
                </Box>
              </Box>
            </Box>
            <Box
              display={'flex'}
              alignItems="center"
              justifyContent={'center'}
              mt={4}
              width={1}
            >
              <MusicPlayer
                media={songDetailData?.metadataMedia}
                isHls={true}
                feed={() => {}}
                songId={songDetailData?.Id}
              />
            </Box>
          </Box>
        </Box>
        <Box className={classes.content}>
          <Box
            display={'flex'}
            flexDirection={isTablet ? 'column' : 'start'}
            width={1}
          >
            <Box
              display={'flex'}
              flexDirection="column"
              maxWidth={isTablet ? '100%' : '450px'}
            >
              <Box className={classes.typo3}>Description</Box>
              <Box className={classes.typo4} mt={2}>
                {songDetailData?.Description}
              </Box>
              <Box display={'flex'} mt={6} mb={2}>
                <Box display={'flex'} flexDirection="column">
                  <Box className={classes.typo5}>Creator</Box>
                  <Box display={'flex'} alignItems="center" mt={2}>
                    <Avatar
                      size={42}
                      rounded
                      image={
                        processImage(songDetailData?.creator?.avatar) ||
                        getDefaultAvatar()
                      }
                      style={{ cursor: 'pointer', color: 'white' }}
                      onClick={() => {}}
                    />
                    <Box ml={1} className={classes.typo6} fontWeight={700}>
                      {shortId(songDetailData?.CreatorAddress)}
                    </Box>
                  </Box>
                </Box>
                <Box display={'flex'} flexDirection="column" ml={5.5}>
                  <Box className={classes.typo5}>Platform</Box>
                  <Box display={'flex'} alignItems="center" mt={2}>
                    {MusicPlatformPictures.find(
                      (v) => v === songDetailData?.Source?.toLowerCase()
                    ) && (
                      <Avatar
                        size={42}
                        image={require(`assets/platformImages/${songDetailData?.Source?.toLowerCase()}.webp`)}
                        style={{ cursor: 'pointer', color: 'white' }}
                        onClick={() => {}}
                      />
                    )}
                    <Box ml={1} className={classes.typo6} fontWeight={700}>
                      {songDetailData?.Source}
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                className={classes.ipfsSection}
                onClick={() => {
                  songDetailData?.TokenUrl &&
                    window.open(songDetailData?.TokenUrl, '_blank');
                }}
              >
                <Box className={classes.typo6} fontWeight={400}>
                  IPFS
                </Box>
                <PagePreviewSmallIcon />
              </Box>
              <Box className={classes.ipfsSection} onClick={() => {}}>
                <Box className={classes.typo6} fontWeight={400}>
                  Contract Address
                </Box>
                <Box className={classes.typo7} fontWeight={400}>
                  {shortId(songDetailData?.collectionId)}
                </Box>
              </Box>
              <Box className={classes.ipfsSection} onClick={() => {}}>
                <Box className={classes.typo6} fontWeight={400}>
                  Chain
                </Box>
                <Box className={classes.typo6} fontWeight={400}>
                  {songDetailData?.Chain}
                </Box>
              </Box>
            </Box>
            <Box
              display={'flex'}
              flexDirection="column"
              width={1}
              ml={isTablet ? 0 : 5}
              mt={isTablet ? 3 : 0}
            >
              <div className={classes.currentPriceSection}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  pb={4}
                  borderBottom="1px solid #00000010"
                  mb={3}
                >
                  <div className={classes.typo5}>Current Price</div>
                  <Box display="flex" alignItems="center">
                    <div className={classes.typo8}>
                      {songDetailData?.sellingOffer?.Price
                        ? `${getTokenName(
                            songDetailData?.sellingOffer.PaymentToken
                          )} ${getTokenPrice(
                            songDetailData?.sellingOffer.Price,
                            songDetailData?.sellingOffer.PaymentToken
                          )}`
                        : 'Not set'}
                    </div>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  {songDetailData?.podInfo ? (
                    <button className={classes.podBtn} onClick={() => {}}>
                      Open on Capsule
                    </button>
                  ) : (
                    <div />
                  )}
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    {songDetailData?.sellingOffer?.Price && (
                      <div className={classes.buyNowBtn} onClick={() => {}}>
                        Buy Now
                      </div>
                    )}
                    <div
                      className={classes.makeOffBtn}
                      onClick={() => {
                        {
                        }
                      }}
                    >
                      Make Offer
                    </div>
                  </Box>
                </Box>
              </div>
              <div className={classes.buyOffersSection}>
                <Box display={'flex'} alignItems="center">
                  <BookmarkIcon />
                  <Box className={classes.typo9} ml={2}>
                    All buy offers
                  </Box>
                </Box>
                <Box
                  className={classes.typo7}
                  fontWeight={400}
                  style={{ cursor: 'pointer' }}
                >
                  Show
                </Box>
              </div>
              <div className={classes.sellHistorySection}>
                <Box display={'flex'} alignItems="center">
                  <HistoryIcon />
                  <Box className={classes.typo9} ml={2}>
                    Sell history
                  </Box>
                </Box>
                <Box
                  className={classes.typo7}
                  fontWeight={400}
                  style={{ cursor: 'pointer' }}
                >
                  Show
                </Box>
              </div>
            </Box>
          </Box>
        </Box>
        <Box className={classes.commentsContentBox}>
          <Box className={classes.typo3}>Comments</Box>
          <Box className={classes.addCommentsBox}>
            <Box display={'flex'} alignItems="center">
              <Avatar
                size={42}
                rounded
                bordered
                image={processImage(user.urlIpfsImage) ?? getDefaultAvatar()}
                style={{ cursor: 'pointer', color: 'white' }}
                onClick={() => {}}
              />
              <input
                type="text"
                placeholder="Add comment..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Box>
            <div
              className={classes.buyNowBtn}
              onClick={() => {
                addComment();
              }}
            >
              Add Comment
            </div>
          </Box>
          <Box className={classes.typo3} mt={3}>
            All comments
          </Box>
          <Box className={classes.commentHistoryBox}>
            {comments.map((comment) => (
              <Box display={'flex'} mb={3}>
                <Avatar
                  size={35}
                  rounded
                  image={processImage(comment.imageUrl) ?? getDefaultAvatar()}
                  style={{ cursor: 'pointer', color: 'white' }}
                  onClick={() => {}}
                />
                <Box display={'flex'} flexDirection="column" ml={2.5}>
                  <Box
                    display={'flex'}
                    flexDirection="column"
                    bgcolor={'rgba(242, 244, 251, 0.5)'}
                    borderRadius={12}
                    p={'10px 24px 24px'}
                  >
                    <Box className={classes.typo10}>{comment.userName}</Box>
                    <Box className={classes.typo6} fontWeight={400} mt={1}>
                      {comment.response}
                    </Box>
                  </Box>
                  <Box display={'flex'} alignItems="center" mt={0.5}>
                    <Box
                      className={classes.typo2}
                      fontWeight={400}
                      color="#0D59EE"
                    >
                      Like
                    </Box>
                    <Box
                      className={classes.typo2}
                      fontWeight={700}
                      color="#2D3047"
                      mx={3}
                    >
                      Reply
                    </Box>
                    <Box
                      className={classes.typo2}
                      fontWeight={700}
                      color="#7E7D95"
                    >
                      <Moment fromNow>{comment.date}</Moment>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}
            {comments.length === 0 && (
              <Box textAlign="center" mt={6}>
                No Comments
              </Box>
            )}
          </Box>
          {hasMoreComments && (
            <Box
              className={classes.typo11}
              mt={3}
              textAlign="center"
              onClick={() => {
                getComments();
              }}
              style={{
                cursor: 'pointer'
              }}
            >
              Load More
            </Box>
          )}
        </Box>
        <Box className={classes.collectionContentBox}>
          <Box className={classes.collectionMainContentBox}>
            <Box className={classes.typo12}>Other in this Collection</Box>
            <Box mt={4.5}>
              {!isOtherSongsLoading && otherSongs.length === 0 && (
                <Box textAlign="center" mt={6}>
                  No Songs
                </Box>
              )}
              <MasonryGrid
                gutter={'16px'}
                data={otherSongs}
                renderItem={(item, _) => (
                  <NFTTrackCard
                    data={item}
                    isLoading={Object.entries(item).length === 0}
                  />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Suspense>
  );
}

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

const CommentsIcon = () => (
  <svg
    width="23"
    height="21"
    viewBox="0 0 23 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.243 0.889648C16.1487 0.880664 16.0544 0.87168 15.9555 0.867188C14.5899 0.87168 13.2243 0.873476 11.8588 0.871679C11.5129 0.871679 9.6037 0.87168 7.42944 0.867188C6.86792 0.894141 6.45912 0.925587 6.31537 0.952538C2.1871 1.67577 -0.602574 5.73677 0.111576 9.87401C0.780922 13.7599 3.9075 16.4147 7.85154 16.4371C8.91618 16.4415 9.98083 16.4236 11.0455 16.4505C11.2944 16.4595 11.5361 16.5422 11.7373 16.6895C12.8334 17.543 13.9026 18.437 14.9987 19.2906C15.3761 19.5826 15.7939 19.8476 16.2296 20.0183C17.0427 20.3328 17.7345 19.9779 18.0175 19.1424C18.1208 18.8342 18.1828 18.5134 18.2017 18.19C18.2331 17.5746 18.2376 16.9547 18.2151 16.3348C18.2017 16.0023 18.3005 15.8226 18.6105 15.6654C21.6428 14.1201 23.233 11.2586 22.9724 7.86703C22.6939 4.28225 19.8108 1.2221 16.2431 0.889747L16.243 0.889648Z"
      fill="white"
    />
  </svg>
);

const ShareIcon = () => (
  <svg
    width="13"
    height="11"
    viewBox="0 0 13 11"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.9437 8.64225C10.9437 9.17225 10.4685 9.66934 9.79583 9.66934V10.7568C10.9918 10.7568 12.0312 9.84735 12.0312 8.64225H10.9437ZM9.79583 9.66934C9.1232 9.66934 8.64791 9.17225 8.64791 8.64225H7.56041C7.56041 9.84735 8.59989 10.7568 9.79583 10.7568V9.66934ZM8.64791 8.64225C8.64791 8.11226 9.1232 7.61517 9.79583 7.61517V6.52767C8.59989 6.52767 7.56041 7.43716 7.56041 8.64225H8.64791ZM9.79583 7.61517C10.4685 7.61517 10.9437 8.11226 10.9437 8.64225H12.0312C12.0312 7.43716 10.9918 6.52767 9.79583 6.52767V7.61517ZM10.9437 2.35892C10.9437 2.88892 10.4685 3.386 9.79583 3.386V4.4735C10.9918 4.4735 12.0312 3.56402 12.0312 2.35892H10.9437ZM9.79583 3.386C9.1232 3.386 8.64791 2.88892 8.64791 2.35892H7.56041C7.56041 3.56402 8.59989 4.4735 9.79583 4.4735V3.386ZM8.64791 2.35892C8.64791 1.82892 9.1232 1.33184 9.79583 1.33184V0.244336C8.59989 0.244336 7.56041 1.15382 7.56041 2.35892H8.64791ZM9.79583 1.33184C10.4685 1.33184 10.9437 1.82892 10.9437 2.35892H12.0312C12.0312 1.15382 10.9918 0.244336 9.79583 0.244336V1.33184ZM4.17708 5.50059C4.17708 6.03058 3.70179 6.52767 3.02916 6.52767V7.61517C4.2251 7.61517 5.26458 6.70568 5.26458 5.50059H4.17708ZM3.02916 6.52767C2.35653 6.52767 1.88124 6.03058 1.88124 5.50059H0.793744C0.793744 6.70568 1.83322 7.61517 3.02916 7.61517V6.52767ZM1.88124 5.50059C1.88124 4.97059 2.35653 4.4735 3.02916 4.4735V3.386C1.83322 3.386 0.793744 4.29549 0.793744 5.50059H1.88124ZM3.02916 4.4735C3.70179 4.4735 4.17708 4.97059 4.17708 5.50059H5.26458C5.26458 4.29549 4.2251 3.386 3.02916 3.386V4.4735ZM8.51112 7.44628L4.77714 5.71265L4.31918 6.69902L8.05316 8.43265L8.51112 7.44628ZM4.77184 5.29098L8.50933 3.55572L8.05137 2.56935L4.31388 4.30461L4.77184 5.29098Z"
      fill="#0D59EE"
    />
  </svg>
);

const BookmarkIcon = () => (
  <svg
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15.7508 6.4734C15.7508 8.1072 13.3008 8.1072 13.3008 6.4734C13.3008 4.8396 15.7508 4.8396 15.7508 6.4734Z"
      fill="#0D59EE"
    />
    <path
      d="M9.44909 0.349679C8.89266 0.349679 8.35807 0.571163 7.96568 0.966274L1.45919 7.46857C0.746866 8.17949 0.347656 9.14339 0.347656 10.1496C0.347656 11.1559 0.746866 12.1198 1.45919 12.8307L8.16798 19.5395C8.8789 20.2518 9.8428 20.651 10.8491 20.651C11.8553 20.651 12.8192 20.2518 13.5301 19.5395L20.0324 13.033C20.4275 12.6406 20.649 12.1061 20.649 11.5496V3.14961C20.649 2.40722 20.3537 1.69494 19.8287 1.16994C19.3037 0.644939 18.5914 0.349609 17.849 0.349609L9.44909 0.349679ZM18.5491 3.14968V11.5497L12.0468 18.052C11.3864 18.7123 10.3159 18.7123 9.65559 18.052L2.94679 11.3474C2.28645 10.687 2.28645 9.61652 2.94679 8.95618L9.44909 2.44968H17.8491C18.035 2.44968 18.2128 2.52351 18.344 2.65476C18.4753 2.78601 18.5491 2.96374 18.5491 3.14969L18.5491 3.14968Z"
      fill="#0D59EE"
    />
  </svg>
);

const HistoryIcon = () => (
  <svg
    width="27"
    height="27"
    viewBox="0 0 27 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.2949 3.45117C10.3156 3.45117 6.85232 5.72101 5.18705 9.03781L4.8254 8.39065C4.60651 7.98618 4.17942 7.73992 3.72141 7.75298C3.29075 7.7625 2.897 7.99805 2.68643 8.3728C2.47587 8.74873 2.47825 9.20674 2.69357 9.58027L4.36859 12.5687C4.68623 13.1421 5.40119 13.361 5.9865 13.0635L8.96535 11.5408C9.26633 11.4016 9.49831 11.147 9.60777 10.8342C9.71721 10.5201 9.69342 10.1763 9.54352 9.88007C9.39244 9.58504 9.12833 9.36258 8.81072 9.26741C8.49307 9.17105 8.15046 9.20793 7.86138 9.37091L7.76621 9.41849C9.1343 7.30094 11.5374 5.88756 14.2951 5.88756C18.5886 5.88756 22.0325 9.29119 22.0325 13.5013C22.0325 17.6769 18.6432 21.0602 14.3999 21.115C14.0763 21.1197 13.7682 21.253 13.5433 21.4849C13.3185 21.7169 13.1948 22.0286 13.1995 22.3522C13.2055 22.6746 13.3387 22.9827 13.5707 23.2076C13.8027 23.4324 14.1144 23.5561 14.438 23.5514C19.9698 23.48 24.4692 19.0011 24.4692 13.5013C24.4692 7.95636 19.8879 3.45117 14.2955 3.45117L14.2949 3.45117ZM14.3996 7.39142C14.076 7.39618 13.7679 7.52942 13.543 7.76139C13.3182 7.99337 13.1945 8.30507 13.2004 8.62865V13.5014C13.1992 13.8714 13.3681 14.2212 13.6572 14.4531L16.7027 16.8895C17.2274 17.3095 17.9947 17.2238 18.4158 16.6992C18.8357 16.1734 18.7501 15.406 18.2255 14.9861L15.6368 12.9114V8.6288C15.6416 8.29928 15.5131 7.98045 15.2799 7.74729C15.0467 7.51413 14.7291 7.38564 14.3996 7.39157V7.39142Z"
      fill="#0D59EE"
    />
  </svg>
);
