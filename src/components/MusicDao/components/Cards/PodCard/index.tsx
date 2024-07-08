import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

// import { useTypedSelector } from 'store/reducers/Reducer';
// import { FruitSelect } from 'shared/ui-kit/Select/FruitSelect';
import Box from 'shared/ui-kit/Box';
import { useTokenConversion } from 'shared/contexts/TokenConversionContext';
// import { musicDaoFruitPod } from 'shared/services/API';
import {
  _arrayBufferToBase64,
  formatNumber
} from 'shared/functions/commonFunctions';
import { Color } from 'shared/ui-kit';
import {
  getDefaultAvatar,
  getDefaultBGImage
} from 'shared/services/user/getUserAvatar';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';
// import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import { onGetNonDecrypt } from 'shared/ipfs/get';
import { processImage } from 'shared/helpers';
// import { useAuth } from 'shared/contexts/AuthContext';

import { podCardStyles } from './index.styles';

export default function PodCard({ pod, isLoading = false }) {
  const { convertTokenToUSD } = useTokenConversion();
  const history = useHistory();
  const styles = podCardStyles();
  // const { showAlertMessage } = useAlertMessage();

  const [openCollabList, setOpenCollabList] = useState(false);
  const anchorCollabsRef = useRef<HTMLDivElement>(null);

  const [podData, setPodData] = useState<any>({});
  // const user = useTypedSelector((state) => state.user);

  const [fundingEndTime, setFundingEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const parentNode = React.useRef<any>();

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [imageIPFS1, setImageIPFS1] = useState<any>(null);
  const [collabCount, setCollabCount] = useState<number>(0);
  const { ipfs, downloadWithNonDecryption } = useIPFS();

  // const { isSignedin } = useAuth();

  const [nftsOfSale, setNFTsOfSale] = React.useState<string>('');
  const [revenue, setRevenue] = React.useState<Number>(0);

  const getNFTsOfSale = async () => {
    if (pod?.Medias?.length > 0) {
      let amount = 0,
        amountAll = 0;
      for (let i = 0; i < pod?.Medias?.length; i++) {
        const media = pod.Medias[i];
        for (let j = 0; j < media?.quantityPerEdition?.length; j++) {
          amountAll += Number(media.quantityPerEdition[j]);
          amount += Number(media.quantityPerEdition[j]);
        }
        for (let j = 0; j < media?.quantitySoldPerEdition?.length; j++) {
          amount -= Number(media.quantitySoldPerEdition[j]);
        }
      }

      setNFTsOfSale(`${amount} / ${amountAll}`);
      setRevenue(Number(pod.revenueFromSales ?? 0) / 10 ** 6);
    }
  };

  useEffect(() => {
    getNFTsOfSale();
  }, [pod]);

  useEffect(() => {
    if (pod?.FundingDate) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(pod.FundingDate - now.getTime() / 1000);

        if (delta < 0) {
          setFundingEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setFundingEndTime({
            days,
            hours,
            minutes,
            seconds
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [pod?.FundingDate]);

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0) {
      setPodData(pod);
      if (pod) {
        // pod image
        if (pod) {
          if (
            pod?.InfoImage?.newFileCID &&
            pod?.InfoImage?.metadata?.properties?.name
          ) {
            getImageIPFS(
              pod.InfoImage.newFileCID,
              pod.InfoImage.metadata.properties.name
            );
          } else {
            getImageIPFS('', '');
          }
        }

        // other user image

        if (pod.collabUserData?.length > 0) {
          for (let index = 0; index < pod.collabUserData.length; index++) {
            const v = pod.collabUserData[index];
            if (v.userId !== pod.creatorId) {
              if (v.userImage?.urlIpfsImage) {
                setImageIPFS1(v.userImage.urlIpfsImage);
              } else if (
                v.userImage?.InfoImage?.newFileCID &&
                v.userImage?.InfoImage?.metadata?.properties?.name
              ) {
                getImageIPFS1(
                  v.userImage.InfoImage.newFileCID,
                  v.userImage.InfoImage.metadata.properties.name
                );
              } else {
                setImageIPFS1(getDefaultAvatar());
              }
              break;
            }
          }
          setCollabCount(pod.collabUserData.length);
        }
      }
    }
  }, [pod, ipfs]);

  const getImageIPFS = async (cid: string, fileName: string) => {
    if (cid && cid !== '' && fileName && fileName !== '') {
      let files = await onGetNonDecrypt(
        cid,
        fileName,
        (fileCID, fileName, download) =>
          downloadWithNonDecryption(fileCID, fileName, download)
      );

      if (files) {
        let base64String = _arrayBufferToBase64(files.buffer);
        if (fileName?.slice(-4) === '.gif') {
          setImageIPFS('data:image/gif;base64,' + base64String);
        } else {
          setImageIPFS('data:image/png;base64,' + base64String);
        }
      } else {
        setImageIPFS(getDefaultBGImage());
      }
    } else {
      setImageIPFS(processImage(pod.imageUrl) || getDefaultBGImage());
    }
  };

  const getImageIPFS1 = async (cid: string, fileName: string) => {
    if (cid && cid !== '' && fileName && fileName !== '') {
      let files = await onGetNonDecrypt(
        cid,
        fileName,
        (fileCID, fileName, download) =>
          downloadWithNonDecryption(fileCID, fileName, download)
      );

      if (files) {
        let base64String = _arrayBufferToBase64(files.buffer);
        if (fileName?.slice(-4) === '.gif') {
          setImageIPFS1('data:image/gif;base64,' + base64String);
        } else {
          setImageIPFS1('data:image/png;base64,' + base64String);
        }
      } else {
        setImageIPFS1(getDefaultAvatar());
      }
    } else {
      setImageIPFS1(getDefaultAvatar());
    }
  };

  // const handleFruit = (type) => {
  //   if (
  //     podData.fruits
  //       ?.filter((f) => f.fruitId === type)
  //       ?.find((f) => f.userId === user.id)
  //   ) {
  //     showAlertMessage('You had already given this fruit.', {
  //       variant: 'info'
  //     });
  //     return;
  //   }
  //   musicDaoFruitPod(user.id, podData.id, type).then((res) => {
  //     if (res.success) {
  //       const itemCopy = { ...podData };
  //       itemCopy.fruits = [
  //         ...(itemCopy.fruits || []),
  //         { userId: user.id, fruitId: type, date: new Date().getTime() }
  //       ];
  //       setPodData(itemCopy);
  //     }
  //   });
  // };

  const handleToggleCollabMenu = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenCollabList((prevOpen) => !prevOpen);
  };

  const handleCloseCollabMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    if (
      anchorCollabsRef.current &&
      anchorCollabsRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpenCollabList(false);
  };

  function handleListKeyDownCollabMenu(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenCollabList(false);
    }
  }

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        {isLoading ? (
          <div className={styles.podImage} ref={parentNode} onClick={() => {}}>
            <SkeletonBox
              loading
              width={1}
              height={1}
              style={{
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden'
              }}
            />
          </div>
        ) : (
          <div
            className={styles.podImage}
            ref={parentNode}
            onClick={() => {
              history.push(`/capsules/${podData.id}`);
            }}
          >
            <SkeletonBox
              loading={!imageIPFS}
              image={imageIPFS}
              width={1}
              height={1}
              style={{
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden'
              }}
            />
          </div>
        )}

        {!isLoading && (
          <>
            <div
              onClick={handleToggleCollabMenu}
              ref={anchorCollabsRef}
              style={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                left: 8
              }}
            >
              <Box position="relative" height="32px" width="32px">
                <SkeletonBox
                  className={styles.avatar}
                  loading={false}
                  image={podData.creatorImageUrl ?? getDefaultAvatar()}
                  style={{
                    position: 'absolute',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                />
                {podData.artistType === 'Label' && (
                  <SkeletonBox
                    className={styles.avatar}
                    loading={false}
                    image={podData.labelArtistImageUrl ?? getDefaultAvatar()}
                    style={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      width: 22,
                      height: 22,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: 'pointer',
                      border: '2px solid #ffffff'
                    }}
                  />
                )}
              </Box>
              {collabCount > 1 && (
                <SkeletonBox
                  className={styles.avatar1}
                  loading={!imageIPFS1}
                  image={imageIPFS1}
                  style={{
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer'
                  }}
                />
              )}
              {collabCount > 2 && (
                <Box className={styles.avatarPlus}>+{collabCount - 2}</Box>
              )}
              <Box className={styles.socialButtonBox}>
                {podData.creatorTwitter && (
                  <Box
                    className={styles.socialButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      window.open(
                        `https://twitter.com/${podData.creatorTwitter}`,
                        '_blank'
                      );
                    }}
                  >
                    <img
                      src={require('assets/icons/social_twitter.webp')}
                      alt="twitter"
                    />
                  </Box>
                )}
                {podData?.creatorInstagram && (
                  <Box
                    className={styles.socialButton}
                    onClick={(event) => {
                      event.stopPropagation();
                      window.open(
                        `https://www.instagram.com/${podData?.creatorInstagram}`,
                        '_blank'
                      );
                    }}
                  >
                    <img
                      src={require('assets/icons/social_instagram.webp')}
                      alt="instagram"
                    />
                  </Box>
                )}
              </Box>
            </div>
            {openCollabList && (
              <Popper
                open={openCollabList}
                anchorEl={anchorCollabsRef.current}
                transition
                disablePortal={false}
                placement="bottom"
                style={{ position: 'inherit', zIndex: 1 }}
              >
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <Paper className={styles.collabList}>
                      <ClickAwayListener onClickAway={handleCloseCollabMenu}>
                        <MenuList
                          autoFocusItem={openCollabList}
                          id="pod-card_collabs-list-grow"
                          onKeyDown={handleListKeyDownCollabMenu}
                        >
                          <div
                            style={{
                              color: '#707582',
                              margin: '20px 30px 10px',
                              fontSize: '16px'
                            }}
                          >
                            All artists
                          </div>
                          {pod.artistType === 'Label' && (
                            <MenuItem
                              className={styles.collabItem}
                              onClick={() =>
                                history.push(`/profile/${pod.creatorUrlSlug}`)
                              }
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                width={1}
                              >
                                <Box display="flex" alignItems="center">
                                  <SkeletonBox
                                    className={styles.collabAvatar}
                                    loading={false}
                                    image={
                                      pod.creatorImageUrl ?? getDefaultAvatar()
                                    }
                                    style={{
                                      backgroundRepeat: 'no-repeat',
                                      backgroundSize: 'cover',
                                      backgroundPosition: 'center',
                                      cursor: 'pointer'
                                    }}
                                  />
                                  <div
                                    style={{
                                      margin: '0 50px 0 15px',
                                      color: '#404658'
                                    }}
                                  >
                                    {`${pod.creatorFirstName} ${pod.creatorLastName}`}
                                  </div>
                                </Box>
                                <div style={{ color: '#7E7D95' }}>
                                  {pod.creatorNumFollowers} Followers
                                </div>
                              </Box>
                            </MenuItem>
                          )}
                          {pod.collabUserData?.map((v) => {
                            return (
                              <MenuItem
                                className={styles.collabItem}
                                onClick={() =>
                                  history.push(`/profile/${v.urlSlug}`)
                                }
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  width={1}
                                >
                                  <Box display="flex" alignItems="center">
                                    <SkeletonBox
                                      className={styles.collabAvatar}
                                      loading={false}
                                      image={v.userImage.urlIpfsImage}
                                      style={{
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        cursor: 'pointer'
                                      }}
                                    />
                                    <Box display="flex" flexDirection="column">
                                      {pod.artistType === 'Label' && (
                                        <div
                                          style={{
                                            marginLeft: 15,
                                            color: '#7E7D95',
                                            fontSize: 10,
                                            lineHeight: '12px'
                                          }}
                                        >
                                          Label
                                        </div>
                                      )}
                                      <div
                                        style={{
                                          margin: '0 50px 0 15px',
                                          color: '#404658'
                                        }}
                                      >
                                        {v.firstName + ' ' + v.lastName}
                                      </div>
                                    </Box>
                                  </Box>
                                  <div style={{ color: '#7E7D95' }}>
                                    {v.numFollowers} Followers
                                  </div>
                                </Box>
                              </MenuItem>
                            );
                          })}
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
            {/* {isSignedin && (
              <Box className={styles.socialButtons}>
                <FruitSelect
                  fruitObject={podData}
                  parentNode={parentNode.current}
                  onGiveFruit={handleFruit}
                />
              </Box>
            )} */}
          </>
        )}
      </Box>

      <Box
        className={styles.podInfo}
        onClick={() => {
          if (!isLoading) history.push(`/capsules/${podData.id}`);
        }}
      >
        {isLoading ? (
          <Box p={2}>
            <Box mb={1.5}>
              <SkeletonBox loading width="70%" height="30px" />
            </Box>
            <Box mb={1.5}>
              <SkeletonBox loading width="50%" height="30px" />
            </Box>
            <Box mt={4} mb={1.5}>
              <SkeletonBox loading width="100%" height="30px" />
            </Box>
            <Box mb={1.5}>
              <SkeletonBox loading width="100%" height="30px" />
            </Box>
            <SkeletonBox loading width="100%" height="30px" />
          </Box>
        ) : (
          <>
            <Box className={styles.podInfoName}>{podData.name}</Box>
            <Box className={styles.podMainInfo}>
              <Box display="flex">
                <Box
                  className={
                    podData.withFunding === false
                      ? styles.noFundingBox
                      : podData.status === 'Funding'
                      ? styles.orangeBox
                      : podData.status === 'Funding Failed'
                      ? styles.redBox
                      : styles.blueBox
                  }
                  style={{ fontWeight: 'bold' }}
                  px={1}
                  pt={0.5}
                >
                  {podData.withFunding === false
                    ? 'Song NFT' //'Collaborative (No Funding)'
                    : podData.status}
                </Box>
              </Box>
              <Box>
                {podData.withFunding === false ? (
                  <>
                    <Box className={styles.divider} />
                    <Box className={styles.flexBox}>
                      <Box style={{ marginRight: '10px', fontWeight: 'bold' }}>
                        Songs on Capsule
                      </Box>
                      <Box style={{ color: 'black' }}>
                        {podData.songCount || 0}
                      </Box>
                    </Box>
                    <Box className={styles.divider} />
                    <Box className={styles.flexBox}>
                      <Box style={{ marginRight: '10px', fontWeight: 'bold' }}>
                        NFTs on Sale
                      </Box>
                      <Box
                        style={{
                          color: '#0D59EE',
                          fontWeight: 'bold'
                        }}
                      >
                        {nftsOfSale}
                        {/* {podData.TotalSupplyPod ||
                          podData.copyrightTokenSupply ||
                          0} */}
                      </Box>
                    </Box>
                    {/* <Box className={styles.divider} />
                    <Box className={styles.flexBox} height={'43px'}>
                      <Box style={{ marginRight: '10px', fontWeight: 'bold' }}>
                        Revenue From Sales
                      </Box>
                      <Box
                        style={{
                          color: Color.MusicDAODeepGreen,
                          fontWeight: 'bold'
                        }}
                      >
                        ${revenue} {podData.FundingToken}
                      </Box>
                    </Box> */}
                  </>
                ) : (
                  <>
                    {podData.status === 'Funding' ||
                    podData.status === 'Sold out' ? (
                      <>
                        <Box className={styles.divider} />
                        <Box className={styles.flexBox}>
                          <Box
                            style={{ marginRight: '10px', fontWeight: 'bold' }}
                          >
                            {podData.status === 'Funding'
                              ? 'End of funding'
                              : 'Release in'}
                          </Box>
                          <Box style={{ color: 'black' }}>
                            <>
                              <span style={{ color: Color.MusicDAODeepGreen }}>
                                {fundingEndTime.days
                                  ? `${String(fundingEndTime.days).padStart(
                                      2,
                                      '0'
                                    )}days `
                                  : ''}
                              </span>
                              {`${String(fundingEndTime.hours).padStart(
                                2,
                                '0'
                              )}h ${String(fundingEndTime.minutes).padStart(
                                2,
                                '0'
                              )}min ${String(fundingEndTime.seconds).padStart(
                                2,
                                '0'
                              )}s`}
                            </>
                          </Box>
                        </Box>

                        <Box className={styles.divider} />
                        <Box className={styles.flexBox}>
                          <Box
                            style={{ marginRight: '10px', fontWeight: 'bold' }}
                          >
                            Raised Amount
                          </Box>
                          <Box style={{ color: 'black' }}>
                            <>
                              <span
                                style={{
                                  color: Color.MusicDAODeepGreen,
                                  fontWeight: 'bold'
                                }}
                              >
                                {`$${podData.RaisedFunds || 0}`}
                              </span>
                              {` / $${podData.FundingTarget || 0}`}
                            </>
                          </Box>
                          {/* <Box style={{ color: Color.MusicDAODeepGreen, fontWeight: "bold" }}>
                            ${podData.RaisedFunds || 0}
                          </Box> */}
                        </Box>

                        <Box className={styles.divider} />
                        <Box className={styles.podMainInfoContent}>
                          <Box>
                            <span>Price per Fraction</span>
                            <p>
                              {formatNumber(
                                convertTokenToUSD(
                                  podData.FundingToken,
                                  podData.FundingPrice &&
                                    podData.FundingPrice !== -1
                                    ? podData.FundingPrice
                                    : 0
                                ),
                                'USD',
                                2
                              )}
                            </p>
                          </Box>
                          <Box>
                            <span>Total shares offered</span>
                            <p style={{ textAlign: 'right' }}>
                              {podData.InvestorShare ?? 0}%
                            </p>
                          </Box>
                        </Box>
                      </>
                    ) : null}
                    {podData.status === 'Funding Failed' ? (
                      <>
                        <Box className={styles.divider} />
                        <Box className={styles.flexBox}>
                          <Box
                            style={{ marginRight: '10px', fontWeight: 'bold' }}
                          >
                            End of funding
                          </Box>
                          <Box style={{ color: 'black' }}>
                            <>
                              <span style={{ color: Color.MusicDAODeepGreen }}>
                                0 days
                              </span>{' '}
                              0 min 0 s
                            </>
                          </Box>
                        </Box>

                        <Box className={styles.divider} />
                        <Box className={styles.flexBox}>
                          <Box
                            style={{ marginRight: '10px', fontWeight: 'bold' }}
                          >
                            Raised Amount
                          </Box>
                          <Box style={{ color: 'black' }}>
                            <>
                              <span
                                style={{ color: Color.Red, fontWeight: 'bold' }}
                              >
                                {`$${podData.RaisedFunds || 0}`}
                              </span>
                              {` / $${podData.FundingTarget || 0}`}
                            </>
                          </Box>
                        </Box>

                        <Box className={styles.divider} />
                        <Box className={styles.podMainInfoContent}>
                          <Box>
                            <span>Price per Fraction</span>
                            <p>
                              {formatNumber(
                                convertTokenToUSD(
                                  podData.FundingToken,
                                  podData.FundingPrice &&
                                    podData.FundingPrice !== -1
                                    ? podData.FundingPrice
                                    : 0
                                ),
                                'USD',
                                2
                              )}
                            </p>
                          </Box>
                          <Box>
                            <span>Total shares offered</span>
                            <p style={{ textAlign: 'right' }}>
                              {podData.InvestorShare ?? 0}%
                            </p>
                          </Box>
                        </Box>
                      </>
                    ) : null}
                    {podData.status === 'Funded' ? (
                      <>
                        <Box className={styles.divider} />
                        <Box className={styles.flexBox}>
                          <Box
                            style={{ marginRight: '10px', fontWeight: 'bold' }}
                          >
                            Songs in Capsule
                          </Box>
                          <Box style={{ color: 'black' }}>
                            {podData.songCount || 0}
                          </Box>
                        </Box>

                        <Box className={styles.divider} />
                        <Box className={styles.flexBox}>
                          <Box
                            style={{ marginRight: '10px', fontWeight: 'bold' }}
                          >
                            Raised Amount
                          </Box>
                          <Box style={{ color: 'black' }}>
                            <>
                              <span
                                style={{
                                  color: Color.MusicDAODeepGreen,
                                  fontWeight: 'bold'
                                }}
                              >
                                {`$${podData.RaisedFunds || 0}`}
                              </span>
                              {` / $${podData.FundingTarget || 0}`}
                            </>
                          </Box>
                        </Box>

                        <Box className={styles.divider} />
                        <Box className={styles.podMainInfoContent}>
                          <Box>
                            {/* <span>Price per Fraction</span>
                  <p>
                    {formatNumber(
                      convertTokenToUSD(
                        podData.FundingToken,
                        podData.FundingPrice && podData.FundingPrice !== -1 ? podData.FundingPrice : 0
                      ),
                      "USD",
                      2
                    )}
                  </p> */}
                          </Box>
                          <Box>
                            <span>Total shares offered</span>
                            <p style={{ textAlign: 'right' }}>
                              {podData.InvestorShare ?? 0}%
                            </p>
                          </Box>
                        </Box>
                      </>
                    ) : null}

                    {podData.released || podData.investing ? (
                      <>
                        <Box className={styles.divider} />
                        <Box className={styles.flexBox}>
                          <Box>
                            {podData.released
                              ? 'Total staked:'
                              : podData.investing
                              ? podData.status === 'Funding'
                                ? 'End of funding'
                                : 'Release in'
                              : 'Release date'}
                          </Box>
                          <Box style={{ color: 'black' }}>
                            {podData.released ? (
                              `$${podData.totalStaked ?? 0}`
                            ) : podData.investing ? (
                              <>
                                <span
                                  style={{ color: Color.MusicDAODeepGreen }}
                                >
                                  {fundingEndTime.days
                                    ? `${String(fundingEndTime.days).padStart(
                                        2,
                                        '0'
                                      )}days `
                                    : ''}
                                </span>
                                {`${String(fundingEndTime.hours).padStart(
                                  2,
                                  '0'
                                )}h ${String(fundingEndTime.minutes).padStart(
                                  2,
                                  '0'
                                )}min ${String(fundingEndTime.seconds).padStart(
                                  2,
                                  '0'
                                )}s`}
                              </>
                            ) : (
                              'Unknown'
                            )}
                          </Box>
                        </Box>
                      </>
                    ) : null}
                    {podData.Reproductions ? (
                      <>
                        <Box className={styles.divider} />
                        <Box className={styles.flexBox}>
                          <Box>Reproductions:</Box>
                          <Box style={{ color: 'black' }}>
                            {podData.Reproductions ?? 0}
                          </Box>
                        </Box>
                      </>
                    ) : null}
                    {podData.InvestorDivident ? (
                      <>
                        <Box className={styles.divider} />
                        <Box className={styles.podMainInfoContent}>
                          <Box>
                            <span>Price per Fraction</span>
                            <p>
                              {formatNumber(
                                convertTokenToUSD(
                                  podData.FundingToken,
                                  podData.Price
                                ),
                                'USD',
                                2
                              )}
                            </p>
                          </Box>
                          <Box>
                            <span>Total shares offered</span>
                            <p>{(podData.InvestorDivident ?? 0) * 100}%</p>
                          </Box>
                        </Box>
                      </>
                    ) : null}
                  </>
                )}
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
