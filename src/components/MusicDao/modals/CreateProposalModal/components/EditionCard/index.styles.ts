import makeStyles from '@material-ui/core/styles/makeStyles';
import { Gradient } from 'shared/ui-kit';

const editionCardStyles = makeStyles((theme) => ({
  container: {
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    borderRadius: 30,
    boxShadow: '0px 15px 20px -6px rgba(29, 103, 84, 0.11)',
    padding: 40
  },
  img: {
    width: 330,
    height: 330,
    [theme.breakpoints.down(1100)]: {
      width: 330
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
    color: '#707582',
    fontWeight: 500,
    fontSize: 18
  },
  genreValue: {
    background: '#0D59EE',
    padding: `8px 16px 10px`,
    color: '#fff',

    fontWeight: 600,
    fontSize: 16,
    borderRadius: theme.spacing(1),
    textTransform: 'uppercase'
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
    color: '#0D59EE'
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
    background: Gradient.Blue,
    width: 'fit-content'
  },
  genreLabel1: {
    fontWeight: 400,
    fontSize: 20,
    color: '#7E7D95',
    lineHeight: '26px',
    textTransform: 'uppercase'
  }
}));

export default editionCardStyles;
