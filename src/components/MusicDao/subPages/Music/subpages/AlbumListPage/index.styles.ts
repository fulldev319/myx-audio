import { makeStyles } from '@material-ui/core/styles';

export const usePageStyles = makeStyles((theme) => ({
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflowY: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
    position: 'relative',
    overflowX: 'hidden'
  },
  content: {
    width: '100%',
    padding: '24px 40px',
    display: 'flex',
    flexDirection: 'column',
    height: 'fit-content'
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    '& h4': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 30,
      lineHeight: '104.5%',
      color: '#181818',
      margin: 0
    },
    '& h5': {
      margin: '16px 0px 24px',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: 18,
      lineHeight: '104.5%',
      color: '#181818'
    }
  },
  title: {
    fontSize: 40,
    fontWeight: 400,
    lineHeight: '48px',
    color: '#fff',
    fontFamily: 'Pangram',
    textShadow: '0px 0px 20px rgb(255 255 255 / 80%)'
  },
  carouselWrapper: {
    height: 360,
    marginTop: 60,
    overflow: 'hidden',
    filter: 'drop-shadow(0px 34px 55px rgba(25, 91, 220, 0.25))',
    '& > div > div': {
      transform: 'scale(0.8)',
      opacity: '1 !important',
      '&:first-child': {
        zIndex: '2 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.85) !important',
        // transform: 'rotateY(28deg)',
        // transformOrigin: '50% 50% 0px',
        left: '20% !important',
        width: '530px !important'
      },
      '&:nth-child(2)': {
        width: '560px !important',
        left: '50% !important',
        zIndex: '4 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(1) !important',
        '& > div': {
          opacity: 1
        }
      },
      '&:nth-child(3)': {
        zIndex: '3 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.85) !important',
        left: '80% !important',
        width: '530px !important'
      },
      '&:nth-child(4)': {
        opacity: '0 !important'
      },
      '&:nth-child(5)': {
        opacity: '0 !important'
      }
    }
  },
  collectionImg: {
    width: '100%',
    height: 360,
    borderRadius: 30,
    objectFit: 'cover'
  }
}));
