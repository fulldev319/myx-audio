import { makeStyles } from '@material-ui/core/styles';

export const albumDetailPageStyles = makeStyles((theme) => ({
  root: {
    background:
      'linear-gradient(180deg, rgba(243, 254, 247, 0) -0.92%, #EEF2F6 63.74%), linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    width: '100%',
    height: '100vh',
    overflow: 'auto'
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    position: 'relative',
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: `60px ${theme.spacing(10)}px 150px`,
    [theme.breakpoints.down('md')]: {
      padding: `60px ${theme.spacing(2)}px 150px`
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  svgBox: {
    display: 'flex',
    cursor: 'pointer',
    '& svg': {
      width: 16,
      height: 16
    },
    '& path': {
      stroke: 'black'
    }
  },
  artistImage: {
    objectFit: 'cover',
    height: 305,
    width: '100%',
    borderRadius: 20,
    [theme.breakpoints.down('sm')]: {
      width: '268px',
      height: '100%'
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  },
  ownerSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 20px',
    border: '1px solid #2D304740',
    borderRadius: '11px',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      marginTop: 0
    },
    [theme.breakpoints.down('xs')]: {
      marginTop: 10,
      padding: '10px 12px'
    }
  },
  addressSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    border: '1px solid #2D304740',
    borderRadius: '11px',
    marginTop: 10,
    [theme.breakpoints.down('xs')]: {
      padding: '10px 12px'
    }
  },
  openseaSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 12px',
    borderRadius: '11px',
    background: 'rgba(255, 255, 255, 0.4)',
    marginTop: 10,
    cursor: 'pointer'
  },
  followBtn: {
    height: 34,
    width: 90,
    background: '#fff',
    color: '#000000',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 64,
    fontSize: 14,
    fontWeight: 600,

    cursor: 'pointer'
  },
  tag: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 5,
    fontSize: 10,

    fontWeight: 600,
    color: '#2D3047',
    padding: '5px 10px',
    textTransform: 'uppercase'
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#54658F',
    marginRight: 8
  },
  paper: {
    borderRadius: 10,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)',
    position: 'inherit'
  },
  title: {
    fontSize: 32,

    fontWeight: 800,
    color: '#2D3047',
    marginTop: 16,
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    }
  },
  subtitle: {
    fontSize: 14,

    fontWeight: 500,
    color: '#2D3047E3',
    marginTop: 16
  },
  typo1: {
    fontSize: 14,

    fontWeight: 500,
    color: '#2D3047',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  typo2: {
    fontSize: 14,

    fontWeight: 400,
    color: '#A4A4A4',
    marginLeft: 8,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  typo3: {
    fontSize: 13,

    fontWeight: 600,
    color: '#65CB63',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  typo4: {
    fontSize: 14,

    fontWeight: 400,
    color: '#2D304780',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)'
  },
  typo5: {
    fontSize: 14,

    fontWeight: 800,
    color: '#2D3047CC'
  },
  typo6: {
    fontSize: 18,

    fontWeight: 800,
    color: '#2D3047'
  },
  controlBox: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(242, 249, 248, 0.3)',
    borderRadius: theme.spacing(4)
  },
  listViewRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',

    // [theme.breakpoints.down("sm")]: {
    //   fontSize: "11px",
    // },
    [theme.breakpoints.down('xs')]: {
      fontSize: '11px'
    }
  },
  meta: {
    padding: '8px 0px',
    '& > span': {
      fontSize: 12,
      fontWeight: 600,
      color: '#2D3047',
      marginLeft: 8,
      marginTop: 4
    }
  },
  divider: {
    width: 1,
    height: 30,
    border: '1px solid #00000020',
    margin: '0px 14px'
  }
}));
