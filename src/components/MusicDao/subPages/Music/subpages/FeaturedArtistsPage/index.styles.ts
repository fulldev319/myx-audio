import { makeStyles } from '@material-ui/core/styles';

export const featuredArtistsStyles = makeStyles((theme) => ({
  root: {
    padding: '72px 0 0',
    overflowX: 'hidden',
    overflowY: 'auto'
  },
  sectionTitle: {
    fontSize: 40,
    fontWeight: 400,
    lineHeight: '48px',
    color: '#fff',
    fontFamily: 'Pangram',
    textShadow: '0px 0px 20px rgb(255 255 255 / 80%)',
    paddingLeft: 72
  },
  carouselWrapper: {
    height: 360,
    width: '100%',
    overflow: 'hidden',
    filter: 'drop-shadow(0px 34px 55px rgba(25, 91, 220, 0.25))',
    '& > div > div': {
      transform: 'scale(0.8)',
      opacity: '1 !important',
      '&:first-child': {
        opacity: '0.7 !important',
        zIndex: '2 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.8) !important',
        left: '19% !important',
        width: '215px !important'
      },
      '&:nth-child(2)': {
        opacity: '0.7 !important',
        width: '280px !important',
        left: '32% !important',
        zIndex: '3 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
      },
      '&:nth-child(3)': {
        zIndex: '4 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(1) !important',
        left: '50% !important',
        width: '340px !important'
      },
      '&:nth-child(4)': {
        opacity: '0.7 !important',
        width: '280px !important',
        left: '67% !important',
        zIndex: '3 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.9) !important'
      },
      '&:nth-child(5)': {
        opacity: '0.7 !important',
        zIndex: '2 !important',
        transform: 'translateY(-50%) translateX(-50%) scale(0.8) !important',
        left: '79% !important',
        width: '215px !important'
      }
    }
  }
}));
