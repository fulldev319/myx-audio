import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

export const breedBopModalStyles = makeStyles((theme) => ({
  root: {
    width: '680px !important'
  },
  contentBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: '0px 5px 22px'
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#2D3047',
    lineHeight: '104.5%'
  },
  title1: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2D3047',
    lineHeight: '104.5%',

    marginTop: 2
  },
  title2: {
    fontSize: 16,
    fontWeight: 500,
    color: '#2D3047',
    lineHeight: '104.5%',

    marginTop: 8,
    paddingBottom: 38,
    borderBottom: '1px solid #DAE6E5',
    width: '90%',
    textAlign: 'center'
  },
  subTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047',
    lineHeight: '130%',

    marginTop: 35
  },
  subTitle1: {
    fontSize: 16,
    fontWeight: 500,
    color: '#54658F',
    lineHeight: '150%',

    marginTop: 8,
    padding: '0px 100px',
    textAlign: 'center'
  },
  shareSection: {
    background: '#F2FBF6',
    borderRadius: 12,
    width: '100%',
    height: 125,
    paddingTop: 26,
    marginTop: 36,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center'
  },
  sharePercentageSection: {
    fontSize: 12,
    fontWeight: 700,
    color: '#00D13B',
    marginLeft: 9,
    background: 'rgba(0, 209, 59, 0.09)',
    borderRadius: 15,
    padding: '2.5px 7.5px 2.5px 8.5px',
    '& span': {
      marginLeft: 3
    }
  },
  traxpAmountSection: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: 55,
    height: 50,
    padding: '0 21px',
    fontSize: 16,
    fontWeight: 400,
    color: '#181818',
    marginTop: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  confirmBtn: {
    marginTop: 75,
    cursor: 'pointer'
  }
}));

export const LevelIcon = () => (
  <svg
    width="339"
    height="145"
    viewBox="0 0 339 145"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
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
);

export const ConfirmIcon = () => (
  <svg
    width="344"
    height="70"
    viewBox="0 0 344 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 21.7229C0 14.7351 5.31938 8.91027 12.2842 8.34491C40.4709 6.05689 111.986 0.779785 172 0.779785C232.014 0.779785 303.529 6.05689 331.716 8.34491C338.681 8.91027 344 14.7352 344 21.7229V46.8983C344 53.8224 338.795 59.6138 331.901 60.2554C303.472 62.9014 230.408 69.1237 172 69.1237C113.592 69.1237 40.5281 62.9014 12.0989 60.2554C5.20458 59.6138 0 53.8224 0 46.8983V21.7229Z"
      fill="#FF8E3C"
    />
    <path
      d="M146.073 39.4307C149.259 39.4307 151.509 37.3967 151.941 34.1387L149.493 33.6887C149.187 35.8307 147.873 37.1447 146.073 37.1447C143.841 37.1447 142.473 35.4347 142.473 32.6447C142.473 29.8367 143.697 28.1087 145.695 28.1087C147.171 28.1087 148.233 29.1707 148.539 31.0607L150.987 30.5747C150.501 27.6047 148.485 25.8587 145.713 25.8587C142.113 25.8587 139.845 28.4507 139.845 32.6447C139.845 36.8207 142.239 39.4307 146.073 39.4307ZM157.053 39.3407C159.807 39.3407 161.589 37.4147 161.589 34.4267C161.589 31.4567 159.807 29.5487 157.053 29.5487C154.299 29.5487 152.517 31.4567 152.517 34.4267C152.517 37.4147 154.299 39.3407 157.053 39.3407ZM157.053 37.3247C155.703 37.3247 154.857 36.2087 154.857 34.4267C154.857 32.6627 155.703 31.5647 157.053 31.5647C158.385 31.5647 159.249 32.6627 159.249 34.4267C159.249 36.2087 158.385 37.3247 157.053 37.3247ZM167.782 29.6027C166.504 29.6027 165.478 30.1967 164.902 31.2407H164.884L164.578 29.8547H162.598V39.0347H164.956V33.5807C164.956 32.3207 165.694 31.5287 166.828 31.5287C167.674 31.5287 168.196 32.0867 168.196 33.0227V39.0347H170.536V32.5727C170.536 30.7007 169.492 29.6027 167.782 29.6027ZM172.535 39.0347H174.875V31.6547H177.953V29.8547H174.875V28.6847C174.875 27.8927 175.343 27.3527 176.045 27.3527C176.711 27.3527 177.251 27.8567 177.431 28.6307L178.619 27.3527C178.241 26.1647 177.161 25.4267 175.667 25.4267C173.741 25.4267 172.517 26.5427 172.517 28.3247V29.8547H170.843V31.6547H172.517L172.535 39.0347ZM180.559 28.4327C181.441 28.4327 182.035 27.8567 182.035 26.9927C182.035 26.1467 181.441 25.5707 180.559 25.5707C179.695 25.5707 179.101 26.1467 179.101 26.9927C179.101 27.8567 179.695 28.4327 180.559 28.4327ZM179.371 39.0347H181.729V29.8547H179.371V39.0347ZM187.72 29.5847C186.676 29.5847 185.812 30.2507 185.398 31.3847H185.38L185.092 29.8547H183.184V39.0347H185.542V34.1027C185.542 32.4107 186.1 31.4207 187.036 31.4207C187.756 31.4207 188.206 32.0687 188.26 33.2387L190.24 32.6807C190.168 30.7187 189.232 29.5847 187.72 29.5847ZM191.13 39.0347H193.488V33.7967C193.488 32.4647 194.154 31.6007 195.288 31.6007C196.206 31.6007 196.746 32.1587 196.746 33.0767V39.0347H199.086L199.104 33.7967C199.104 32.4647 199.77 31.6007 200.904 31.6007C201.822 31.6007 202.362 32.1587 202.362 33.0767L202.344 39.0347H204.702V32.7347C204.702 30.7547 203.658 29.5847 201.894 29.5847C200.652 29.5847 199.536 30.1967 198.888 31.3847H198.87C198.456 30.2327 197.52 29.5847 196.206 29.5847C194.928 29.5847 193.866 30.2327 193.362 31.3307H193.344L193.056 29.8547H191.13V39.0347Z"
      fill="white"
    />
  </svg>
);

export const BeatIcon = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0 18C0 8.05887 8.05887 0 18 0V0C27.9411 0 36 8.05887 36 18V18C36 27.9411 27.9411 36 18 36V36C8.05887 36 0 27.9411 0 18V18Z"
      fill="#15CBD7"
    />
    <g filter="url(#filter0_ddi)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.614 10.6194C16.614 9.85369 17.2343 9.2334 18 9.2334C18.7657 9.2334 19.386 9.85369 19.386 10.6194V26.4594C19.386 27.2251 18.7657 27.8454 18 27.8454C17.2343 27.8454 16.614 27.2251 16.614 26.4594V10.6194ZM14.0082 12.3518C13.2425 12.3518 12.6222 12.9721 12.6222 13.7378V23.3408C12.6222 24.1065 13.2425 24.7268 14.0082 24.7268C14.7739 24.7268 15.3942 24.1065 15.3942 23.3408V13.7378C15.3942 12.9721 14.7739 12.3518 14.0082 12.3518ZM10.0164 14.9006C9.25073 14.9006 8.63043 15.5209 8.63043 16.2866V20.7911C8.63043 21.5568 9.25073 22.1771 10.0164 22.1771C10.7821 22.1771 11.4024 21.5568 11.4024 20.7911V16.2866C11.4024 15.5209 10.7821 14.9006 10.0164 14.9006ZM25.9833 14.9006C25.2176 14.9006 24.5973 15.5209 24.5973 16.2866V20.7911C24.5973 21.5568 25.2176 22.1771 25.9833 22.1771C26.749 22.1771 27.3693 21.5568 27.3693 20.7911V16.2866C27.3693 15.5209 26.749 14.9006 25.9833 14.9006ZM20.6057 13.7378C20.6057 12.9721 21.226 12.3518 21.9917 12.3518C22.7575 12.3518 23.3777 12.9721 23.3777 13.7378V23.3408C23.3777 24.1065 22.7575 24.7268 21.9917 24.7268C21.226 24.7268 20.6057 24.1065 20.6057 23.3408V13.7378Z"
        fill="url(#paint0_linear)"
      />
    </g>
    <defs>
      <filter
        id="filter0_ddi"
        x="7.28043"
        y="9.2334"
        width="21.4389"
        height="21.312"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1.35" />
        <feGaussianBlur stdDeviation="0.675" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.45" />
        <feGaussianBlur stdDeviation="0.225" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow"
          result="effect2_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect2_dropShadow"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.9" />
        <feGaussianBlur stdDeviation="0.45" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
        />
        <feBlend mode="normal" in2="shape" result="effect3_innerShadow" />
      </filter>
      <linearGradient
        id="paint0_linear"
        x1="17.9999"
        y1="9.2334"
        x2="17.9999"
        y2="27.8454"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" />
        <stop offset="1" stopColor="#00E0FF" />
      </linearGradient>
    </defs>
  </svg>
);
