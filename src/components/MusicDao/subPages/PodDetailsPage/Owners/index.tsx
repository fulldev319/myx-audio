import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import { ownersStyles } from './index.styles';
// import { Gradient, PrimaryButton } from 'shared/ui-kit';
import Avatar from 'shared/ui-kit/Avatar';
import {
  musicDaoGetTopOwners,
  musicDaoGetRecentPodSales
} from 'shared/services/API';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { LoadingWrapper } from 'shared/ui-kit/Hocs';
import { regularPatterns, premiumPatterns } from '../WorkSpace';

const planetsStyles: any[] = [
  {
    background: `url(${require('assets/planets/planet9.webp')})`,
    position: 'absolute',
    top: '55%',
    left: '65%',
    width: 80,
    height: 80,
    backgroundSize: 'contain'
  },
  {
    background: `url(${require('assets/planets/planet8.webp')})`,
    position: 'absolute',
    top: '70%',
    left: '40%',
    width: 70,
    height: 70,
    backgroundSize: 'contain'
  },
  {
    background: `url(${require('assets/planets/planet7.webp')})`,
    position: 'absolute',
    top: '45%',
    left: '30%',
    width: 60,
    height: 60,
    backgroundSize: 'contain'
  },
  {
    background: `url(${require('assets/planets/planet6.webp')})`,
    position: 'absolute',
    top: '16%',
    left: '35%',
    width: 50,
    height: 50,
    backgroundSize: 'contain'
  },
  {
    background: `url(${require('assets/planets/planet5.webp')})`,
    position: 'absolute',
    top: '14%',
    left: '47%',
    width: 35,
    height: 35,
    backgroundSize: 'contain'
  },
  {
    background: `url(${require('assets/planets/planet4.webp')})`,
    position: 'absolute',
    top: '40%',
    left: '55%',
    width: 40,
    height: 40,
    backgroundSize: 'contain'
  },
  {
    background: `url(${require('assets/planets/planet3.webp')})`,
    position: 'absolute',
    top: '27%',
    left: '65%',
    width: 30,
    height: 30,
    backgroundSize: 'contain'
  },
  {
    background: `url(${require('assets/planets/planet2.webp')})`,
    position: 'absolute',
    top: '25%',
    left: '55%',
    width: 30,
    height: 30,
    backgroundSize: 'contain'
  },
  {
    background: `url(${require('assets/planets/planet1.webp')})`,
    position: 'absolute',
    top: '30%',
    left: '50%',
    width: 20,
    height: 20,
    backgroundSize: 'contain'
  }
];

export default function Owners({ podId, pod }) {
  const history = useHistory();
  const classes = ownersStyles();
  const [topOwners, setTopOwners] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  React.useEffect(() => {
    musicDaoGetTopOwners(podId)
      .then((res) => {
        if (res.success) setTopOwners(res.data);
      })
      .catch((e) => {});
    musicDaoGetRecentPodSales(podId)
      .then((res) => {
        if (res.success) setRecentSales(res.data);
      })
      .catch((e) => {});
  }, [podId]);

  return (
    <Box my={2}>
      <LoadingWrapper loading={!topOwners}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Box className={classes.ownersPane}>
              <Box className={classes.title}>Top Owners</Box>
              <Box flex={1} className={classes.planetsPane}>
                {topOwners?.map((_, index) => (
                  <Box
                    className={classes.planet}
                    style={planetsStyles[index]}
                    key={`planet_${index}`}
                    onClick={() => setSelectedIndex(index)}
                  />
                ))}
              </Box>
              {/* <PrimaryButton
                size="small"
                isRounded
                style={{ background: Gradient.Green1, width: '100%' }}
                onClick={() => {}}
              >
                SEE ALL OWNERS
              </PrimaryButton> */}
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            style={{ display: 'flex', flexDirection: 'column' }}
          >
            {selectedIndex > -1 && (
              <Box className={classes.ownerCard} mb={2}>
                <Box display="flex" alignItems="center" padding={2}>
                  <Avatar
                    size={40}
                    rounded
                    bordered
                    image={
                      topOwners![selectedIndex].urlIpfsImage ??
                      getDefaultAvatar()
                    }
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      topOwners![selectedIndex]?.urlSlug &&
                      history.push(
                        `/profile/${topOwners![selectedIndex].urlSlug}`
                      )
                    }
                  />
                  <Box ml={1} style={{ overflow: 'hidden' }}>
                    <Box
                      className={classes.ownerName}
                      onClick={() =>
                        topOwners![selectedIndex]?.urlSlug &&
                        history.push(
                          `/profile/${topOwners![selectedIndex].urlSlug}`
                        )
                      }
                    >{`${topOwners![selectedIndex].firstName} ${
                      topOwners![selectedIndex].lastName
                    }`}</Box>
                    {topOwners![selectedIndex].socials &&
                      Object.values(topOwners![selectedIndex].socials).find(
                        (v) => !!v
                      ) && (
                        <Box className={classes.socialBox}>
                          {topOwners![selectedIndex].socials?.twitter && (
                            <Box
                              className={classes.socialButton}
                              onClick={() => {
                                window.open(
                                  `https://twitter.com/${
                                    topOwners![selectedIndex].socials?.twitter
                                  }`,
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
                          {topOwners![selectedIndex].socials?.instagram && (
                            <Box
                              className={classes.socialButton}
                              onClick={() => {
                                window.open(
                                  `https://www.instagram.com/${
                                    topOwners![selectedIndex].socials?.instagram
                                  }`,
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
                          {topOwners![selectedIndex].socials?.tiktok && (
                            <Box
                              className={classes.socialButton}
                              onClick={() => {
                                window.open(
                                  `https://www.tiktok.com/${
                                    topOwners![selectedIndex].socials?.tiktok
                                  }`,
                                  '_blank'
                                );
                              }}
                            >
                              <img
                                src={require('assets/snsIcons/tiktok_round.webp')}
                                alt="tiktok"
                              />
                            </Box>
                          )}
                          {topOwners![selectedIndex].socials?.youtube && (
                            <Box
                              className={classes.socialButton}
                              onClick={() => {
                                window.open(
                                  `https://www.youtube.com/user/${
                                    topOwners![selectedIndex].socials?.youtube
                                  }`,
                                  '_blank'
                                );
                              }}
                            >
                              <img
                                src={require('assets/snsIcons/youtube_round.webp')}
                                alt="youtube"
                              />
                            </Box>
                          )}
                        </Box>
                      )}
                  </Box>
                </Box>
                <Box className={classes.ownerValueBox}>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <Box className={classes.ownerLabel}>Current Rank</Box>
                      <Box className={classes.ownerValue}>
                        #{selectedIndex + 1}
                      </Box>
                    </Box>
                    <Box mx={1}>
                      <Box className={classes.ownerLabel}>Score</Box>
                      <Box className={classes.ownerValue}>
                        {topOwners![selectedIndex].score ?? 0} pts.
                      </Box>
                    </Box>
                    <Box>
                      <Box className={classes.ownerLabel}>NFTs</Box>
                      <Box className={classes.ownerValue}>
                        {topOwners![selectedIndex].nfts ?? 0}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    mt={2}
                    pt={2}
                    style={{ borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}
                  >
                    <Box display="flex" alignItems="center">
                      <Box className={classes.ownerLabel}>Category</Box>
                      {topOwners![selectedIndex].category?.charAt(0) ===
                        '1' && (
                        <Box
                          className={classes.polygon}
                          style={{
                            background:
                              'linear-gradient(180deg, #F7D36D 0%, #F98F12 100%)'
                          }}
                          ml={2}
                        />
                      )}
                      {topOwners![selectedIndex].category?.charAt(1) ===
                        '1' && (
                        <Box
                          className={classes.polygon}
                          style={{
                            background:
                              'linear-gradient(180deg, #C4C4C4 0%, #F7F7F7 100%)'
                          }}
                          ml={1}
                        />
                      )}
                      {topOwners![selectedIndex].category?.charAt(2) ===
                        '1' && (
                        <Box
                          className={classes.polygon}
                          style={{
                            background:
                              'linear-gradient(180deg, #FAC17E 0%, #CE8024 100%)'
                          }}
                          ml={1}
                        />
                      )}
                      {topOwners![selectedIndex].category?.charAt(3) ===
                        '1' && (
                        <Box
                          className={classes.polygon}
                          style={{
                            background:
                              'linear-gradient(180deg, #FAC17E 0%, #CE8024 100%)'
                          }}
                          ml={1}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>
              </Box>
            )}
            <Box className={classes.whiteBox} flex={1}>
              <Box className={classes.offerTitle}>Recent Sales</Box>
              <Box className={classes.offerTable}>
                {recentSales.map((sale) => (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    py={2}
                    style={{ borderBottom: '1px solid #00000022' }}
                    key={`sale-${sale.txnHash}`}
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        sale.user?.urlSlug &&
                          history.push(`/profile/${sale.user.urlSlug}`);
                      }}
                    >
                      <Avatar
                        size={31}
                        rounded
                        bordered
                        image={sale.user.urlIpfsImage ?? getDefaultAvatar()}
                      />
                      <Box className={classes.offerName} ml={1}>
                        {`${sale.user.firstName} ${sale.user.lastName}`}
                      </Box>
                    </Box>
                    <Box className={classes.offerValue} mx={1}>
                      {`${sale.price / 1000000} USDT`}
                    </Box>
                    <div
                      className={classes.editionBall}
                      style={{
                        background:
                          pod?.Medias[Number(sale.media ?? '0')]
                            .quantityPerEdition.length === 1
                            ? regularPatterns[Number(sale.edition ?? '0')].bg
                            : premiumPatterns[Number(sale.edition ?? '0')].bg
                      }}
                    />
                    <Box
                      onClick={() => {
                        window.open(
                          `https://${
                            process.env.REACT_APP_ENV !== 'prod'
                              ? 'mumbai.'
                              : ''
                          }polygonscan.com/tx/${sale.txnHash}`,
                          '_blank'
                        );
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <PolygonIcon />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </LoadingWrapper>
    </Box>
  );
}

const PolygonIcon = () => (
  <svg
    width="23"
    height="20"
    viewBox="0 0 23 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.3888 6.27468C17.1703 6.15256 16.9242 6.08845 16.6738 6.08845C16.4235 6.08845 16.1774 6.15256 15.9589 6.27468L12.6784 8.17742L10.4494 9.41834L7.16907 11.3211C6.95054 11.4431 6.70442 11.5072 6.45413 11.5072C6.20385 11.5072 5.95773 11.4431 5.7392 11.3211L3.13158 9.83198C2.91942 9.71032 2.74221 9.53601 2.61705 9.32589C2.4919 9.11576 2.42304 8.87692 2.41711 8.63243V5.69559C2.41417 5.44924 2.47934 5.20686 2.60541 4.99519C2.73148 4.78352 2.91356 4.61079 3.13158 4.49603L5.69708 3.0483C5.91561 2.92628 6.16173 2.86223 6.41202 2.86223C6.6623 2.86223 6.90843 2.92628 7.12696 3.0483L9.69246 4.49603C9.90462 4.6177 10.0818 4.79201 10.207 5.00213C10.3321 5.21225 10.401 5.45109 10.4069 5.69559V7.59833L12.6359 6.31605V4.41331C12.6388 4.16695 12.5737 3.92458 12.4476 3.71291C12.3215 3.50124 12.1394 3.3285 11.9214 3.21375L7.16907 0.483922C6.95054 0.361907 6.70442 0.297852 6.45413 0.297852C6.20385 0.297852 5.95773 0.361907 5.7392 0.483922L0.902063 3.21394C0.684078 3.32868 0.502012 3.50138 0.375942 3.71302C0.249872 3.92465 0.184694 4.16699 0.187595 4.41331V9.91471C0.184659 10.1611 0.24982 10.4034 0.375893 10.6151C0.501965 10.8268 0.684049 10.9995 0.902063 11.1143L5.73863 13.8443C5.95716 13.9663 6.20328 14.0304 6.45357 14.0304C6.70386 14.0304 6.94998 13.9663 7.16851 13.8443L10.4489 11.9829L12.6778 10.7006L15.9583 8.83925C16.1768 8.71713 16.423 8.65301 16.6733 8.65301C16.9236 8.65301 17.1697 8.71713 17.3882 8.83925L19.9537 10.287C20.1659 10.4087 20.3431 10.583 20.4682 10.7931C20.5934 11.0032 20.6622 11.242 20.6682 11.4865V14.4234C20.6711 14.6697 20.606 14.9121 20.4799 15.1238C20.3538 15.3354 20.1717 15.5082 19.9537 15.6229L17.3882 17.112C17.1697 17.234 16.9236 17.2981 16.6733 17.2981C16.423 17.2981 16.1769 17.234 15.9583 17.112L13.3928 15.6643C13.1807 15.5426 13.0035 15.3683 12.8783 15.1582C12.7532 14.9481 12.6843 14.7092 12.6784 14.4647V12.5618L10.4494 13.8441V15.7468C10.4465 15.9932 10.5116 16.2356 10.6377 16.4472C10.7638 16.6589 10.9459 16.8316 11.1639 16.9464L16.0005 19.6764C16.219 19.7984 16.4651 19.8625 16.7154 19.8625C16.9657 19.8625 17.2118 19.7984 17.4303 19.6764L22.2669 16.9464C22.4791 16.8247 22.6563 16.6504 22.7814 16.4403C22.9066 16.2302 22.9754 15.9913 22.9814 15.7468V10.2456C22.9843 9.99927 22.9191 9.75689 22.7931 9.54522C22.667 9.33355 22.4849 9.16082 22.2669 9.04607L17.3888 6.27468Z"
      fill="#8247E5"
    />
  </svg>
);
