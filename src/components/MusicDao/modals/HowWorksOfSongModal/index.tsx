import React from 'react';
import styled from 'styled-components';

import makeStyles from '@material-ui/core/styles/makeStyles';
import useTheme from '@material-ui/core/styles/useTheme';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Box from 'shared/ui-kit/Box';
import { Modal } from 'shared/ui-kit';

const StepList = [
  {
    name: 'Select audio file(s) status',
    description: (
      <>
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;The first step is to select if you
        already have the audio file(s) or not. If you do not have the audio
        file(s) yet, you can choose to crowdfund.
      </>
    ),
    tcolor: '#FFD43E',
    bcolor: 'linear-gradient(0deg, #FAFBF2, #FAFBF2), #17172D'
  },
  {
    name: 'Select single owner or collab:',
    description: (
      <>
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;The next steps is to select whether you
        own the audio file(s) solo or if you are part of a collaboration, for
        example other artists or a label.
      </>
    ),
    tcolor: '#65CB63',
    bcolor: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
  },
  {
    name: 'Create your music NFTs',
    description: (
      <>
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;Add a track or tracks and then set the
        NFT settings of that track, including streaming and royalties settings,
        then you upload and encrypt the track. Be patient during encryption and
        if you are an artist that needs some advice head to our Discord!
      </>
    ),
    tcolor: '#2F64B4',
    bcolor: '#DCEAFF'
  },
  {
    name: 'Create your Capsule collection',
    description: (
      <>
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;Add the details of your capsule, such as
        name, image and description. You can add as many tracks and NFTs into a
        collection as you want.
      </>
    ),
    tcolor: '#FF9900',
    bcolor: 'rgba(255, 153, 0, 0.3)'
  },
  {
    name: 'Common FAQs:',
    description: (
      <>
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;You add images for both NFTs and the
        Capsule collection
        <br />
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;Encryption times vary, it depends on your
        connection. If it fails, try and upload the tracks again
        <br />
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;Creating content works best with Chrome
        browser
        <br />
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;You need $MATIC on Polygon to cover fees
        <br />
        &nbsp;&nbsp;&#8226;&nbsp;&nbsp;All NFTs are available on OpenSea after
        minting with short audio clips attached, please be patient as OpenSea
        recognizes the data
      </>
    ),
    tcolor: '#AECA00',
    bcolor: 'linear-gradient(0deg, #F6FFBE, #F6FFBE), #17172D'
  }
];

const useStyles = makeStyles((theme) => ({
  root: {
    color: '#2D3047',
    width: '645px !important',
    padding: '0 0 !important',
    '& path': {
      stroke: (props: any) => (props.type === 'pod' ? undefined : 'white')
    }
  },
  container: {
    width: '100%',
    height: '100%'
  },
  dlgTitle: {
    color: '#fff',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: '48px 0',
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 49.94%, #ffffff 100%), conic-gradient(from 116deg at 43.63% 99.9%, #4434FF 224.01deg, #250EB3 325.93deg), linear-gradient(97.63deg, #99CE00 26.36%, #0DCC9E 80%)'
  },
  header: {
    fontSize: 32,
    fontWeight: 400,
    '& span': {
      fontWeight: 800
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '26px !important'
    }
  },
  header1: {
    fontSize: 30,
    fontWeight: 600,
    [theme.breakpoints.down('xs')]: {
      fontSize: '26px !important'
    }
  },
  mainBoxNew: {
    display: 'flex',
    flexDirection: 'column',
    height: '450px',
    overflowY: 'scroll',
    margin: '0 24px 32px 32px',
    [theme.breakpoints.down('xs')]: {
      margin: '0 8px 32px 8px'
    },
    '&::-webkit-scrollbar': {
      width: 14
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#B8C1D6',
      border: '4px solid transparent',
      backgroundClip: 'content-box'
    },
    '&::-webkit-scrollbar-track': {
      background: '#F8F8FA'
    },
    /* Buttons */
    '&::-webkit-scrollbar-button:single-button': {
      display: 'block',
      backgroundSize: '10px',
      backgroundRepeat: 'no-repeat',
      background: '#F8F8FA'
    },
    /* Up */
    '&::-webkit-scrollbar-button:single-button:vertical:decrement': {
      backgroundPosition: 'center 4px',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(73, 73, 73)'><polygon points='50,00 0,50 100,50'/></svg>")`
    },

    '&::-webkit-scrollbar-button:single-button:vertical:decrement:hover': {
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(112, 112, 112)'><polygon points='50,00 0,50 100,50'/></svg>")`
    },
    '&::-webkit-scrollbar-button:single-button:vertical:decrement:active': {
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(128, 128, 128)'><polygon points='50,00 0,50 100,50'/></svg>")`
    },
    /* Down */
    '&::-webkit-scrollbar-button:single-button:vertical:increment': {
      backgroundPosition: 'center 2px',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(73, 73, 73)'><polygon points='0,0 100,0 50,50'/></svg>")`
    },

    '&::-webkit-scrollbar-button:single-button:vertical:increment:hover': {
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(112, 112, 112)'><polygon points='0,0 100,0 50,50'/></svg>")`
    },

    '&::-webkit-scrollbar-button:single-button:vertical:increment:active': {
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='rgb(128, 128, 128)'><polygon points='0,0 100,0 50,50'/></svg>")`
    }
  },
  blockNew: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    padding: '0 20px'
  },
  titleNew: {
    fontWeight: 800,
    fontSize: 20,
    lineHeight: '150%',
    textAlign: 'center',
    margin: '6px 0 8px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  descriptionNew: {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '150%',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  image: {
    width: 95,
    height: 95,
    [theme.breakpoints.down('xs')]: {
      width: 70,
      height: 70
    }
  },
  podContainer: {
    padding: '48px 36px 53px',
    background: 'white',
    [theme.breakpoints.down('xs')]: {
      padding: '48px 12px 53px'
    }
  }
}));

const HowWorksOfSongModal = (props) => {
  const classes = useStyles(props);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.container}>
        {props.type === 'pod' && (
          <Box className={classes.podContainer}>
            <Box className={classes.header1} textAlign={'center'}>
              Creating Content On Myx
            </Box>
            <Box
              className={classes.mainBoxNew}
              style={{ margin: 0, height: 500, paddingBottom: 12 }}
            >
              {StepList.map((step, index) => (
                <StepContainer
                  key={`step-item-${index}`}
                  tColor={step.tcolor}
                  bColor={step.bcolor}
                >
                  <div className="tag">STAGE 0{index}</div>
                  <div className="title">
                    <div>{index}</div>
                    <span>{step.name}</span>
                  </div>
                  <div className="desc">{step.description}</div>
                </StepContainer>
              ))}
            </Box>
          </Box>
        )}
        {props.type === 'song' && (
          <>
            <Box className={classes.dlgTitle}>
              <div className={classes.header}>
                <span>How does</span> it work?
              </div>
            </Box>
            <Box className={classes.mainBoxNew}>
              <Box className={classes.blockNew}>
                <img
                  className={classes.image}
                  src={require('assets/icons/how_works_song_1.webp')}
                />
                <Box className={classes.titleNew}>
                  Privacy, encryption & protection
                </Box>
                <Box className={classes.descriptionNew}>
                  Tracks are encrypted into chunks and stored on IPFS - the
                  distributed file system powering Web3. This helps artists and
                  track owners to be protected from piracy.
                </Box>
              </Box>
              <Box className={classes.blockNew}>
                <img
                  className={classes.image}
                  src={require('assets/icons/how_works_song_2.webp')}
                />
                <Box className={classes.titleNew}>Streaming + NFTs</Box>
                <Box className={classes.descriptionNew}>
                  Tracks are streamed as NFTs on Myx and with every stream, the
                  NFTs are capturing and distributing revenue transparently.
                  These NFTs are automatically created on OpenSea as well as
                  tradable on Myx.
                </Box>
              </Box>
              <Box className={classes.blockNew}>
                <img
                  className={classes.image}
                  src={require('assets/icons/how_works_song_3.webp')}
                />
                <Box className={classes.titleNew}>
                  Flexible royalty settings
                </Box>
                <Box className={classes.descriptionNew}>
                  Track owners can receive royalties in perpetuity if the NFT is
                  sold, while always receiving revenue from streaming if the
                  track is played in Myx.
                  <br />
                  <br />
                  Myx allows full control of the % of royalties sent to artists,
                  labels or others through defining ERC20 addresses of receiving
                  accounts for individuals or groups via multisignature
                  accounts.
                  <br />
                  <br />
                  Hover over icons{' '}
                  <span>
                    <InfoIcon />
                  </span>{' '}
                  for more details along the process of creation.
                  <br />
                  <br />
                  <br />
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default HowWorksOfSongModal;

interface StepContainerProps {
  bColor: string;
  tColor: string;
}

const StepContainer = styled.div<StepContainerProps>`
  position: relative;
  background: ${(p: any) => `${p.bColor}`};
  border: ${(p: any) => `1px solid ${p.tColor}`};
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 16px;
  padding: 16px;
  margin-top: 56px;

  .tag {
    position: absolute;
    top: -17px;
    right: 15px;
    padding: 8px 16px;
    background: ${(p: any) => `${p.tColor}`};
    color: white;
    font-family: Agrandir;
    font-style: normal;
    font-weight: 800;
    font-size: 12px;
    line-height: 150%;
    color: #f7f9fe;
    border-radius: 8px;
  }

  .title {
    display: flex;
    align-items: center;

    div {
      width: 36px;
      height: 36px;
      border-radius: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: ${(p: any) => `${p.tColor}`};
      font-family: Agrandir;
      font-style: normal;
      font-weight: 800;
      font-size: 16px;
      line-height: 120%;
      color: #ffffff;
      margin-right: 8px;
    }

    span {
      font-family: Agrandir;
      font-style: normal;
      font-weight: 800;
      font-size: 16px;
      line-height: 150%;
      color: ${(p: any) => `${p.tColor}`};
    }
  }

  .desc {
    font-family: Montserrat;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 150%;
    letter-spacing: 0.02em;
    color: #2d3047;
    margin-top: 8px;

    span {
      text-decoration: underline;
    }
  }
`;

const InfoIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ marginLeft: '8px', marginRight: '8px' }}
  >
    <rect width="14" height="14" rx="7" fill="#1ABB00" />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M7.5404 4.06095C7.5404 4.47365 7.21368 4.80611 6.79524 4.80611C6.38254 4.80611 6.05008 4.47365 6.05008 4.06095C6.05008 3.64251 6.38254 3.31006 6.79524 3.31006C7.21368 3.31006 7.5404 3.64251 7.5404 4.06095ZM8.59509 9.59806C8.59509 9.83307 8.41166 9.9993 8.17665 9.9993H5.84373C5.60872 9.9993 5.42529 9.83307 5.42529 9.59806C5.42529 9.37451 5.60872 9.19682 5.84373 9.19682H6.5545V6.56583H5.94117C5.70616 6.56583 5.52274 6.39961 5.52274 6.16459C5.52274 5.94105 5.70616 5.76335 5.94117 5.76335H7.01879C7.31112 5.76335 7.46588 5.96971 7.46588 6.27923V9.19682H8.17665C8.41166 9.19682 8.59509 9.37451 8.59509 9.59806Z"
      fill="white"
    />
  </svg>
);
