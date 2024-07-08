import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';

import ListItem from '@material-ui/core/ListItem';
import Select from '@material-ui/core/Select';

import BopCard from 'components/MusicDao/components/Cards/BopCard';
import { BopsCombineCard } from 'components/MusicDao/components/Cards/BopsCombineCard';
import { ConfirmIcon } from 'components/MusicDao/subPages/PotionSongDetailPage';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { getRandomAvatar } from 'shared/services/user/getUserAvatar';
import {
  Avatar,
  Color,
  Gradient,
  Modal,
  PrimaryButton,
  SecondaryButton
} from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box';
import { combineBopsModalStyles } from './index.styles';

export const CombineBopsModal = (props: any) => {
  const classes = combineBopsModalStyles();
  const { showAlertMessage } = useAlertMessage();

  const [step, setStep] = React.useState<number>(0);
  const [parentBop1, setParentBop1] = React.useState<any>();
  const [parentBop2, setParentBop2] = React.useState<any>();

  const firstScreen = () => (
    <Box px={8}>
      <Box className={classes.header1} mt={3}>
        In order to combine your Bops there is an initial amout of TRAX and
        Beats to breed your new Bop
      </Box>
      <Box className={classes.greenBox} mt={2} width={1}>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Box pr={4} borderRight="1px solid #DAE6E5" textAlign="start">
            <Box className={classes.header2}>Myx needed for staking </Box>
            <Box className={classes.header3}>
              5 <span>TRAX</span>
            </Box>
          </Box>
          <Box pl={4} textAlign="start">
            <Box className={classes.header2}>beats needed </Box>
            <Box className={classes.header3}>
              10 <span>BEATS</span>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const getBopsSelector = (type) => {
    return (
      <Select
        className={classes.select}
        value={
          type === 1
            ? parentBop1 || 'Pick position'
            : parentBop2 || 'Pick position'
        }
        MenuProps={{
          classes: { paper: classes.paper },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          },
          getContentAnchorEl: null
        }}
        native={false}
        renderValue={(value: any) => <Box>{value || 'Pick position'}</Box>}
        onChange={(e) =>
          type === 1
            ? setParentBop1(e.target.value)
            : setParentBop2(e.target.value)
        }
      >
        {props.songs?.map((item, index) => (
          <ListItem
            key={index}
            value={item.song_name}
            style={{ pointerEvents: 'none' }}
          >
            <Box
              display="flex"
              alignItems="center"
              pb={1}
              className={classes.header4}
            >
              <Box display="flex" alignItems="center" flexGrow={1}>
                <Box className={classes.imgBox}>
                  <img
                    src={
                      item.album_image ??
                      require('assets/backgrounds/music_art.webp')
                    }
                    className={classes.img}
                  />
                  <Box className={classes.avatarBox}>
                    <Avatar
                      size="small"
                      url={item.artist_image ?? getRandomAvatar()}
                    />
                  </Box>
                </Box>
                <Box ml={2} className={classes.tableCell}>
                  {item.artist_name}
                </Box>
                <Box ml={2} className={classes.tableCell} width="200px">
                  {item.song_name}
                </Box>
                <Box ml={6} className={classes.tableCell}>
                  {item.genres}
                </Box>
                <Box ml={2} className={classes.tableCell}>
                  122424 USDC
                </Box>
                <Box ml={2} className={classes.tableCell}>
                  Level 12
                </Box>
                <Box mx={2} className={classes.tableCell}>
                  2244 Beats
                </Box>
                <PrimaryButton
                  size="small"
                  isRounded
                  style={{
                    background: Color.MusicDAOGreen,
                    pointerEvents: 'auto'
                  }}
                >
                  Select
                </PrimaryButton>
              </Box>
            </Box>
          </ListItem>
        ))}
      </Select>
    );
  };

  const secondScreen = () => (
    <Box borderTop="1px solid #00000022" mt={2} pt={4}>
      <Box display="flex">
        <Box width={1} mr={2} textAlign="start">
          <Box
            className={classes.header3}
            style={{ color: Color.MusicDAOLightBlue }}
          >
            Parent Bop 1
          </Box>
          {getBopsSelector(1)}
          {parentBop1 && (
            <Box mt={2} width={1}>
              <BopCard
                pod={props.songs.find((item) => item.song_name === parentBop1)}
              />
            </Box>
          )}
        </Box>
        <img
          src={require('assets/musicDAOImages/mix_bops.svg')}
          style={{ marginTop: '32px' }}
        />
        <Box width={1} ml={2} textAlign="start">
          <Box
            className={classes.header3}
            style={{ color: Color.MusicDAOLightBlue }}
          >
            Parent Bop 2
          </Box>
          {getBopsSelector(2)}
          {parentBop2 && (
            <Box mt={2} width={1}>
              <BopCard
                pod={props.songs.find((item) => item.song_name === parentBop2)}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );

  const thirdScreen = () => (
    <>
      <Box className={classes.mixBox} mt={2}>
        <Box className={classes.screBox} />
        <img
          className={classes.circleGroupBox}
          src={require('assets/musicDAOImages/circle_group.webp')}
        />
        {parentBop1 && (
          <Box mt={2} width="40%">
            <BopCard
              pod={props.songs.find((item) => item.song_name === parentBop1)}
            />
          </Box>
        )}
        {parentBop2 && (
          <Box mt={2} width="40%">
            <BopCard
              pod={props.songs.find((item) => item.song_name === parentBop2)}
            />
          </Box>
        )}
      </Box>
      <img src={require('assets/musicDAOImages/mix_bops.svg')} />
      <Box className={classes.title} mt={4}>
        Combining your Bops
      </Box>
      <Box className={classes.header1} mt={1} mb={2}>
        This can take a few minutes so please be patient.
      </Box>
      <CopyToClipboard
        text={'0xf273a38fec99acf1e....eba'}
        onCopy={() => {
          showAlertMessage('Copied to clipboard', { variant: 'success' });
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ cursor: 'pointer' }}
        >
          <Box className={classes.header1} mr={1}>
            Hash:
          </Box>
          <Box className={classes.header2} mr={1}>
            0xf273a38fec99acf1e....eba
          </Box>
          <CopyIcon />
        </Box>
      </CopyToClipboard>
      <PrimaryButton
        size="medium"
        style={{ background: Color.MusicDAOGreen, marginTop: '24px' }}
        isRounded
        onClick={() => setStep(3)}
      >
        Check on Polygon Scan
      </PrimaryButton>
    </>
  );

  const fourthScreen = () => (
    <>
      <Box className={classes.mixBox} mt={2}>
        <BopsCombineCard pod={1} />
        <img
          className={classes.circleGroupBox}
          src={require('assets/musicDAOImages/circle_group.webp')}
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
        <Box
          className={classes.customButtonBox}
          mx={1}
          width={1}
          onClick={() => setStep(4)}
        >
          <ConfirmIcon color={'#FF8E3C'} />
          <Box zIndex={1} p={2} style={{ fontSize: 14 }}>
            Breed
          </Box>
        </Box>
        <Box className={classes.customButtonBox} mx={1} width={1}>
          <ConfirmIcon color={Color.MusicDAODark} />
          <Box zIndex={1} p={2} style={{ fontSize: 14 }}>
            Close
          </Box>
        </Box>
      </Box>
    </>
  );

  const resultScreen = () => {
    return (
      <Box>
        <Box display="flex" justifyContent="center" alignItems="center">
          {parentBop1 && (
            <Box mt={2} width="40%">
              <BopCard
                pod={props.songs.find((item) => item.song_name === parentBop1)}
              />
            </Box>
          )}
          <Box className={classes.resultBorderBox}>
            <Box display="flex" alignItems="start" justifyContent="center">
              <Box
                pr={3}
                display="flex"
                alignItems="center"
                justifyContent="start"
                flexDirection="column"
              >
                <Box className={classes.circleBox}>
                  <img src={require('assets/musicDAOImages/headphone.webp')} />
                </Box>
                <Box className={classes.header1} mt={1}>
                  Reproductions <br />
                  last week
                </Box>
                <Box className={classes.header2}>2424</Box>
              </Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="start"
                flexDirection="column"
              >
                <Box className={classes.circleBox}>
                  <img src={require('assets/musicDAOImages/share.webp')} />
                </Box>
                <Box
                  className={classes.header1}
                  style={{
                    borderLeft: '1px solid #00000022',
                    borderRight: '1px solid #00000022'
                  }}
                  px={3}
                  mt={1}
                >
                  Shared <br />
                  last week
                </Box>
                <Box className={classes.header2}>2424</Box>
              </Box>
              <Box
                pl={3}
                display="flex"
                alignItems="center"
                justifyContent="start"
                flexDirection="column"
              >
                <Box className={classes.circleBox}>
                  <img src={require('assets/musicDAOImages/share.webp')} />
                </Box>
                <Box className={classes.header1} mt={1}>
                  Bops
                </Box>
                <Box className={classes.header2}>2424</Box>
              </Box>
            </Box>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mt={2}
            >
              <Box className={classes.customButtonBox} mx={1} width={1}>
                <ConfirmIcon color={'#FF8E3C'} />
                <Box zIndex={1} p={2} style={{ fontSize: 14 }}>
                  Breed Bop
                </Box>
              </Box>
              <Box className={classes.customButtonBox} mx={1} width={1}>
                <ConfirmIcon color={Color.MusicDAODark} />
                <Box zIndex={1} p={2} style={{ fontSize: 14 }}>
                  Increase intensity
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" px={6}>
          <SecondaryButton size="medium" isRounded style={{ width: '100%' }}>
            Close
          </SecondaryButton>{' '}
          <PrimaryButton
            size="medium"
            isRounded
            style={{ width: '100%', background: Color.MusicDAODark }}
          >
            Go to card details
          </PrimaryButton>
        </Box>
      </Box>
    );
  };

  return (
    <Modal
      size="daoMedium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
      style={
        step === 4
          ? {
              backgroundImage: `url(${require('assets/musicDAOImages/combine_background.webp')})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover'
            }
          : {}
      }
    >
      {step < 2 && (
        <>
          <img src={require('assets/musicDAOImages/combine_bops_top.svg')} />
          <Box className={classes.title}>Combine Bops</Box>
          <Box className={classes.header1} mt={1}>
            You can combine 2 of your Bops into a new unique Bop
          </Box>
        </>
      )}
      {step === 3 && (
        <>
          <Box className={classes.title}>
            Congrats! Your new track is combining.{' '}
          </Box>
          <Box className={classes.header1} mt={1}>
            While waiting x days for hatching new track you can keep breeding
            your new track to increase the intensity and level
          </Box>
        </>
      )}
      {step === 4 && (
        <>
          <Box className={classes.title}>Congrats! You created new Bop</Box>
          <Box className={classes.header1} mt={1}>
            Enjoy your creation ahs share it with the world!
          </Box>
        </>
      )}
      {step === 0
        ? firstScreen()
        : step === 1
        ? secondScreen()
        : step === 2
        ? thirdScreen()
        : step === 3
        ? fourthScreen()
        : resultScreen()}
      {step < 3 && (
        <Box className={classes.bottomBox} mt={3}>
          <img
            src={require('assets/musicDAOImages/spread.svg')}
            className={classes.spreadImg}
          />
          <Box style={{ background: Gradient.Green1 }} width={1} height="2px" />
          <Box
            className={classes.customButtonBox}
            mx={2}
            onClick={() => {
              if (step !== 1 || (parentBop1 && parentBop2))
                setStep((prev) => prev + 1);
            }}
          >
            <ConfirmIcon color={Color.MusicDAODark} />
            <Box mx={5} zIndex={1} p={2}>
              Next
            </Box>
          </Box>
          <Box
            style={{ background: Gradient.Green1, transform: 'rotate(180deg)' }}
            width={1}
            height="2px"
          />
        </Box>
      )}
    </Modal>
  );
};

const CopyIcon = () => (
  <svg
    width="18"
    height="17"
    viewBox="0 0 18 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.5833 10.0833H14.8333C15.7538 10.0833 16.5 9.37445 16.5 8.5V2.95833C16.5 2.08388 15.7538 1.375 14.8333 1.375H9C8.07953 1.375 7.33333 2.08388 7.33333 2.95833V4.14583M3.16667 15.625H9C9.92047 15.625 10.6667 14.9161 10.6667 14.0417V8.5C10.6667 7.62555 9.92047 6.91667 9 6.91667H3.16667C2.24619 6.91667 1.5 7.62555 1.5 8.5V14.0417C1.5 14.9161 2.24619 15.625 3.16667 15.625Z"
      stroke="#65CB63"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
