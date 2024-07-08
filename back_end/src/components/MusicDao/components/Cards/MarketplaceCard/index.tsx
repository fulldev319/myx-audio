import React from 'react';
import { useHistory } from 'react-router-dom';
import { getRandomAvatar } from 'shared/services/user/getUserAvatar';
import { Avatar } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { marketplaceCardStyles } from './index.styles';

const MarketplaceCard = () => {
  const classes = marketplaceCardStyles();
  const history = useHistory();

  return (
    <Box
      className={classes.container}
      mx={2}
      onClick={() => history.push('/potions/manageBops/test')}
    >
      <img
        width="100%"
        height="100%"
        src={require(`assets/musicDAOImages/container.svg`)}
        alt="container"
      />
      <Box className={classes.innerImage}>
        <img src={require(`assets/musicDAOImages/inner.svg`)} alt="inner" />
        <Box className={classes.innerBox} zIndex={999}>
          <Box display="flex" position="absolute" top={-30}>
            {[1, 2, 3, 4, 5, 6, 7].map((fire, index) => (
              <Box mr={0.5} key={`fire-level-${index}`}>
                <FireLevelIcon status={index < 3 ? 'full' : 'outline'} />
              </Box>
            ))}
          </Box>
          <Box position="relative" width={1} height={1}>
            <Box className={classes.boxHeader}>
              <PolygonIcon />
              <Box
                position="absolute"
                fontSize={12}
                fontWeight={700}
                color={'#F7F7F7'}
              >
                BOP LVL 5
              </Box>
              <Box display="flex" position="absolute" bottom={-4}>
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <StarIcon key={`start-${index}`} />
                ))}
              </Box>
            </Box>
            <Box className={classes.title}>Don't Start Now Şarkı Sözleri </Box>
            <Box className={classes.description}>Dua Lipa</Box>
            <Box className={classes.detail} display="flex">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width={1}
              >
                <FireIcon />
                <Box className={classes.itemText}>Intensity</Box>
                <Box className={classes.itemValue}>12%</Box>
              </Box>
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width={1}
              >
                <USDTIcon />
                <Box className={classes.itemText}>Staked</Box>
                <Box className={classes.itemValue}>2424455</Box>
              </Box>
            </Box>
            <Box className={classes.divider} />
            <Box display="flex">
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                width={1}
              >
                <Box className={classes.itemText}>NFT Address</Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                width={1}
              >
                <Box className={classes.description} mr={1.5}>
                  0xeec9...82f8
                </Box>
                <JumpIcon />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box position="absolute" top={0} left={0} width={'100%'} height={'35%'}>
        <Box
          className={classes.backImage}
          style={{
            backgroundImage:
              'url(https://is2-ssl.mzstatic.com/image/thumb/Features125/v4/39/a6/4d/39a64d4d-ca7e-c6a6-b2f0-c78e067bed3b/pr_source.webp/800x800cc.jpg)'
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Avatar
                url={getRandomAvatar()}
                size={'medium'}
                className={classes.avatar}
              />
              {[1, 2, 3].map((avatar, index) => (
                <Avatar
                  key={`creator-${index}`}
                  url={getRandomAvatar()}
                  size={'small'}
                  className={classes.avatar}
                />
              ))}
            </Box>
            <Box display="flex" alignItems="center">
              <Box className={classes.tag}>POP</Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.content} zIndex={1}></Box>
    </Box>
  );
};

export default MarketplaceCard;

const FireIcon = () => (
  <svg
    width="24"
    height="38"
    viewBox="0 0 24 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.28 12.8018C22.7512 16.7551 24 20.8097 24 24.7629C24 33.4154 18.049 37.7188 12.071 37.7188C6.04656 37.7188 0 33.3672 0 25.3363C0 17.9754 5.08896 14.1719 4.24877 8.82565C6.04877 9.69597 7.36877 11.7105 7.58438 14.1212C9.86438 10.6904 10.8488 5.64127 9.67315 0.71875C13.2244 2.63425 18.6242 9.27224 19.0331 16.7321C19.9688 15.8618 20.2332 14.3951 20.2819 12.804L20.28 12.8018Z"
      fill="url(#fire-icon-svg)"
    />
    <defs>
      <linearGradient
        id="fire-icon-svg"
        x1="12"
        y1="18.7188"
        x2="12"
        y2="37.7188"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#545454" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const USDTIcon = () => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.896484 18.9755C0.896484 8.72968 9.20234 0.423828 19.4481 0.423828C29.6939 0.423828 37.9998 8.72968 37.9998 18.9755C37.9998 29.2212 29.6939 37.5271 19.4481 37.5271C9.20234 37.5271 0.896484 29.2212 0.896484 18.9755Z"
      fill="#C9C9C9"
      fill-opacity="0.27"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21.6766 20.5795V20.5772C21.5491 20.5864 20.8917 20.6259 19.4249 20.6259C18.2538 20.6259 17.4295 20.5911 17.1396 20.5772V20.5806C12.6315 20.3824 9.26673 19.5974 9.26673 18.6582C9.26673 17.7202 12.6315 16.9352 17.1396 16.7335V19.7991C17.4341 19.82 18.2782 19.8699 19.4446 19.8699C20.8441 19.8699 21.5456 19.8119 21.6766 19.8003V16.7358C26.1754 16.9364 29.5321 17.7214 29.5321 18.6582C29.5321 19.5974 26.1754 20.38 21.6766 20.5795ZM21.6766 16.417V13.6736H27.954V9.49023H10.8622V13.6736H17.1396V16.4158C12.0379 16.65 8.20117 17.6611 8.20117 18.8716C8.20117 20.0821 12.0379 21.092 17.1396 21.3273V30.1185H21.6766V21.325C26.7702 21.0908 30.5976 20.0809 30.5976 18.8716C30.5976 17.6622 26.7702 16.6523 21.6766 16.417Z"
      fill="#545454"
    />
  </svg>
);

const JumpIcon = () => (
  <svg
    width="16"
    height="15"
    viewBox="0 0 16 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.7119 0.885752L6.49108 8.80242M14.7119 0.885752L14.712 5.63575M14.7119 0.885752L9.77947 0.885742M6.49111 0.885752H1.55859V13.5524H14.712V8.80242"
      stroke="#2D3047"
      strokeWidth="1.1875"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PolygonIcon = () => (
  <svg
    width="112"
    height="25"
    viewBox="0 0 112 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M110.268 9.74862C111.34 11.605 111.34 13.8922 110.268 15.7486L106.787 21.7785C105.715 23.6349 103.734 24.7785 101.59 24.7785L10.4092 24.7785C8.26564 24.7785 6.28487 23.6349 5.21308 21.7785L1.73173 15.7486C0.659934 13.8922 0.659935 11.605 1.73173 9.74862L5.21308 3.71875C6.28487 1.86234 8.26564 0.718749 10.4092 0.718749L101.59 0.71875C103.734 0.71875 105.715 1.86234 106.787 3.71875L110.268 9.74862Z"
      fill="#E02900"
    />
  </svg>
);

const StarIcon = () => (
  <svg
    width="10"
    height="10"
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.32185 3.95574L7.25636 6.06778L7.7455 9.05107C7.75088 9.09344 7.75088 9.12935 7.75088 9.17132C7.75088 9.32547 7.68238 9.46872 7.51767 9.46872C7.438 9.46872 7.35834 9.43926 7.29022 9.3973L4.73479 7.98938L2.17935 9.39771C2.10585 9.44008 2.03196 9.46914 1.95229 9.46914C1.78719 9.46914 1.7133 9.32589 1.7133 9.17174C1.7133 9.12937 1.71946 9.09345 1.72408 9.05148L2.21321 6.06819L0.142008 3.95616C0.0735054 3.87828 0 3.77699 0 3.66966C0 3.49049 0.177032 3.41866 0.318656 3.39567L3.17576 2.96026L4.45574 0.244942C4.50731 0.131546 4.60391 0 4.73475 0C4.8656 0 4.9622 0.131546 5.01338 0.244942L6.29415 2.96026L9.15086 3.39567C9.28633 3.41947 9.46914 3.4913 9.46914 3.66966C9.46914 3.777 9.39563 3.87828 9.32174 3.95576L9.32185 3.95574Z"
      fill="#FFD43E"
    />
  </svg>
);

const FireLevelIcon = ({ status }) => (
  <svg
    width="10"
    height="15"
    viewBox="0 0 10 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {status === 'full' ? (
      <path
        d="M8.45 4.89852C9.47968 6.50122 10 8.14498 10 9.74764C10 13.2554 7.5204 15 5.0296 15C2.5194 15 0 13.2358 0 9.98011C0 6.99595 2.1204 5.45398 1.77032 3.28658C2.52032 3.63941 3.07032 4.45613 3.16016 5.43341C4.11016 4.04257 4.52032 1.99562 4.03048 0C5.51016 0.776553 7.76008 3.46763 7.93048 6.49191C8.32032 6.13908 8.43048 5.54446 8.4508 4.89945L8.45 4.89852Z"
        fill="#FF4F28"
      />
    ) : status === 'half' ? (
      <>
        <path
          d="M8.09824 6.67726C8.3867 6.41619 8.53967 6.05696 8.61981 5.66962C9.37418 7.03282 9.75 8.40914 9.75 9.74764C9.75 11.4386 9.15434 12.6837 8.2777 13.507C7.39752 14.3337 6.21819 14.75 5.0296 14.75C2.63168 14.75 0.25 13.0733 0.25 9.98011C0.25 8.5499 0.75577 7.46408 1.24248 6.43385C1.25031 6.41729 1.25814 6.40073 1.26596 6.38417C1.66581 5.53816 2.06118 4.70164 2.05919 3.76398C2.51797 4.14028 2.84587 4.74558 2.91121 5.4563L2.9748 6.14803L3.3666 5.57442C4.26538 4.25857 4.69506 2.39438 4.3917 0.522767C4.99217 0.960222 5.67405 1.66166 6.26374 2.54217C7.01469 3.66348 7.59883 5.04975 7.68088 6.50597L7.71031 7.02837L8.09824 6.67726Z"
          stroke="#FF5029"
          strokeWidth="0.5"
        />
        <mask
          id="fire-level-mask"
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="10"
          height="15"
        >
          <path
            d="M8.45 4.89852C9.47968 6.50122 10 8.14498 10 9.74764C10 13.2554 7.5204 15 5.0296 15C2.5194 15 0 13.2358 0 9.98011C0 6.99595 2.1204 5.45398 1.77032 3.28658C2.52032 3.63941 3.07032 4.45613 3.16016 5.43341C4.11016 4.04257 4.52032 1.99562 4.03048 0C5.51016 0.776553 7.76008 3.46763 7.93048 6.49191C8.32032 6.13908 8.43048 5.54446 8.4508 4.89945L8.45 4.89852Z"
            fill="#FF4F28"
          />
        </mask>
        <g mask="url(#fire-level-mask)">
          <rect x="-6" y="-4" width="11" height="22" fill="#FF4F28" />
        </g>
      </>
    ) : (
      <path
        d="M8.09824 6.67726C8.3867 6.41619 8.53967 6.05696 8.61981 5.66962C9.37418 7.03282 9.75 8.40914 9.75 9.74764C9.75 11.4386 9.15434 12.6837 8.2777 13.507C7.39752 14.3337 6.21819 14.75 5.0296 14.75C2.63168 14.75 0.25 13.0733 0.25 9.98011C0.25 8.5499 0.75577 7.46408 1.24248 6.43385C1.25031 6.41729 1.25814 6.40073 1.26596 6.38417C1.66581 5.53816 2.06118 4.70164 2.05919 3.76398C2.51797 4.14028 2.84587 4.74558 2.91121 5.4563L2.9748 6.14803L3.3666 5.57442C4.26538 4.25857 4.69506 2.39438 4.3917 0.522767C4.99217 0.960222 5.67405 1.66166 6.26374 2.54217C7.01469 3.66348 7.59883 5.04975 7.68088 6.50597L7.71031 7.02837L8.09824 6.67726Z"
        stroke="#FF5029"
        strokeWidth="0.5"
      />
    )}
  </svg>
);
