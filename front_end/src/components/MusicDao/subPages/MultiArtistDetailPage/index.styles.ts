import { makeStyles } from '@material-ui/core/styles';
import { Color, Gradient } from 'shared/ui-kit';

export const multiArtistPageStyles = makeStyles((theme) => ({
  content: {
    background: 'linear-gradient(180.15deg, #FFFFFF 2.8%, #EEF2F6 89.51%)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: '60px 168px 150px 168px',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    [theme.breakpoints.down('md')]: {
      padding: '42px 24px 80px 24px'
    }
  },
  gradient: {
    position: 'absolute',
    width: '100%',
    height: 485,
    left: 0,
    top: 0,
    backgroundImage: `url(${require('assets/backgrounds/artist_background.webp')})`,
    backgroundSize: 'cover'
  },
  svgBox: {
    width: 24,
    cursor: 'pointer',
    '& svg': {
      width: '100%',
      height: '100%'
    },
    '& path': {
      stroke: 'black'
    }
  },
  paper: {
    borderRadius: 10,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
    position: 'inherit'
  },
  whiteBox: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(0.5)}px ${theme.spacing(3)}px`
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '44px',
    color: '#081831',
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
      fontSize: '36px'
    }
  },
  header1: {
    fontSize: 24,
    color: Color.MusicDAODark,
    [theme.breakpoints.down('sm')]: {
      fontSize: '16px'
    }
  },
  header2: {
    fontSize: '16px',
    color: Color.MusicDAOLightBlue,
    fontWeight: 800,
    [theme.breakpoints.down('sm')]: {
      fontSize: '14px'
    }
  },
  header3: {
    fontSize: 14,
    fontWeight: 600,
    color: '#707582'
  },
  header4: {
    fontSize: 13,
    fontWeight: 600,
    color: '#707582'
  },
  header5: {
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark
  },
  vert: {
    width: 1,
    height: 30,
    background: '#000000',
    opacity: 0.1
  },
  tag: {
    background: 'rgba(175, 172, 215, 0.3)',
    borderRadius: 5,
    padding: '5px 10px',
    fontSize: 10,
    color: '#2D3047',
    fontWeight: 600,
    '& + &': {
      marginLeft: 4
    }
  },
  inviteButton: {
    background:
      'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%) !important',
    borderRadius: '16px !important'
  },
  tabBox: {
    fontSize: 14,
    fontWeight: 500,
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: theme.spacing(4),
    color: '#2D3047',
    cursor: 'pointer',
    '& + &': {
      marginLeft: 12
    }
  },
  selectedTabBox: {
    background: '#2D3047',
    color: 'white'
  },
  chatContent: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    '& > div': {
      width: '100%'
    },
    marginTop: 32
  },
  chatColumn: {
    background: '#FFFFFF',
    borderRadius: 6
  },
  artistsColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: 230,
    minWidth: 230,
    maxWidth: 230,
    marginLeft: '32px'
  },
  artistsList: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflowY: 'auto',
    height: 'calc(616px - 218px)',
    marginBottom: '26px',
    marginTop: '26px'
  },
  artistTile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottom: '1px dashed #1717174d',
    padding: '16px 0px',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  artistImage: {
    border: '2px solid #FFFFFF',
    marginRight: '14px',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    borderRadius: '24px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  artistName: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#181818',
    display: 'flex'
  },
  artistSlug: {
    fontSize: 14,
    color: '#54658F',
    fontWeight: 600
  },
  proposals: {
    fontSize: '18px',
    color: '#54658F',
    fontWeight: 600
  },
  create: {
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    background: '#FFFFFF',
    border: '1px dashed #727F9A',
    boxSizing: 'border-box',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 12,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '14px',
    textAlign: 'center',
    color: '#727F9A',
    '& img': {
      width: 28,
      height: 22
    }
  },
  startText: {
    fontSize: '12px !important',
    background: '#54658F !important',
    borderRadius: '77px !important'
  },
  declineButton: {
    borderColor: '#54658F',
    borderRadius: '46px !important'
  },
  proposalButton: {
    backgroundColor: '#2D3047 !important',
    borderRadius: '46px !important'
  },
  acceptButton: {
    backgroundColor: '#65CB63 !important',
    borderRadius: '46px !important'
  }
}));
