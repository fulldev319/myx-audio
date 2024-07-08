import React from 'react';
import { TwitterShareButton } from 'react-share';

import makeStyles from '@material-ui/core/styles/makeStyles';

import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles((theme) => ({
  shareBox: {
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1.5),
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    textAlign: 'center',
    border: '1px solid rgba(84, 101, 143, 0.3)'
  },
  title: {
    fontSize: 16,
    fontWeight: 800
  },
  shareButton: {
    borderRadius: '50%',
    background: '#2D3047',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(5),
    height: theme.spacing(5)
  }
}));

const ShareNFTBox = ({ shareLink }) => {
  const classes = useStyles();
  return (
    <Box className={classes.shareBox} mt={2}>
      <Box className={classes.title}>Share on:</Box>
      <Box display="flex" mt={1} justifyContent="center">
        <TwitterShareButton
          title={`Check out this track on Myx, A Web3 music streaming platform for artists and fans!`}
          url={shareLink}
        >
          <Box className={classes.shareButton}>
            <TwitterIcon />
          </Box>
        </TwitterShareButton>
      </Box>
    </Box>
  );
};

export default ShareNFTBox;

const FaceBookIcon = () => (
  <svg
    width="12"
    height="22"
    viewBox="0 0 12 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10.6661 4.42657C10.0581 4.30633 9.2368 4.21651 8.72029 4.21651C7.32171 4.21651 7.23086 4.81769 7.23086 5.77959V7.49192H10.727L10.4222 11.0389H7.23086V21.8278H2.85341V11.0389H0.603516V7.49192H2.85341V5.29793C2.85341 2.2927 4.28204 0.609375 7.86899 0.609375C9.1152 0.609375 10.0273 0.789732 11.2127 1.03021L10.6661 4.42657Z"
      fill="white"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg
    width="24"
    height="19"
    viewBox="0 0 24 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11.8996 5.07869L11.9494 5.84348L11.119 5.74984C8.0961 5.39085 5.45526 4.17342 3.21303 2.12876L2.11683 1.11423L1.83448 1.86342C1.23655 3.53349 1.61856 5.2972 2.86424 6.48342C3.52861 7.13895 3.37913 7.2326 2.2331 6.8424C1.83448 6.71754 1.48569 6.62389 1.45247 6.67071C1.33621 6.77997 1.73483 8.2003 2.0504 8.7622C2.48223 9.5426 3.36252 10.3074 4.32584 10.76L5.13969 11.119L4.17636 11.1346C3.24625 11.1346 3.21303 11.1502 3.31269 11.478C3.64487 12.4925 4.95699 13.5695 6.41859 14.0377L7.44835 14.3655L6.55146 14.865C5.22273 15.5829 3.66148 15.9887 2.10023 16.02C1.35282 16.0356 0.738281 16.098 0.738281 16.1448C0.738281 16.3009 2.76459 17.175 3.94383 17.5183C7.48157 18.5329 11.6837 18.0958 14.8394 16.3633C17.0816 15.1303 19.3238 12.6798 20.3702 10.3074C20.9349 9.04314 21.4996 6.73314 21.4996 5.62497C21.4996 4.907 21.5495 4.81335 22.4796 3.95491C23.0277 3.45545 23.5425 2.90916 23.6422 2.75308C23.8083 2.45653 23.7917 2.45653 22.9446 2.72187C21.5329 3.19011 21.3335 3.12768 22.0311 2.42531C22.546 1.92585 23.1605 1.02059 23.1605 0.755248C23.1605 0.708424 22.9114 0.786464 22.6291 0.926937C22.3301 1.08302 21.6657 1.31714 21.1675 1.45761L20.2706 1.72295L19.4567 1.20788C19.0083 0.926937 18.3771 0.614775 18.0449 0.521127C17.1979 0.302614 15.9024 0.33383 15.1384 0.583559C13.0622 1.28592 11.7501 3.09646 11.8996 5.07869Z"
      fill="white"
    />
  </svg>
);
