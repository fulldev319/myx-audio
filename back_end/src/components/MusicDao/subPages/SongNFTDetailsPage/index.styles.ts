import makeStyles from '@material-ui/core/styles/makeStyles';

export const usePageStyles = makeStyles((theme) => ({
  web3ArtistRoot: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    background: 'linear-gradient(0deg, #EEF2F7, #EEF2F7), #F0F5F8',
    position: 'relative',
    fontFamily: 'Pangram'
  },
  gradientBox: {
    minHeight: 650,
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) 100.94%, #EEF2F6 92.61%), conic-gradient(from 93.1deg at 36.37% 45.34%, #2B99FF -34.07deg, #3834FF 21.26deg, #4434FF 224.01deg, #250EB3 256.07deg, #2B99FF 325.93deg, #3834FF 381.26deg)'
  },
  headerContentBox: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `65px 24px`
  },
  playButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '100%',
    width: 70,
    height: 70,
    cursor: 'pointer',
    background:
      'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    boxShadow: '0px 12px 27px rgba(47, 26, 202, 0.28)',
    marginRight: 32,
    [theme.breakpoints.down('sm')]: {
      marginRight: 12
    }
  },
  content: {
    width: '100%',
    display: 'flex',
    // flexDirection: 'column',
    position: 'relative',
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `32px ${theme.spacing(10)}px 86px`,
    [theme.breakpoints.down('sm')]: {
      padding: `32px 36px 86px`
    }
  },
  ipfsSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 12px',
    borderRadius: '11px',
    background: '#FFFFFF',
    marginTop: 10,
    cursor: 'pointer'
  },
  currentPriceSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 28px 26px 28px',
    background: '#fff',
    boxShadow: '0px 15px 35px -12px rgba(17, 32, 53, 0.02)',
    borderRadius: 22,
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 20px',
      margintTop: 36
    }
  },
  podBtn: {
    background: 'transparent',
    color: '#2D3047',
    fontWeight: 700,
    fontSize: '16px',
    border: '1px solid rgba(84, 101, 143, 0.3) !important',
    borderRadius: '48px',
    height: '48px',
    [theme.breakpoints.down('xs')]: {
      height: '42px',
      marginBottom: '16px'
    }
  },
  buyNowBtn: {
    height: 48,
    width: 173,
    background:
      'linear-gradient(88.38deg, #4434FF 7.67%, #2B99FF 102.5%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    marginRight: 11,
    [theme.breakpoints.down('xs')]: {
      height: 42,
      width: 165
    }
  },
  makeOffBtn: {
    height: 48,
    width: 173,
    background: '#2D3047',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      height: 42,
      width: '100%'
    }
  },
  buyOffersSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '31px 47px 31px 30px',
    background: '#fff',
    boxShadow: '0px 15px 35px -12px rgba(17, 32, 53, 0.02)',
    borderRadius: 22,
    marginTop: 19,
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 20px',
      margintTop: 36
    }
  },
  sellHistorySection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '31px 47px 31px 30px',
    background: '#fff',
    boxShadow: '0px 15px 35px -12px rgba(17, 32, 53, 0.02)',
    borderRadius: 22,
    marginTop: 19,
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 20px',
      margintTop: 36
    }
  },
  commentsContentBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `49px ${theme.spacing(10)}px 66px`,
    background: '#F4F6F9',
    [theme.breakpoints.down('sm')]: {
      padding: `49px 36px 66px`
    }
  },
  addCommentsBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: 'rgba(85, 101, 139, 0.1)',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    borderRadius: 22,
    padding: '19px 25px',
    marginTop: 20,
    '& input': {
      background: 'transparent',
      border: 'unset',
      minWidth: 500,
      marginLeft: 24
    },
    [theme.breakpoints.down('sm')]: {
      padding: '19px 12px',
      '& input': {
        minWidth: 430
      }
    }
  },
  commentHistoryBox: {
    marginTop: 20,
    borderRadius: 22,
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    padding: '32px 36px'
  },
  collectionContentBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `26px ${theme.spacing(10)}px 133px`,
    [theme.breakpoints.down('sm')]: {
      padding: `26px 36px 133px`
    }
  },
  collectionMainContentBox: {
    display: 'flex',
    flexDirection: 'column',
    background: '#fff',
    borderRadius: 30,
    padding: '26px 0px 63px 41px'
  },
  title: {
    fontSize: 40,
    fontWeight: 800,
    lineHeight: '122.5%',
    color: '#fff',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    maxWidth: 490,
    maxHeight: 147,
    [theme.breakpoints.down('sm')]: {
      maxHeight: 200
    }
  },
  typo1: {
    fontSize: 14,
    color: '#fff'
  },
  typo2: {
    fontSize: 13
  },
  typo3: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047'
  },
  typo4: {
    fontSize: 16,
    fontWeight: 800,
    color: '#2D304770'
  },
  typo5: {
    fontSize: 18,
    fontWeight: 800,
    color: '#7E7D95'
  },
  typo6: {
    fontSize: 14,
    color: '#2D3047'
  },
  typo7: {
    fontSize: 14,
    color: '#0D59EE'
  },
  typo8: {
    fontSize: 32,
    fontWeight: 700,
    color: '#0D59EE'
  },
  typo9: {
    fontSize: 20,
    fontWeight: 800,
    color: '#2D3047'
  },
  typo10: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0D59EE'
  },
  typo11: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0D59EE'
  },
  typo12: {
    fontSize: 32,
    fontWeight: 800,
    color: '#2D3047'
  }
}));
