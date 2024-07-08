import React, { useState } from 'react';
import Carousel from 'react-spring-3d-carousel';

import Box from 'shared/ui-kit/Box';
import { PrimaryButton } from 'shared/ui-kit';
import {
  getDefaultBGImage,
  getDefaultAvatar
} from 'shared/services/user/getUserAvatar';
import Avatar from 'shared/ui-kit/Avatar';
import BuyNFTModal from 'components/MusicDao/modals/BuyNFTModal';
import { investmentStyles } from './index.styles';

const Fake_Data = [
  require('assets/backgrounds/profile/profile_bg_001.webp'),
  require('assets/backgrounds/profile/profile_bg_002.webp'),
  require('assets/backgrounds/profile/profile_bg_003.webp'),
  require('assets/backgrounds/profile/profile_bg_004.webp'),
  require('assets/backgrounds/profile/profile_bg_005.webp')
];

const Investments = ({ pod, podInfo, handleRefresh }) => {
  const classes = investmentStyles();

  const [openBuyNFTModal, setOpenBuyNFTModal] = useState(false);
  const [topInvestors, setTopInvestors] = useState<any[]>([]);
  const [currentSlider, setCurrentSlider] = useState<number>(0);
  const [isSold, setIsSold] = useState<boolean>(true);

  return (
    <Box className={classes.investmentTab}>
      <Box display={'flex'} alignContent="center">
        <Box className={classes.typo1} mr={2}>
          Investment
        </Box>
        <Box className={classes.addressSection}>
          <Box className={classes.typo2} mr={1.2}>
            Contract Address
          </Box>
          <img
            src={require('assets/musicDAOImages/ether_scan.webp')}
            width={15}
            height={14}
          />
        </Box>
      </Box>
      <Box className={classes.totalAmountSection}>
        <img
          src={require('assets/musicDAOImages/music-green3.webp')}
          style={{
            position: 'absolute'
          }}
        />
        <Box display={'flex'} flexDirection="column" width={1}>
          <Box className={classes.typo3} textAlign="center">
            Total Raised Amount
          </Box>
          <Box className={classes.typo4} textAlign="center" mt={1}>
            $12213.868
          </Box>
        </Box>
        <img
          src={require('assets/musicDAOImages/music-blur.webp')}
          style={{
            position: 'absolute',
            right: 40
          }}
        />
      </Box>
      <Box className={classes.priceSection}>
        <img src={getDefaultBGImage()} width={177} height={177} />
        <Box display={'flex'} flexDirection="column" width={1} ml={3}>
          <Box display="flex" justifyContent="space-between">
            <Box display={'flex'} flexDirection="column">
              <Box className={classes.lineBarBox}>
                <Box className={classes.innerLineBarBox} />
              </Box>
              <Box display={'flex'} alignItems="center" mt={5}>
                <Box display={'flex'} flexDirection="column">
                  <Box className={classes.typo5}>NFTs For Sale</Box>
                  <Box className={classes.typo6}>
                    32/<span>245</span>
                  </Box>
                </Box>
                <Box height={'42px'} width={'1px'} bgcolor="#ffffff80" mx={5} />
                <Box display={'flex'} flexDirection="column">
                  <Box className={classes.typo5}>Price per NFT</Box>
                  <Box className={classes.typo6}>$1213.868</Box>
                </Box>
              </Box>
            </Box>
            {isSold && (
              <img
                src={require('assets/icons/stamp_sold.webp')}
                alt="sold-stamp"
                className={classes.stampImg}
              />
            )}
            <PrimaryButton
              size="medium"
              disabled={isSold}
              style={{
                background: '#2D3047',
                width: 250,
                height: 50,
                borderRadius: '100px'
              }}
              onClick={() => setOpenBuyNFTModal(true)}
            >
              INVEST
            </PrimaryButton>
          </Box>
          <Box height={'1px'} width={1} bgcolor="#ffffff40" my={1} />
          <Box className={classes.typo7}>Represents 20% Share of pod</Box>
        </Box>
      </Box>
      <Box display={'flex'} mt={3}>
        <Box className={classes.investorsBox}>
          <Box className={classes.typo11} textAlign="center" mt={5}>
            Top Investors
          </Box>
          <Box mt={8} position="relative">
            {topInvestors && topInvestors.length > 0 ? (
              <>
                <div className={classes.carouselWrapper}>
                  <Carousel
                    slides={topInvestors.map((item, index) => ({
                      key: index,
                      content: <img src={item} alt="image" />
                    }))}
                    goToSlide={currentSlider}
                    showNavigation={false}
                    offsetRadius={3}
                  />
                </div>
                <Box
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    top: 90,
                    left: 100,
                    padding: '14px 14px 9px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 20
                  }}
                  onClick={() => setCurrentSlider((prev) => prev - 1)}
                >
                  <ArrowIcon />
                </Box>
                <Box
                  style={{
                    transform: 'scaleX(-1)',
                    cursor: 'pointer',
                    position: 'absolute',
                    top: 90,
                    right: 100,
                    padding: '14px 14px 9px',
                    background: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 20
                  }}
                  onClick={() => setCurrentSlider((prev) => prev + 1)}
                >
                  <ArrowIcon />
                </Box>
              </>
            ) : (
              <Box display="flex" justifyContent="center" mt={6}>
                No Data
              </Box>
            )}
          </Box>
        </Box>
        <Box display="flex" flexDirection={'column'} width={'40%'}>
          <Box className={classes.profileSection}>
            <Box
              display={'flex'}
              p={5}
              style={{
                background:
                  ' linear-gradient(90deg, #7BC5F5 0%, #A1C1F6 100%), #C4C4C4',
                borderRadius: '19px 19px 0px 0px'
              }}
            >
              <Avatar size={79} rounded bordered image={getDefaultAvatar()} />
              <Box display="flex" flexDirection={'column'} ml={3}>
                <Box className={classes.typo8} mb={1}>
                  #ajfkr845mvklo498b6
                </Box>
                <Box
                  display={'flex'}
                  p={'8px 8px 0px'}
                  borderRadius={'8px'}
                  bgcolor="#fff"
                  width="fit-content"
                >
                  <TwitterIcon />
                  <Box ml={1.5}>
                    <InstagramIcon />
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              display={'flex'}
              flexDirection="column"
              p={5}
              style={{
                background: '#fff',
                borderRadius: '0px 0px 19px 19px'
              }}
            >
              <Box display={'flex'} alignItems="center">
                <Box display={'flex'} flexDirection="column" mr={6}>
                  <Box className={classes.typo9} mb={1}>
                    Current Rank
                  </Box>
                  <Box className={classes.typo10} mb={1}>
                    #1350
                  </Box>
                </Box>
                <Box display={'flex'} flexDirection="column">
                  <Box className={classes.typo9} mb={1}>
                    NFTs
                  </Box>
                  <Box className={classes.typo10} mb={1}>
                    234
                  </Box>
                </Box>
              </Box>
              <Box
                width={1}
                height={'1px'}
                bgcolor="rgba(0, 0, 0, 0.1)"
                my={3}
              />
              <Box display={'flex'} alignItems="center">
                <Box className={classes.typo9} mr={1}>
                  Category
                </Box>
                <Box display={'flex'} alignItems="center">
                  <Polygon1Icon />
                  <Box mx={1} pt={0.5}>
                    <Polygon2Icon />
                  </Box>
                  <Polygon1Icon />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box className={classes.recentInvestSection}>
            <Box className={classes.typo11} mb={3}>
              Recent Investments
            </Box>
            <Box
              display={'flex'}
              flexDirection="column"
              height={'350px'}
              overflow="scroll"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((item) => (
                <>
                  <Box
                    display={'flex'}
                    alignItems="center"
                    justifyContent={'space-between'}
                    mt={3}
                  >
                    <Box className={classes.typo9}>10.201 USDT</Box>
                    <Box display={'flex'} alignItems="center">
                      <Avatar size={32} rounded image={getDefaultAvatar()} />
                      <Box className={classes.typo12} ml={1}>
                        @Us3rNxtb00t
                      </Box>
                    </Box>
                    <Box display={'flex'} flexDirection="column">
                      <Box className={classes.typo13}>12/11/2021</Box>
                      <Box className={classes.typo13} mt={1}>
                        10:50pm GMT
                      </Box>
                    </Box>
                  </Box>
                  <Box width={1} height={'1px'} bgcolor="#18181810" mt={3} />
                </>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      {openBuyNFTModal && (
        <BuyNFTModal
          open={openBuyNFTModal}
          onClose={() => setOpenBuyNFTModal(false)}
          refreshPod={handleRefresh}
        />
      )}
    </Box>
  );
};

export default Investments;

const TwitterIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 8.05C0 5.20255 0 3.77882 0.562933 2.69513C1.03731 1.78191 1.78191 1.03731 2.69513 0.562933C3.77882 0 5.20255 0 8.05 0H15.95C18.7975 0 20.2212 0 21.3049 0.562933C22.2181 1.03731 22.9627 1.78191 23.4371 2.69513C24 3.77882 24 5.20255 24 8.05V15.95C24 18.7975 24 20.2212 23.4371 21.3049C22.9627 22.2181 22.2181 22.9627 21.3049 23.4371C20.2212 24 18.7975 24 15.95 24H8.05C5.20255 24 3.77882 24 2.69513 23.4371C1.78191 22.9627 1.03731 22.2181 0.562933 21.3049C0 20.2212 0 18.7975 0 15.95V8.05Z"
      fill="#1EA1F2"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M18.6611 9.07583C18.6669 9.22573 18.6689 9.37557 18.6689 9.52548C18.6689 14.0702 15.4719 19.3169 9.62564 19.3169C7.82978 19.3169 6.1599 18.7445 4.75293 17.7701C5.00164 17.7974 5.25422 17.8179 5.51068 17.8179C6.99969 17.8179 8.37113 17.2658 9.45898 16.3392C8.06816 16.3187 6.89375 15.3171 6.48871 13.9544C6.68316 13.9953 6.8834 14.0158 7.08818 14.0158C7.37694 14.0158 7.6573 13.9749 7.92603 13.8932C6.47061 13.5797 5.37438 12.1898 5.37438 10.5204C5.37438 10.5 5.37438 10.4931 5.37438 10.4795C5.80331 10.7316 6.29426 10.8882 6.81557 10.9087C5.96157 10.2886 5.4002 9.23253 5.4002 8.04013C5.4002 7.41327 5.55653 6.82045 5.83172 6.30943C7.3989 8.39442 9.74193 9.76399 12.3834 9.90708C12.3291 9.65498 12.3013 9.38931 12.3013 9.12357C12.3013 7.22255 13.7244 5.68262 15.4802 5.68262C16.3943 5.68262 17.2199 6.09831 17.7994 6.76606C18.5248 6.61615 19.2044 6.33 19.8194 5.9348C19.581 6.73882 19.0778 7.41324 18.4201 7.83569C19.0636 7.75392 19.6773 7.57009 20.2464 7.29755C19.8194 7.98573 19.2819 8.59206 18.6611 9.07583Z"
      fill="white"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_12368_313829)">
      <path
        d="M0.0136719 8.05C0.0136719 5.20255 0.0136719 3.77882 0.576605 2.69513C1.05098 1.78191 1.79558 1.03731 2.7088 0.562933C3.79249 0 5.21622 0 8.06367 0H15.9637C18.8111 0 20.2349 0 21.3185 0.562933C22.2318 1.03731 22.9764 1.78191 23.4507 2.69513C24.0137 3.77882 24.0137 5.20255 24.0137 8.05V15.95C24.0137 18.7975 24.0137 20.2212 23.4507 21.3049C22.9764 22.2181 22.2318 22.9627 21.3185 23.4371C20.2349 24 18.8111 24 15.9637 24H8.06367C5.21622 24 3.79249 24 2.7088 23.4371C1.79558 22.9627 1.05098 22.2181 0.576605 21.3049C0.0136719 20.2212 0.0136719 18.7975 0.0136719 15.95V8.05Z"
        fill="url(#paint0_radial_12368_313829)"
      />
      <path
        d="M0.0136719 8.05C0.0136719 5.20255 0.0136719 3.77882 0.576605 2.69513C1.05098 1.78191 1.79558 1.03731 2.7088 0.562933C3.79249 0 5.21622 0 8.06367 0H15.9637C18.8111 0 20.2349 0 21.3185 0.562933C22.2318 1.03731 22.9764 1.78191 23.4507 2.69513C24.0137 3.77882 24.0137 5.20255 24.0137 8.05V15.95C24.0137 18.7975 24.0137 20.2212 23.4507 21.3049C22.9764 22.2181 22.2318 22.9627 21.3185 23.4371C20.2349 24 18.8111 24 15.9637 24H8.06367C5.21622 24 3.79249 24 2.7088 23.4371C1.79558 22.9627 1.05098 22.2181 0.576605 21.3049C0.0136719 20.2212 0.0136719 18.7975 0.0136719 15.95V8.05Z"
        fill="url(#paint1_radial_12368_313829)"
      />
      <path
        d="M12.0002 3.27246C9.63009 3.27246 9.33264 3.28282 8.40176 3.32519C7.4727 3.36773 6.83853 3.51482 6.28364 3.73064C5.70966 3.95355 5.22277 4.25173 4.73769 4.73701C4.25225 5.2221 3.95408 5.70901 3.73045 6.28282C3.51409 6.83792 3.36682 7.47228 3.325 8.40101C3.28337 9.33192 3.27246 9.62955 3.27246 11.9997C3.27246 14.3699 3.28301 14.6665 3.32519 15.5974C3.36791 16.5265 3.515 17.1606 3.73063 17.7156C3.95371 18.2896 4.25189 18.7765 4.73714 19.2616C5.22204 19.747 5.70893 20.0459 6.28255 20.2688C6.83781 20.4846 7.47215 20.6317 8.40103 20.6743C9.33191 20.7166 9.62918 20.727 11.9991 20.727C14.3694 20.727 14.6659 20.7166 15.5968 20.6743C16.5259 20.6317 17.1608 20.4846 17.716 20.2688C18.2898 20.0459 18.776 19.747 19.2609 19.2616C19.7463 18.7765 20.0445 18.2896 20.2681 17.7157C20.4827 17.1606 20.6299 16.5263 20.6736 15.5976C20.7154 14.6666 20.7263 14.3699 20.7263 11.9997C20.7263 9.62955 20.7154 9.3321 20.6736 8.40119C20.6299 7.4721 20.4827 6.83791 20.2681 6.28301C20.0445 5.70901 19.7463 5.2221 19.2609 4.73701C18.7754 4.25155 18.29 3.95337 17.7155 3.73064C17.1591 3.51482 16.5246 3.36773 15.5955 3.32519C14.6647 3.28282 14.3683 3.27246 11.9975 3.27246H12.0002ZM11.2173 4.84519C11.4497 4.84482 11.7089 4.84519 12.0002 4.84519C14.3303 4.84519 14.6065 4.85355 15.5266 4.89537C16.3775 4.93428 16.8393 5.07646 17.1469 5.19592C17.5542 5.3541 17.8446 5.54319 18.1498 5.84864C18.4553 6.1541 18.6444 6.44501 18.8029 6.85228C18.9223 7.15955 19.0647 7.62137 19.1034 8.47228C19.1453 9.39228 19.1543 9.66864 19.1543 11.9977C19.1543 14.3268 19.1453 14.6032 19.1034 15.5232C19.0645 16.3741 18.9223 16.8359 18.8029 17.1432C18.6447 17.5505 18.4553 17.8405 18.1498 18.1457C17.8444 18.4512 17.5544 18.6403 17.1469 18.7985C16.8397 18.9185 16.3775 19.0603 15.5266 19.0992C14.6067 19.141 14.3303 19.1501 12.0002 19.1501C9.6699 19.1501 9.39373 19.141 8.47376 19.0992C7.62287 19.0599 7.16107 18.9177 6.85326 18.7983C6.446 18.6401 6.1551 18.451 5.84966 18.1456C5.54421 17.8401 5.35513 17.5499 5.19658 17.1425C5.07713 16.8352 4.93477 16.3734 4.89605 15.5225C4.85423 14.6025 4.84587 14.3261 4.84587 11.9956C4.84587 9.66501 4.85423 9.3901 4.89605 8.4701C4.93496 7.61919 5.07713 7.15737 5.19658 6.84973C5.35476 6.44246 5.54421 6.15155 5.84966 5.8461C6.1551 5.54064 6.446 5.35155 6.85326 5.19301C7.16089 5.07301 7.62287 4.93119 8.47376 4.8921C9.27882 4.85573 9.59082 4.84482 11.2173 4.84301V4.84519ZM16.6586 6.29428C16.0804 6.29428 15.6114 6.76282 15.6114 7.34119C15.6114 7.91937 16.0804 8.38846 16.6586 8.38846C17.2368 8.38846 17.7058 7.91937 17.7058 7.34119C17.7058 6.76301 17.2368 6.29392 16.6586 6.29392V6.29428ZM12.0002 7.51791C9.52518 7.51791 7.51851 9.52464 7.51851 11.9997C7.51851 14.4748 9.52518 16.4806 12.0002 16.4806C14.4752 16.4806 16.4812 14.4748 16.4812 11.9997C16.4812 9.52464 14.475 7.51791 12 7.51791H12.0002ZM12.0002 9.09064C13.6067 9.09064 14.9092 10.393 14.9092 11.9997C14.9092 13.6063 13.6067 14.9088 12.0002 14.9088C10.3935 14.9088 9.09119 13.6063 9.09119 11.9997C9.09119 10.393 10.3935 9.09064 12.0002 9.09064Z"
        fill="white"
      />
    </g>
    <defs>
      <radialGradient
        id="paint0_radial_12368_313829"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(6.3887 25.8485) rotate(-90) scale(23.7858 22.1226)"
      >
        <stop stop-color="#FFDD55" />
        <stop offset="0.1" stop-color="#FFDD55" />
        <stop offset="0.5" stop-color="#FF543E" />
        <stop offset="1" stop-color="#C837AB" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_12368_313829"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(-4.00646 1.72892) rotate(78.6806) scale(10.6323 43.827)"
      >
        <stop stop-color="#3771C8" />
        <stop offset="0.128" stop-color="#3771C8" />
        <stop offset="1" stop-color="#6600FF" stop-opacity="0" />
      </radialGradient>
      <clipPath id="clip0_12368_313829">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const Polygon1Icon = () => (
  <svg
    width="28"
    height="32"
    viewBox="0 0 28 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 0L27.8564 8V24L14 32L0.143594 24V8L14 0Z"
      fill="url(#paint0_linear_12368_313845)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_12368_313845"
        x1="14"
        y1="0"
        x2="14"
        y2="32"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#F7D36D" />
        <stop offset="1" stop-color="#F98F12" />
      </linearGradient>
    </defs>
  </svg>
);

const Polygon2Icon = () => (
  <svg
    width="28"
    height="32"
    viewBox="0 0 28 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14 32L0.143593 24V8L14 0L27.8564 8V24L14 32Z"
      fill="url(#paint0_linear_12368_313846)"
    />
    <path
      d="M27.3564 23.7113L14 31.4226L0.643593 23.7113V8.28868L14 0.577349L27.3564 8.28868V23.7113Z"
      stroke="black"
      strokeOpacity="0.1"
    />
    <defs>
      <linearGradient
        id="paint0_linear_12368_313846"
        x1="14"
        y1="32"
        x2="14"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="#C4C4C4" />
        <stop offset="1" stop-color="#F7F7F7" />
      </linearGradient>
    </defs>
  </svg>
);

const ArrowIcon = () => (
  <svg
    width="23"
    height="19"
    viewBox="0 0 23 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.40438 0.310438C9.08699 0.310438 8.80301 0.431549 8.55244 0.673767L0.697012 8.51667C0.438087 8.75889 0.308626 9.0554 0.308626 9.4062C0.308626 9.74864 0.438087 10.0452 0.697012 10.2957L8.51485 18.101C8.65684 18.243 8.80092 18.3453 8.94709 18.408C9.09326 18.4706 9.24569 18.502 9.40438 18.502C9.73848 18.502 10.0183 18.3934 10.2438 18.1762C10.4693 17.959 10.5821 17.6834 10.5821 17.3493C10.5821 17.1823 10.5528 17.0257 10.4944 16.8795C10.4359 16.7333 10.3524 16.606 10.2438 16.4974L7.57521 13.7912L3.89762 10.4287L6.68568 10.5964H21.3441C21.6949 10.5964 21.9831 10.4857 22.2086 10.2644C22.4341 10.0431 22.5469 9.757 22.5469 9.4062C22.5469 9.04704 22.4341 8.7568 22.2086 8.53546C21.9831 8.31412 21.6949 8.20345 21.3441 8.20345H6.68568L3.88692 8.36956L7.57521 5.00866L10.2438 2.30248C10.3524 2.1939 10.4359 2.06653 10.4944 1.92036C10.5528 1.77419 10.5821 1.61759 10.5821 1.45054C10.5821 1.1248 10.4693 0.853344 10.2438 0.636183C10.0183 0.41902 9.73848 0.310438 9.40438 0.310438Z"
      fill="#2D3047"
    />
  </svg>
);
