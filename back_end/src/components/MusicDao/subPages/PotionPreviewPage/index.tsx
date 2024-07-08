import React from 'react';
import { useHistory } from 'react-router-dom';
import Carousel from 'react-simply-carousel';

import Grid from '@material-ui/core/Grid';

import Box from 'shared/ui-kit/Box';
import { BackIcon } from 'components/MusicDao/components/Icons/SvgIcons';
import { potionPreviewStyles } from './index.styles';
import { Color, Text } from 'shared/ui-kit';
import PotionsCard from 'components/MusicDao/components/Cards/PotionsCard';

import { Songs } from './mock';
import { UnravelBopModal } from 'components/MusicDao/modals/UnravelBopModal';
import { RedeemModal } from 'components/MusicDao/modals/RedeemModal';
import { UnstackBopModal } from 'components/MusicDao/modals/UnstackBopModal';
import { AddStackBopModal } from 'components/MusicDao/modals/AddStackBopModal';

const Tags = ['pop', 'electro', 'music'];

const PotionPreviewPage = () => {
  const classes = potionPreviewStyles();

  const history = useHistory();

  const [songs, setSongs] = React.useState<any[]>(Songs.slice(0, 6));
  const [currentSlide, setCurrentSlide] = React.useState<number>(0);

  const [openAddStackModal, setOpenAddStackModal] =
    React.useState<boolean>(false);
  const [openRedeemModal, setOpenRedeemModal] = React.useState<boolean>(false);
  const [openUnstackModal, setOpenUnstackModal] =
    React.useState<boolean>(false);
  const [openUnravelModal, setOpenUnravelModal] =
    React.useState<boolean>(false);

  const handleSlidePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleSlideNext = () => {
    if (currentSlide < songs.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.background} />
      <Box className={classes.mainBox}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={5}
        >
          <Box
            display="flex"
            onClick={() => history.goBack()}
            style={{ cursor: 'pointer' }}
          >
            <BackIcon />
            <Box ml={1} color={Color.White}>
              BACK
            </Box>
          </Box>
          <Box className={classes.title1}>Your Bop Details</Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            position="relative"
          >
            <img src={require('assets/icons/share_filled.svg')} alt="share" />
            <Box width="1px" height={30} bgcolor="rgba(0, 0, 0, 0.2)" ml={3} />
            <Box
              fontSize={12}
              fontWeight={600}
              color={Color.MusicDAODark}
              ml={1.5}
            >
              2245 Fruits
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgcolor={'rgba(255, 255, 255, 0.46)'}
              width={36}
              height={36}
              borderRadius="100%"
              ml={1}
            >
              <img
                src={require('assets/musicDAOImages/fruit.webp')}
                alt="fruit"
              />
            </Box>
          </Box>
        </Box>
        <Grid container spacing={5}>
          <Grid item md={4} xs={12}>
            <Box display="flex" flexDirection="column" position="relative">
              <div
                className={classes.avatar}
                style={{
                  backgroundImage:
                    'url(https://is4-ssl.mzstatic.com/image/thumb/Music124/v4/0f/10/7b/0f107bb4-861f-2e77-827c-ccf18598630f/14UMGIM14163.rgb.jpg/400x400cc.jpg)'
                }}
              />
              <Box className={classes.title1} mt={4} mb={2}>
                Bubble Dispersion
              </Box>
              <Text color={Color.MusicDAOLightBlue} mb={1.5} bold>
                Sabrina Spellman
              </Text>
              <Text color={Color.MusicDAODark}>Collection Name</Text>
              <Box display="flex" mt={2}>
                {Tags.map((tag, index) => (
                  <Box key={`tag-${index}`} className={classes.tag}>
                    {tag}
                  </Box>
                ))}
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                className={classes.detailBox}
                px={2}
                py={3}
                mt={3}
              >
                <Box display="flex" flexDirection="column">
                  <Text color={Color.MusicDAODark} mb={1}>
                    Preview on Polygon Scan
                  </Text>
                  <Text color={Color.MusicDAOGreen} style={{ fontSize: 13 }}>
                    0xeec9...82f8
                  </Text>
                </Box>
                <LinkIcon color={Color.MusicDAOLightBlue} />
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                px={2}
                py={2}
                className={classes.detailBox}
                mt={1.5}
                onClick={() => setOpenUnravelModal(true)}
              >
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none">
                  <path
                    d="M2.67299 9.82937C4.78331 11.9397 8.21695 11.9397 10.3274 9.82937C11.3494 8.80687 11.9121 7.44806 11.9121 6.00223C11.9121 4.61839 11.3917 3.31475 10.4514 2.30953H11.6661V1.32787H9.05747L8.47991 3.92739L9.44043 4.14074L9.7047 2.95198C10.4922 3.77892 10.928 4.85614 10.928 6.0022C10.928 7.18519 10.4677 8.29703 9.63118 9.13361C7.90476 10.8605 5.09526 10.8605 3.36885 9.13361C2.5323 8.29706 2.07148 7.18517 2.07148 6.0022C2.07148 4.81969 2.53228 3.70786 3.36885 2.87128C4.363 1.87666 5.73392 1.42016 7.12686 1.61857L7.23785 0.643638C6.97646 0.606639 6.74342 0.58838 6.48491 0.58838C5.05925 0.588861 3.70137 1.14625 2.67315 2.17493C1.65064 3.19744 1.08745 4.55673 1.08745 6.00208C1.08745 7.44791 1.65059 8.80678 2.67315 9.82922L2.67299 9.82937Z"
                    fill="#2D3047"
                    stroke="#2D3047"
                    strokeWidth="0.5"
                  />
                </svg>
                <Text color={Color.MusicDAODark} ml={1}>
                  Unravel Bop
                </Text>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  px={2}
                  py={2}
                  className={classes.detailBox}
                  mt={1.5}
                  width="45%"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7.98355 6.79439L11.2125 10.0233C11.2582 10.069 11.2789 10.1301 11.2754 10.1907C11.2783 10.2506 11.2582 10.3123 11.2125 10.358L7.98355 13.5869C7.89809 13.6724 7.75804 13.6724 7.67199 13.5869L6.78302 12.6979C6.69756 12.6125 6.69756 12.4724 6.78302 12.3864L8.13012 11.0393H0.718698C0.597636 11.0393 0.498535 10.9402 0.498535 10.8191V9.56222C0.498535 9.44116 0.597639 9.34206 0.718698 9.34206L8.13012 9.34147L6.78302 7.99436C6.69756 7.90891 6.69756 7.76885 6.78302 7.6828L7.67199 6.79383C7.75745 6.70897 7.8975 6.70897 7.98355 6.79442V6.79439ZM6.01573 7.20623L2.78682 3.97732C2.74112 3.93163 2.72035 3.8705 2.72391 3.80997C2.72095 3.75003 2.74112 3.68831 2.78682 3.64261L6.01573 0.413701C6.10118 0.328246 6.24124 0.328246 6.32729 0.413701L7.21626 1.30268C7.30172 1.38813 7.30172 1.52819 7.21626 1.61423L5.86916 2.96134H13.2806C13.4016 2.96134 13.5007 3.06044 13.5007 3.1815V4.4384C13.5007 4.55946 13.4016 4.65856 13.2806 4.65856L5.86916 4.65916L7.21626 6.00626C7.30172 6.09172 7.30172 6.23177 7.21626 6.31782L6.32729 7.2068C6.24183 7.29166 6.10178 7.29166 6.01573 7.2062V7.20623Z"
                      fill="#2D3047"
                    />
                  </svg>
                  <Text color={Color.MusicDAODark} ml={1}>
                    Send
                  </Text>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  px={2}
                  py={2}
                  className={classes.detailBox}
                  mt={1.5}
                  width="45%"
                >
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                    <path
                      d="M1.01935 13.6335H11.6799C11.8628 13.6335 12.0126 13.4837 12.0126 13.3008V11.9941C12.0126 11.8112 11.8628 11.6614 11.6799 11.6614H10.5689V9.98892C10.5689 9.80605 10.4191 9.65625 10.2362 9.65625H2.46195C2.27908 9.65625 2.12928 9.80604 2.12928 9.98892V11.6614H1.01919C0.836321 11.6614 0.686523 11.8112 0.686523 11.9941V13.3008C0.686523 13.4837 0.836311 13.6335 1.01919 13.6335H1.01935Z"
                      fill="#2D3047"
                    />
                    <path
                      d="M16.5683 6.78319L9.58254 4.38576C9.63768 4.18911 9.84536 3.4558 9.93175 3.11488L10.1789 3.20218C10.2157 3.21504 10.2525 3.22239 10.292 3.22239C10.428 3.22239 10.5548 3.13601 10.6044 3.00001L10.9306 2.17572C10.961 2.09301 10.9536 1.99928 10.9178 1.91934C10.8783 1.8394 10.8112 1.77967 10.7285 1.74934L6.88449 0.385623C6.71173 0.325891 6.52242 0.415949 6.46177 0.588709L6.13555 1.413C6.10523 1.4957 6.1089 1.58944 6.14842 1.66937C6.18517 1.74932 6.25501 1.80905 6.33772 1.83938L6.55551 1.91657C6.06111 2.95498 5.24051 5.18536 4.95196 6.32655L4.73049 6.24844C4.55773 6.18871 4.36842 6.27877 4.30777 6.45153L3.98155 7.32912C3.95123 7.41183 3.9549 7.50556 3.99442 7.5855C4.03117 7.66545 4.09734 7.72518 4.18096 7.7555L8.02493 9.11922C8.06169 9.13209 8.09845 9.13944 8.13429 9.13944C8.27397 9.13944 8.40078 9.05306 8.45042 8.91705L8.77664 8.03946C8.80328 7.95675 8.79961 7.86302 8.76377 7.78308C8.72426 7.70681 8.65717 7.6434 8.57447 7.61308L8.34565 7.53221C8.50371 7.19312 8.82165 6.4938 8.89333 6.32656L15.8395 8.87007C15.9627 8.91326 16.0858 8.93348 16.2117 8.93348C16.3716 8.93348 16.5306 8.9004 16.684 8.82688C16.9496 8.70099 17.1499 8.47768 17.2492 8.19832C17.3493 7.91896 17.3319 7.6194 17.2023 7.35013C17.0773 7.08272 16.8513 6.8833 16.5682 6.78313L16.5683 6.78319Z"
                      fill="#2D3047"
                    />
                  </svg>
                  <Text color={Color.MusicDAODark} ml={1}>
                    Sell NFT
                  </Text>
                </Box>
              </Box>
            </Box>
          </Grid>
          <Grid item md={8} xs={12}>
            <Box display="flex" flexDirection="column" className={classes.card}>
              <Box className={classes.title2} mb={4}>
                Level & Breeding
              </Box>
              <Grid container spacing={6}>
                <Grid item md={6} xs={12} className={classes.leftGrid}>
                  <Box
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <svg
                      width="339"
                      height="145"
                      viewBox="0 0 339 145"
                      fill="none"
                      style={{ marginLeft: -24, marginTop: -48 }}
                    >
                      <path
                        opacity="0.3"
                        d="M64.3695 127.699C73.3873 107.6 87.987 90.5123 106.433 78.4683C124.879 66.4242 146.396 59.9302 168.425 59.7582C190.454 59.5862 212.07 65.7434 230.701 77.498C249.333 89.2525 264.198 106.11 273.529 126.066"
                        stroke="#54658F"
                        strokeOpacity="0.3"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g opacity="0.2">
                        <mask id="path-2-inside-1" fill="white">
                          <path d="M277.764 144.178C287.218 141.958 293.188 132.427 289.703 123.363C281.402 101.769 267.448 82.6731 249.172 68.1723C226.284 50.0116 197.961 40.1247 168.803 40.1168C139.645 40.1089 111.364 49.9805 88.5517 68.1288C70.3282 82.6266 56.4497 101.726 48.2411 123.328C44.7985 132.388 50.7722 141.883 60.2065 144.102C69.6831 146.331 79.0211 140.334 82.9454 131.425C89.0572 117.549 98.461 105.281 110.446 95.7468C127.055 82.5329 147.647 75.3453 168.877 75.3511C190.107 75.3569 210.729 82.5556 227.394 95.7785C239.451 105.344 248.924 117.657 255.093 131.58C259.021 140.444 268.326 146.395 277.764 144.178Z" />
                        </mask>
                        <path
                          d="M277.764 144.178C287.218 141.958 293.188 132.427 289.703 123.363C281.402 101.769 267.448 82.6731 249.172 68.1723C226.284 50.0116 197.961 40.1247 168.803 40.1168C139.645 40.1089 111.364 49.9805 88.5517 68.1288C70.3282 82.6266 56.4497 101.726 48.2411 123.328C44.7985 132.388 50.7722 141.883 60.2065 144.102C69.6831 146.331 79.0211 140.334 82.9454 131.425C89.0572 117.549 98.461 105.281 110.446 95.7468C127.055 82.5329 147.647 75.3453 168.877 75.3511C190.107 75.3569 210.729 82.5556 227.394 95.7785C239.451 105.344 248.924 117.657 255.093 131.58C259.021 140.444 268.326 146.395 277.764 144.178Z"
                          stroke="#54658F"
                          strokeWidth="2"
                          mask="url(#path-2-inside-1)"
                        />
                      </g>
                      <path
                        d="M64.3695 127.699C75.6688 102.515 95.6475 82.2326 120.659 70.5551"
                        stroke="url(#paint0_linear)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* <circle
                      stroke="red" strokeWidth="9" fill="transparent" r="116" cx="-200" cy="-140"
                      style={{ strokeDasharray: "326.726, 326.726", strokeDashoffset: 228.708 }}
                    /> */}
                      <defs>
                        <linearGradient
                          id="paint0_linear"
                          x1="73.3055"
                          y1="210.21"
                          x2="277.431"
                          y2="143.16"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.179206" stopColor="#A0D800" />
                          <stop offset="0.415076" stopColor="#0DCC9E" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <Box
                      display="flex"
                      flexDirection="column"
                      position="absolute"
                      bottom={-30}
                    >
                      <Box fontSize={16} color={Color.MusicDAOLightBlue}>
                        Bop Level
                      </Box>
                      <Box fontSize={32} color={Color.MusicDAODark}>
                        12%
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" mt={8}>
                    <Box
                      display="flex"
                      flexDirection="column"
                      width={1}
                      borderRight="1px solid rgba(84, 101, 143, 0.3)"
                    >
                      <Box className={classes.text1}>Breeding to date</Box>
                      <Box className={classes.text2}>223</Box>
                    </Box>
                    <Box display="flex" flexDirection="column" width={1} ml={4}>
                      <Box className={classes.text1}>
                        Breeding to next level
                      </Box>
                      <Box className={classes.text2}>2424</Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Box pl={3}>
                    <Box display="flex" alignItems="center">
                      <svg
                        width="88"
                        height="102"
                        viewBox="0 0 88 102"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M53.2773 14.5713L53.2773 15.5488L34.7263 15.5488L34.7263 14.5713L53.2773 14.5713Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 21.3984L53.2773 22.8597L34.7263 22.8597L34.7263 21.3984L53.2773 21.3984Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 28.2266L53.2773 30.1766L34.7263 30.1766L34.7263 28.2266L53.2773 28.2266Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 35.0537L53.2773 37.4925L34.7263 37.4925L34.7263 35.0537L53.2773 35.0537Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 41.8818L53.2773 44.8094L34.7263 44.8094L34.7263 41.8818L53.2773 41.8818Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 48.709L53.2773 52.1202L34.7263 52.1202L34.7263 48.709L53.2773 48.709Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 55.5371L53.2773 59.4371L34.7263 59.4371L34.7263 55.5371L53.2773 55.5371Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 62.3643L53.2773 66.7531L34.7263 66.7531L34.7263 62.3643L53.2773 62.3643Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 69.1914L53.2773 74.069L34.7263 74.069L34.7263 69.1914L53.2773 69.1914Z"
                          fill="#54658F"
                          fillOpacity="0.3"
                        />
                        <path
                          d="M53.2773 76.0137L53.2773 81.38L34.7263 81.38L34.7263 76.0137L53.2773 76.0137Z"
                          fill="#F2994A"
                        />
                        <path
                          d="M53.2773 82.8418L53.2773 88.6919L34.7263 88.6919L34.7263 82.8418L53.2773 82.8418Z"
                          fill="#FFD43E"
                        />
                        <rect
                          x="0.5"
                          y="0.5"
                          width="87"
                          height="101"
                          rx="17.5"
                          stroke="#DDE0E9"
                        />
                      </svg>
                      <Box display="flex" flexDirection="column" ml={3}>
                        <Box fontSize={16} color={Color.MusicDAOLightBlue}>
                          Position intensity
                        </Box>
                        <Box fontSize={32} color={Color.MusicDAODark}>
                          12%
                        </Box>
                      </Box>
                    </Box>
                    <Box className={classes.text1} mt={7.5}>
                      On that Bop level there are 1000 USDT staked and you have
                      100USDT.
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Box display="flex" justifyContent="center" mt={5}>
                <button
                  className={classes.button}
                  onClick={() => setOpenAddStackModal(true)}
                >
                  Breed your Bop
                  <svg
                    width="158"
                    height="23"
                    viewBox="0 0 158 23"
                    fill="none"
                    style={{ position: 'absolute', top: 9, left: 38 }}
                  >
                    <path
                      d="M6.4237 11.507C6.4237 10.9019 5.92026 10.4118 5.29871 10.4118L1.12499 10.4118C0.503432 10.4118 -5.28823e-07 10.9019 -5.02373e-07 11.507C-4.75923e-07 12.1122 0.503432 12.6023 1.12499 12.6023L5.29871 12.6023C5.92026 12.6023 6.4237 12.1122 6.4237 11.507Z"
                      fill="url(#paint0_radial)"
                    />
                    <path
                      d="M6.4237 11.507C6.4237 10.9019 5.92026 10.4118 5.29871 10.4118L1.12499 10.4118C0.503432 10.4118 -5.28823e-07 10.9019 -5.02373e-07 11.507C-4.75923e-07 12.1122 0.503432 12.6023 1.12499 12.6023L5.29871 12.6023C5.92026 12.6023 6.4237 12.1122 6.4237 11.507Z"
                      fill="white"
                    />
                    <path
                      d="M6.7116 8.14427C6.76504 8.01284 6.79035 7.87594 6.79035 7.74177C6.79035 7.30642 6.52036 6.893 6.0788 6.72323L2.057 5.17351C1.48044 4.95172 0.825161 5.22553 0.597356 5.78957C0.369543 6.35088 0.650793 6.98882 1.23016 7.2106L5.25197 8.76032C5.82852 8.98211 6.48379 8.70831 6.7116 8.14427Z"
                      fill="url(#paint1_radial)"
                    />
                    <path
                      d="M6.7116 8.14427C6.76504 8.01284 6.79035 7.87594 6.79035 7.74177C6.79035 7.30642 6.52036 6.893 6.0788 6.72323L2.057 5.17351C1.48044 4.95172 0.825161 5.22553 0.597356 5.78957C0.369543 6.35088 0.650793 6.98882 1.23016 7.2106L5.25197 8.76032C5.82852 8.98211 6.48379 8.70831 6.7116 8.14427Z"
                      fill="white"
                    />
                    <path
                      d="M7.59632 4.85303C7.78476 4.64493 7.87476 4.38756 7.87476 4.13295C7.87476 3.82628 7.74538 3.52236 7.48945 3.30604L3.91195 0.269544C3.44508 -0.127478 2.73354 -0.0809251 2.32574 0.376329C1.91793 0.830851 1.96574 1.52357 2.43261 1.92058L6.00723 4.95708C6.47972 5.35683 7.18852 5.30755 7.59632 4.85303Z"
                      fill="url(#paint2_radial)"
                    />
                    <path
                      d="M7.59632 4.85303C7.78476 4.64493 7.87476 4.38756 7.87476 4.13295C7.87476 3.82628 7.74538 3.52236 7.48945 3.30604L3.91195 0.269544C3.44508 -0.127478 2.73354 -0.0809251 2.32574 0.376329C1.91793 0.830851 1.96574 1.52357 2.43261 1.92058L6.00723 4.95708C6.47972 5.35683 7.18852 5.30755 7.59632 4.85303Z"
                      fill="white"
                    />
                    <path
                      d="M6.0807 16.2791C6.52226 16.1093 6.79225 15.6959 6.79225 15.2605C6.79225 15.1264 6.76694 14.9895 6.7135 14.858C6.48569 14.2967 5.83036 14.0202 5.25386 14.242L1.23206 15.7917C0.655501 16.0135 0.371449 16.6487 0.599248 17.2127C0.82706 17.774 1.48239 18.0506 2.05889 17.8288L6.0807 16.2791Z"
                      fill="url(#paint3_radial)"
                    />
                    <path
                      d="M6.0807 16.2791C6.52226 16.1093 6.79225 15.6959 6.79225 15.2605C6.79225 15.1264 6.76694 14.9895 6.7135 14.858C6.48569 14.2967 5.83036 14.0202 5.25386 14.242L1.23206 15.7917C0.655501 16.0135 0.371449 16.6487 0.599248 17.2127C0.82706 17.774 1.48239 18.0506 2.05889 17.8288L6.0807 16.2791Z"
                      fill="white"
                    />
                    <path
                      d="M7.48996 19.694C7.7459 19.4777 7.87527 19.1737 7.87527 18.8698C7.87527 18.6151 7.78527 18.3578 7.59684 18.1497C7.18902 17.6952 6.47746 17.6459 6.01062 18.0429L2.436 21.0794C1.96913 21.4764 1.91851 22.1692 2.32913 22.6237C2.73694 23.0809 3.4485 23.1275 3.91534 22.7305L7.48996 19.694Z"
                      fill="url(#paint4_radial)"
                    />
                    <path
                      d="M7.48996 19.694C7.7459 19.4777 7.87527 19.1737 7.87527 18.8698C7.87527 18.6151 7.78527 18.3578 7.59684 18.1497C7.18902 17.6952 6.47746 17.6459 6.01062 18.0429L2.436 21.0794C1.96913 21.4764 1.91851 22.1692 2.32913 22.6237C2.73694 23.0809 3.4485 23.1275 3.91534 22.7305L7.48996 19.694Z"
                      fill="white"
                    />
                    <path
                      d="M151.576 11.507C151.576 12.1122 152.08 12.6023 152.701 12.6023L156.875 12.6023C157.497 12.6023 158 12.1122 158 11.507C158 10.9019 157.497 10.4118 156.875 10.4118L152.701 10.4118C152.08 10.4118 151.576 10.9019 151.576 11.507Z"
                      fill="url(#paint5_radial)"
                    />
                    <path
                      d="M151.576 11.507C151.576 12.1122 152.08 12.6023 152.701 12.6023L156.875 12.6023C157.497 12.6023 158 12.1122 158 11.507C158 10.9019 157.497 10.4118 156.875 10.4118L152.701 10.4118C152.08 10.4118 151.576 10.9019 151.576 11.507Z"
                      fill="white"
                    />
                    <path
                      d="M151.919 6.72357C151.343 6.94536 151.061 7.58335 151.286 8.1446C151.514 8.7059 152.17 8.98244 152.746 8.76067L156.768 7.21095C157.209 7.04119 157.479 6.62774 157.479 6.1924C157.479 6.05823 157.454 5.92133 157.401 5.7899C157.173 5.2286 156.518 4.95207 155.941 5.17384L151.919 6.72357Z"
                      fill="url(#paint6_radial)"
                    />
                    <path
                      d="M151.919 6.72357C151.343 6.94536 151.061 7.58335 151.286 8.1446C151.514 8.7059 152.17 8.98244 152.746 8.76067L156.768 7.21095C157.209 7.04119 157.479 6.62774 157.479 6.1924C157.479 6.05823 157.454 5.92133 157.401 5.7899C157.173 5.2286 156.518 4.95207 155.941 5.17384L151.919 6.72357Z"
                      fill="white"
                    />
                    <path
                      d="M150.51 3.3096C150.043 3.70662 149.993 4.39936 150.403 4.85385C150.811 5.3111 151.523 5.35765 151.989 4.96063L155.564 1.92414C155.82 1.70783 155.949 1.4039 155.949 1.09723C155.949 0.842589 155.859 0.58521 155.671 0.377148C155.263 -0.0801059 154.552 -0.12666 154.085 0.270362L150.51 3.3096Z"
                      fill="url(#paint7_radial)"
                    />
                    <path
                      d="M150.51 3.3096C150.043 3.70662 149.993 4.39936 150.403 4.85385C150.811 5.3111 151.523 5.35765 151.989 4.96063L155.564 1.92414C155.82 1.70783 155.949 1.4039 155.949 1.09723C155.949 0.842589 155.859 0.58521 155.671 0.377148C155.263 -0.0801059 154.552 -0.12666 154.085 0.270362L150.51 3.3096Z"
                      fill="white"
                    />
                    <path
                      d="M151.289 14.8577C151.061 15.419 151.343 16.0569 151.922 16.2787L155.944 17.8284C156.52 18.0502 157.176 17.7764 157.403 17.2124C157.457 17.0809 157.482 16.944 157.482 16.8099C157.482 16.3745 157.212 15.9611 156.771 15.7913L152.749 14.2416C152.172 14.0198 151.517 14.2936 151.289 14.8577Z"
                      fill="url(#paint8_radial)"
                    />
                    <path
                      d="M151.289 14.8577C151.061 15.419 151.343 16.0569 151.922 16.2787L155.944 17.8284C156.52 18.0502 157.176 17.7764 157.403 17.2124C157.457 17.0809 157.482 16.944 157.482 16.8099C157.482 16.3745 157.212 15.9611 156.771 15.7913L152.749 14.2416C152.172 14.0198 151.517 14.2936 151.289 14.8577Z"
                      fill="white"
                    />
                    <path
                      d="M150.403 18.1497C149.995 18.6042 150.043 19.2969 150.51 19.694L154.085 22.7305C154.552 23.1275 155.263 23.0809 155.671 22.6237C155.857 22.4156 155.949 22.1609 155.949 21.9036C155.949 21.5969 155.82 21.293 155.564 21.0767L151.989 18.0402C151.52 17.6459 150.811 17.6952 150.403 18.1497Z"
                      fill="url(#paint9_radial)"
                    />
                    <path
                      d="M150.403 18.1497C149.995 18.6042 150.043 19.2969 150.51 19.694L154.085 22.7305C154.552 23.1275 155.263 23.0809 155.671 22.6237C155.857 22.4156 155.949 22.1609 155.949 21.9036C155.949 21.5969 155.82 21.293 155.564 21.0767L151.989 18.0402C151.52 17.6459 150.811 17.6952 150.403 18.1497Z"
                      fill="white"
                    />
                    <defs>
                      <radialGradient
                        id="paint0_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint1_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint2_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint3_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint4_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint5_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint6_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint7_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint8_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                      <radialGradient
                        id="paint9_radial"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(25.875 11.5) rotate(-156.038) scale(28.3155 45.2039)"
                      >
                        <stop
                          offset="0.585977"
                          stopColor="#0DCC9E"
                          stopOpacity="0"
                        />
                        <stop offset="0.915522" stopColor="#A0D800" />
                      </radialGradient>
                    </defs>
                  </svg>
                </button>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" className={classes.card}>
              <Box className={classes.title2} mb={4}>
                Details
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                flexWrap="wrap"
                justifyContent="space-between"
              >
                <DetailCard color="#7358E4">
                  <img
                    width={30}
                    height={30}
                    src={require('assets/tokenImages/MUSIC1.webp')}
                    alt="token"
                  />
                  <Box fontSize={14} color={Color.MusicDAODark} mt={1}>
                    2424
                  </Box>
                  <Box
                    fontSize={12}
                    color={Color.GrayDark}
                    maxWidth={57}
                    textAlign="center"
                    mt={0.5}
                  >
                    TRAX Staked
                  </Box>
                </DetailCard>
                <DetailCard
                  color="#65CB63"
                  footer={
                    <Box
                      display="flex"
                      flexDirection="row"
                      width={1}
                      onClick={() => setOpenUnstackModal(true)}
                    >
                      <Box
                        fontSize={13}
                        color={Color.White}
                        width={1}
                        textAlign="center"
                      >
                        ADD
                      </Box>
                      <Box
                        fontSize={13}
                        color={Color.White}
                        width={1}
                        textAlign="center"
                      >
                        REMOVE
                      </Box>
                    </Box>
                  }
                  showWrap
                >
                  <img
                    width={30}
                    height={30}
                    src={require('assets/tokenImages/USDT.webp')}
                    alt="token"
                  />
                  <Box fontSize={14} color={Color.MusicDAODark} mt={1}>
                    2424
                  </Box>
                  <Box
                    fontSize={12}
                    color={Color.GrayDark}
                    maxWidth={57}
                    textAlign="center"
                    mt={0.5}
                  >
                    {' '}
                    USDT Staked
                  </Box>
                </DetailCard>
                <DetailCard
                  color="#63CBC5"
                  footer={
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      width={1}
                    >
                      <Box
                        fontSize={13}
                        color={Color.White}
                        textAlign="center"
                        mr={1}
                        onClick={() => setOpenRedeemModal(true)}
                      >
                        REDEEM
                      </Box>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.7166 5.27328C11.8989 5.47143 12 5.7308 12 6C12 6.2692 11.8989 6.52857 11.7166 6.72672L7.28398 11.5464C7.05946 11.7906 6.67422 11.7906 6.4497 11.5464C6.25024 11.3296 6.25024 10.996 6.4497 10.7791L10.1021 6.80777C10.178 6.72529 10.1195 6.592 10.0074 6.592H0.591996C0.265046 6.592 0 6.32695 0 6C0 5.67305 0.265045 5.408 0.591996 5.408H10.0074C10.1195 5.408 10.178 5.27471 10.1021 5.19223L6.4497 1.22085C6.25024 1.00398 6.25024 0.670442 6.4497 0.453567C6.67422 0.209443 7.05946 0.209443 7.28398 0.453567L11.7166 5.27328Z"
                          fill="white"
                        />
                      </svg>
                    </Box>
                  }
                  showWrap
                >
                  <img
                    width={30}
                    height={30}
                    src={require('assets/musicDAOImages/beats.webp')}
                    alt="token"
                  />
                  <Box fontSize={14} color={Color.MusicDAODark} mt={1}>
                    2424
                  </Box>
                  <Box
                    fontSize={12}
                    color={Color.GrayDark}
                    maxWidth={57}
                    textAlign="center"
                    mt={0.5}
                  >
                    Accrued Beats
                  </Box>
                </DetailCard>
                <DetailCard
                  color="#63CBC5"
                  footer={
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="center"
                      width={1}
                    >
                      <Box
                        fontSize={13}
                        color={Color.White}
                        textAlign="center"
                        mr={1}
                      >
                        REDEEM
                      </Box>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M11.7166 5.27328C11.8989 5.47143 12 5.7308 12 6C12 6.2692 11.8989 6.52857 11.7166 6.72672L7.28398 11.5464C7.05946 11.7906 6.67422 11.7906 6.4497 11.5464C6.25024 11.3296 6.25024 10.996 6.4497 10.7791L10.1021 6.80777C10.178 6.72529 10.1195 6.592 10.0074 6.592H0.591996C0.265046 6.592 0 6.32695 0 6C0 5.67305 0.265045 5.408 0.591996 5.408H10.0074C10.1195 5.408 10.178 5.27471 10.1021 5.19223L6.4497 1.22085C6.25024 1.00398 6.25024 0.670442 6.4497 0.453567C6.67422 0.209443 7.05946 0.209443 7.28398 0.453567L11.7166 5.27328Z"
                          fill="white"
                        />
                      </svg>
                    </Box>
                  }
                  showWrap
                >
                  <img
                    width={30}
                    height={30}
                    src={require('assets/musicDAOImages/beats.webp')}
                    alt="token"
                  />
                  <Box fontSize={14} color={Color.MusicDAODark} mt={1}>
                    2424
                  </Box>
                  <Box
                    fontSize={12}
                    color={Color.GrayDark}
                    maxWidth={57}
                    textAlign="center"
                    mt={0.5}
                  >
                    Accrued USDC
                  </Box>
                </DetailCard>
              </Box>
            </Box>
            <Box display="flex" flexDirection="column" className={classes.card}>
              <Box display="flex" justifyContent="space-between" mb={4}>
                <Box className={classes.title2}>Children</Box>
                <Box display="flex">
                  <Box className={classes.sliderNav} onClick={handleSlidePrev}>
                    <svg
                      width="15"
                      height="13"
                      viewBox="0 0 15 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.13131 11.3846L1.07343 6.48479M1.07343 6.48479L6.13131 1.58496M1.07343 6.48479H13.9268"
                        stroke="#181818"
                        strokeWidth="1.5122"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>
                  <Box
                    className={classes.sliderNav}
                    ml={2.5}
                    onClick={handleSlideNext}
                  >
                    <svg
                      width="15"
                      height="13"
                      viewBox="0 0 15 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.86869 11.3846L13.9266 6.48479M13.9266 6.48479L8.86869 1.58496M13.9266 6.48479H1.07324"
                        stroke="#181818"
                        strokeWidth="1.5122"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Box>
                </Box>
              </Box>
              <Carousel
                activeSlideIndex={currentSlide}
                itemsToShow={3}
                itemsToScroll={3}
                forwardBtnProps={{
                  show: false
                }}
                backwardBtnProps={{
                  show: false
                }}
                infinite={false}
              >
                {songs.slice(0, 6).map((item, index) => (
                  <PotionsCard
                    pod={item}
                    key={`${item.PodAddress}-${index}-DNFTtrending-card`}
                  />
                ))}
              </Carousel>
            </Box>
            <Box display="flex" flexDirection="column" className={classes.card}>
              <Box className={classes.title2} mb={4}>
                Parents
              </Box>
              <Box
                className={classes.parent}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <PotionsCard pod={songs[0]} />
                <img
                  src={require('assets/musicDAOImages/add.webp')}
                  alt="add"
                />
                <PotionsCard pod={songs[1]} />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      {openAddStackModal && (
        <AddStackBopModal
          open={openAddStackModal}
          handleClose={() => setOpenAddStackModal(false)}
        />
      )}
      {openUnravelModal && (
        <UnravelBopModal
          open={openUnravelModal}
          handleClose={() => setOpenUnravelModal(false)}
        />
      )}
      {openRedeemModal && (
        <RedeemModal
          open={openRedeemModal}
          handleClose={() => setOpenRedeemModal(false)}
        />
      )}
      {openUnstackModal && (
        <UnstackBopModal
          open={openUnstackModal}
          handleClose={() => setOpenUnstackModal(false)}
        />
      )}
    </Box>
  );
};

export default PotionPreviewPage;

const DetailCard = ({
  color,
  children,
  footer,
  showWrap
}: {
  color: string;
  children: JSX.Element | JSX.Element[];
  footer?: JSX.Element;
  showWrap?: boolean;
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      position="relative"
    >
      <svg
        width="162"
        height="233"
        viewBox="0 0 162 233"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {showWrap && (
          <path
            d="M68.1146 7.20477C75.7989 2.76819 85.2665 2.7682 92.9508 7.20478L138.018 33.2245C145.703 37.6611 150.436 45.8602 150.436 54.7334V177.773C150.436 186.646 145.703 194.845 138.018 199.282L92.9508 225.301C85.2664 229.738 75.7989 229.738 68.1145 225.301L23.047 199.282C15.3627 194.845 10.6289 186.646 10.6289 177.773V54.7334C10.6289 45.8602 15.3627 37.6611 23.047 33.2245L68.1146 7.20477Z"
            fill={color}
          />
        )}
        <path
          d="M92.3727 8.6387L137.44 34.6584C144.612 38.7992 149.03 46.4518 149.03 54.7334V106.773C149.03 115.054 144.612 122.707 137.44 126.848L92.3726 152.867C85.2006 157.008 76.3642 157.008 69.1921 152.867L24.1246 126.848C16.9525 122.707 12.5344 115.054 12.5344 106.773V54.7333C12.5344 46.4517 16.9525 38.7992 24.1246 34.6584L69.1921 8.63869C76.3642 4.49789 85.2006 4.49789 92.3727 8.6387Z"
          fill="white"
          stroke="white"
          strokeWidth="3.31151"
        />
        <path
          d="M92.7866 7.92174L137.854 33.9415C145.282 38.2302 149.858 46.156 149.858 54.7334V106.773C149.858 115.35 145.282 123.276 137.854 127.565L92.7866 153.584C85.3583 157.873 76.2064 157.873 68.7782 153.584L23.7107 127.565C16.2824 123.276 11.7065 115.35 11.7065 106.773V54.7333C11.7065 46.156 16.2825 38.2302 23.7107 33.9415L68.7782 7.92173C76.2064 3.63304 85.3584 3.63305 92.7866 7.92174Z"
          stroke={color}
          strokeWidth="1.65575"
        />
      </svg>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        position="absolute"
        top={32}
      >
        {children}
      </Box>
      <Box display="flex" position="absolute" bottom={42} width={1}>
        {footer}
      </Box>
    </Box>
  );
};

type IconProps = React.PropsWithChildren<{
  color?: Color;
}>;

export const LinkIcon = ({ color, ...props }: IconProps) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.8242 0.79884L6.82418 10.7988M16.8242 0.79884L16.8243 6.79884M16.8242 0.79884L10.8242 0.798828M6.82422 0.79884H0.824219V16.7988H16.8242V10.7988"
      stroke={color || Color.White}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
