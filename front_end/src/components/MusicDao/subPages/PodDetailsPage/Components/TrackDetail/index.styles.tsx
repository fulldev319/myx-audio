import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';

export const useTrackDetailStyles = makeStyles((theme) => ({
  mainCard: {
    background: '#fff',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 16,
    padding: '32px 40px'
  },
  sectionTitle: {
    fontSize: 22,

    fontWeight: 800,
    lineHeight: '130%',
    marginTop: 40,
    marginBottom: 32
  },
  tag: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,
    lineGeight: '61%',
    color: '#FFFFFF',
    background: '#57CB55',
    borderRadius: 8,
    marginLeft: 12,
    padding: '3px 10px'
  },
  artist: {
    marginRight: 12,
    '&:last-child': {
      marginRight: 0
    }
  },
  container: {
    marginTop: 24
    // background: '#F7F9FE',
    // border: '1px solid rgba(84, 101, 143, 0.3)',
    // borderRadius: 16,
    // padding: 16
  },
  img: {
    width: 460,
    height: 460,
    [theme.breakpoints.down(1100)]: {
      width: 420
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  title: {
    fontWeight: 800,
    fontSize: 27
  },
  artistName: {
    fontWeight: 600,
    fontSize: 18
  },
  genreLabel: {
    fontWeight: 500,
    fontSize: 18,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  genreValue: {
    background: '#65CB63',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
    color: 'white',

    fontWeight: 600,
    fontSize: 16,
    borderRadius: theme.spacing(1)
  },
  editionSection: {
    borderTop: '1px solid rgba(84, 101, 143, 0.3)',
    padding: `${theme.spacing(1.5)}px 0px`
  },
  editableButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px 11px',
    fontSize: '12px',
    fontWeight: 700,
    borderRadius: '8px',
    cursor: 'pointer'
  },
  revenueValue: {
    fontSize: 28,
    fontWeight: 600,
    color: '#65CB63'
  },
  priceBox: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    border: '1px solid #C6C6C6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderRadius: theme.spacing(2)
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#7E7D95'
  },
  priceValue: {
    fontSize: 32,
    fontWeight: 700,
    color: '#2D3047'
  },
  regularAmount: {
    fontWeight: 800,
    fontSize: 50,
    color: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    background: Gradient.Green1
  },
  genreLabel1: {
    fontWeight: 400,
    fontSize: 20,
    color: '#7E7D95',
    lineHeight: '26px'
  },
  editionLabel: {
    fontSize: 14,
    fontWeight: 500,

    color: '#7E7D95',
    [theme.breakpoints.down('xs')]: {
      fontSize: 9
    }
  },
  subCard: {
    height: 60,
    background: '#fff',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: 16,

    fontSize: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    color: '#7E7D95',
    [theme.breakpoints.down('xs')]: {
      padding: '0 8px'
    }
  },
  myTooltip: {
    '& .MuiTooltip-tooltip': {
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fontSize: 12,
      lineHeight: '130%'
    },
    '& .MuiTooltip-arrow': {
      color: 'rgba(0, 0, 0, 0.8)'
    }
  },
  h1: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 27,
    lineHeight: '35px',
    color: '#2D3047'
  },
  h3: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 20,
    lineHeight: '104.5%',
    color: '#181818'
  },
  h4: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 18,
    lineHeight: '104.5%',
    color: '#7E7D95'
  }
}));
