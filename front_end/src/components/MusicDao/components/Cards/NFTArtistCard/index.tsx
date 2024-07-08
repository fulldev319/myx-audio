import React from 'react';
import { useHistory } from 'react-router-dom';

import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { convertImgUrl, processImage } from 'shared/helpers';
import SkeletonBox from 'shared/ui-kit/SkeletonBox';

import { nftArtistCardStyles } from './index.style';

const NFTArtistCard = ({
  data,
  index,
  isLoading = false,
  handleClick = true
}) => {
  const classes = nftArtistCardStyles();
  const theme = useTheme();
  const history = useHistory();

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const imagePath = React.useMemo(() => {
    return processImage(data?.image);
  }, [data]);

  const shortId = (id) => {
    if (!id || id.length < 12) {
      return id;
    }
    return id.substring(0, 6) + '...' + id.substring(id.length - 4);
  };

  const handleGoToOpenseaArtist = (name) => {
    // const isProd = process.env.REACT_APP_ENV === 'prod';
    window.open(`https://opensea.io/${name}`, '_blank');
    // window.open(`https://${!isProd ? 'testnets.' : ''}opensea.io/${artist?.name}`,'_blank');
  };

  return (
    <Box className={classes.container}>
      <img
        src={require('assets/backgrounds/nft_owner_card_no_bg.svg')}
        style={{
          top: 2,
          left: 2,
          position: 'absolute',
          width: '50%',
          height: '50%'
        }}
      ></img>
      <img
        src={require('assets/backgrounds/nft_owner_card_bg.svg')}
        style={{
          top: 0,
          left: 0,
          position: 'absolute',
          width: '100%',
          height: '100%'
        }}
      ></img>
      {!isLoading && <Box className={classes.sideNo}>{index}</Box>}
      <Box className={classes.mainContainer}>
        <Box
          onClick={() =>
            handleClick &&
            data &&
            data.address &&
            history.push(`/marketplace/artists/${data.address}`)
          }
          style={{ zIndex: 1, textAlign: 'center' }}
          width={1}
          px={2}
        >
          <Box
            className={classes.image}
            style={{
              backgroundImage: isLoading
                ? 'none'
                : `url(${
                    convertImgUrl(imagePath) ??
                    require('assets/musicDAOImages/marketplace_avatar_sample.webp')
                  })`
            }}
          >
            {isLoading && <SkeletonBox loading width="100%" height="100%" />}
          </Box>
          <Box className={classes.name}>
            {isLoading ? (
              <SkeletonBox loading width={isMobile ? 95 : 122} height={14} />
            ) : (
              data?.name
            )}
          </Box>
        </Box>
        <Box className={classes.address}>
          <Box
            mr={1}
            onClick={() => handleGoToOpenseaArtist(data.name)}
            style={{ cursor: 'pointer' }}
          >
            <OpenseaIcon />
          </Box>
          {isLoading ? (
            <SkeletonBox loading width={isMobile ? 95 : 122} height={14} />
          ) : (
            shortId(data?.address)
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default NFTArtistCard;

export const OpenseaIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_7431_101126)">
      <path
        d="M22.0004 11.0554C22.0004 16.9709 17.2043 21.767 11.2888 21.767C5.37323 21.767 0.577148 16.9709 0.577148 11.0554C0.577148 5.13983 5.37323 0.34375 11.2888 0.34375C17.2055 0.34375 22.0004 5.13983 22.0004 11.0554Z"
        fill="#2081E2"
      />
      <path
        d="M5.86199 11.4154L5.9082 11.3427L8.69471 6.98358C8.73544 6.91976 8.83118 6.92636 8.86199 6.99568C9.32751 8.03897 9.7292 9.33649 9.54102 10.1443C9.46068 10.4766 9.24058 10.9267 8.99295 11.3427C8.96105 11.4033 8.92583 11.4627 8.8884 11.5199C8.87079 11.5463 8.84108 11.5617 8.80916 11.5617H5.94341C5.86638 11.5617 5.82126 11.4781 5.86199 11.4154Z"
        fill="white"
      />
      <path
        d="M18.2824 12.2258V12.9158C18.2824 12.9554 18.2582 12.9906 18.223 13.0061C18.0073 13.0985 17.2688 13.4375 16.9618 13.8645C16.1782 14.9551 15.5795 16.5145 14.2413 16.5145H8.65835C6.67964 16.5145 5.07617 14.9056 5.07617 12.9202V12.8564C5.07617 12.8036 5.11908 12.7606 5.17191 12.7606H8.28419C8.34581 12.7606 8.39092 12.8179 8.38544 12.8784C8.36342 13.0809 8.40084 13.2878 8.49658 13.476C8.68147 13.8513 9.06445 14.0857 9.47824 14.0857H11.019V12.8828H9.49585C9.41772 12.8828 9.37151 12.7925 9.41663 12.7287C9.43312 12.7034 9.45185 12.677 9.47164 12.6473C9.61582 12.4426 9.82161 12.1246 10.0263 11.7625C10.1661 11.5182 10.3014 11.2573 10.4104 10.9954C10.4324 10.9481 10.45 10.8997 10.4676 10.8523C10.4973 10.7687 10.5281 10.6906 10.5501 10.6124C10.5722 10.5464 10.5898 10.4771 10.6074 10.4121C10.6591 10.1898 10.6811 9.95431 10.6811 9.71C10.6811 9.61426 10.6767 9.51411 10.6679 9.41837C10.6635 9.31382 10.6503 9.20926 10.6371 9.10471C10.6283 9.01227 10.6118 8.92092 10.5942 8.82518C10.5722 8.68542 10.5413 8.54676 10.5061 8.40698L10.494 8.35417C10.4676 8.25841 10.4456 8.16708 10.4148 8.07134C10.3278 7.77088 10.2277 7.47815 10.122 7.20413C10.0835 7.09517 10.0395 6.99062 9.99548 6.88608C9.93057 6.7287 9.86452 6.58564 9.804 6.45027C9.77319 6.38863 9.74678 6.3325 9.72036 6.27528C9.69065 6.21035 9.65984 6.14541 9.62901 6.0838C9.60701 6.03648 9.58169 5.99245 9.56408 5.94843L9.3759 5.60066C9.34948 5.55334 9.39351 5.49721 9.44523 5.51152L10.6228 5.83066H10.6261C10.6283 5.83066 10.6294 5.83178 10.6305 5.83178L10.7857 5.87469L10.9562 5.92313L11.019 5.94071V5.2408C11.019 4.90293 11.2897 4.62891 11.6243 4.62891C11.7915 4.62891 11.9434 4.69714 12.0524 4.80828C12.1613 4.91945 12.2295 5.07132 12.2295 5.2408V6.27969L12.355 6.31489C12.3649 6.31821 12.3748 6.32261 12.3836 6.3292C12.4144 6.35232 12.4584 6.38642 12.5146 6.42826C12.5586 6.46346 12.6059 6.50639 12.6631 6.55042C12.7765 6.64175 12.9119 6.75951 13.0604 6.89488C13.1 6.92899 13.1386 6.96421 13.1738 6.99943C13.3653 7.17771 13.5799 7.3868 13.7846 7.61792C13.8418 7.68285 13.8979 7.74888 13.9552 7.8182C14.0124 7.88864 14.0729 7.95797 14.1257 8.02732C14.1951 8.11976 14.2699 8.2155 14.3348 8.31565C14.3656 8.36297 14.4009 8.41139 14.4306 8.45872C14.5142 8.58526 14.588 8.71624 14.6584 8.8472C14.6881 8.90772 14.7189 8.97375 14.7453 9.03868C14.8235 9.21367 14.8851 9.39195 14.9247 9.57024C14.9368 9.60876 14.9456 9.65058 14.95 9.688V9.69681C14.9632 9.74962 14.9676 9.80574 14.972 9.86297C14.9896 10.0457 14.9808 10.2283 14.9412 10.4121C14.9247 10.4903 14.9027 10.564 14.8763 10.6421C14.8499 10.717 14.8235 10.7951 14.7894 10.8688C14.7233 11.0218 14.6452 11.1748 14.5527 11.3179C14.523 11.3707 14.4878 11.4268 14.4526 11.4796C14.4141 11.5358 14.3745 11.5886 14.3392 11.6403C14.2908 11.7063 14.2391 11.7757 14.1863 11.8373C14.1389 11.9022 14.0905 11.9672 14.0377 12.0244C13.964 12.1113 13.8935 12.1939 13.8198 12.2731C13.7758 12.3248 13.7285 12.3777 13.68 12.425C13.6327 12.4778 13.5843 12.5251 13.5403 12.5691C13.4665 12.6429 13.4049 12.7001 13.3532 12.7474L13.2321 12.8586C13.2145 12.874 13.1914 12.8828 13.1672 12.8828H12.2295V14.0857H13.4093C13.6734 14.0857 13.9244 13.9921 14.1268 13.8204C14.1962 13.7599 14.4988 13.498 14.8565 13.1029C14.8686 13.0897 14.884 13.0798 14.9016 13.0754L18.1602 12.1334C18.2208 12.1157 18.2824 12.162 18.2824 12.2258Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_7431_101126">
        <rect
          width="21.4232"
          height="21.4232"
          fill="white"
          transform="translate(0.577148 0.34375)"
        />
      </clipPath>
    </defs>
  </svg>
);
