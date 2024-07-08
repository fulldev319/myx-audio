import { makeStyles } from '@material-ui/core/styles';

export const singleSongDetailPageStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: '100vh'
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
  comingSoon: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.33)',
    borderRadius: '16px',
    fontSize: 13,

    [theme.breakpoints.down('sm')]: {
      maxWidth: 350
    },

    '& div': {
      background: '#FF8E3C',
      color: '#fff',
      borderRadius: '8px',
      padding: '4px 8px',
      [theme.breakpoints.down('sm')]: {
        minWidth: 100
      }
    },
    '& span': {
      color: '#2D3047',
      marginLeft: '16px'
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  svgBox: {
    display: 'flex',
    cursor: 'pointer',
    '& > div': {
      display: 'flex'
    },
    '& path': {
      stroke: 'black'
    }
  },
  fruitSection: {
    fontSize: 12,

    fontWeight: 600,
    color: '#2D3047',
    paddingLeft: 13,
    borderLeft: '1px solid #00000020',
    marginLeft: 16
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
    border: '1px solid #ffffff10',
    borderRadius: '11px',
    marginTop: 10,
    color: '#fff',
    [theme.breakpoints.down('xs')]: {
      padding: '10px 12px'
    }
  },
  ipfsSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 12px',
    borderRadius: '11px',
    background: 'rgba(255, 255, 255)',
    marginTop: 10
  },
  createdDateSection: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '13px 12px',
    borderRadius: '11px',
    background: 'rgba(255, 255, 255)',
    marginTop: 10
  },
  proofSection: {
    padding: '13px 12px',
    borderRadius: '11px',
    background: 'rgba(255, 255, 255)',
    marginTop: 10
  },
  openseaSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 12px',
    borderRadius: '11px',
    background: 'rgba(255, 255, 255)',
    marginTop: 10,
    cursor: 'pointer'
  },
  listenerSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 12px',
    borderRadius: '11px',
    background: 'rgba(255, 255, 255, 0.4)',
    marginTop: 10
  },
  leftGroupSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 12px',
    borderRadius: '11px',
    background: 'rgba(255, 255, 255, 0.4)',
    marginTop: 10
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
    textTransform: 'uppercase',
    height: 25
  },
  tagLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#54658F',
    marginRight: 8
  },
  rightFix: {
    flex: 1,
    [theme.breakpoints.down('md')]: {
      maxWidth: 'none'
    }
  },
  description: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    height: 140,
    [theme.breakpoints.down('md')]: {
      padding: '18px 20px',
      height: 100
    },
    [theme.breakpoints.down('xs')]: {
      padding: '18px 20px',
      height: 100
    }
  },
  scrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    maxHeight: '100%',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      width: 5
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#00000019'
    }
  },
  typo4_1: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '24px',
    color: '#fff',
    opacity: 0.7
  },
  currentPriceSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: '39px 37px 26px 49px',
    background: '#fff',
    boxShadow: '0px 15px 35px -12px rgba(17, 32, 53, 0.02)',
    borderRadius: 30,
    marginTop: 50,
    [theme.breakpoints.down('xs')]: {
      padding: '30px 20px 20px',
      margintTop: 36
    }
  },
  listenerBtn: {
    height: 48,
    width: 173,
    background: '#65CB63',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
    fontSize: 16,
    fontWeight: 600,

    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      height: 40,
      width: 136
    }
  },
  cancelSaleBtn: {
    height: 48,
    width: 149,
    background: '#F43E5F',
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
      width: 165
    }
  },
  buyNowBtn: {
    height: 48,
    width: 173,
    background: '#65CB63',
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
      width: 165
    }
  },
  cancelImg: {
    marginRight: '10px',
    marginBottom: '5px'
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

    marginLeft: 11,
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      height: 42,
      width: 165
    }
  },
  offerTableSection: {
    display: 'flex',
    flexDirection: 'column',
    padding: '25px 0px',
    background: '#fff',
    boxShadow: '0px 15px 35px -12px rgba(17, 32, 53, 0.02)',
    borderRadius: 30,
    marginTop: 50,
    '& .MuiTableContainer-root': {
      boxShadow: 'unset'
    },
    '& .MuiTableCell-alignRight': {
      display: 'flex',
      justifyContent: 'end'
    },
    '& .editions': {
      '&::-webkit-scrollbar': {
        background: '#F7F7F7'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#B8C1D6 !important'
      },
      /* Buttons */
      '&::-webkit-scrollbar-button:single-button': {
        display: 'block',
        backgroundSize: '10px',
        backgroundRepeat: 'no-repeat'
      },
      '&::-webkit-scrollbar-button:single-button:horizontal:decrement': {
        backgroundPosition: 'center 4px',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='10' viewBox='0 0 6 10' fill='black'><path d='M4.18164 8L1.10394 5L4.18164 2' stroke='#B8C1D6' stroke-width='2.0518' stroke-linecap='round' stroke-linejoin='round'/></svg>")`
      },
      '&::-webkit-scrollbar-button:single-button:horizontal:increment': {
        backgroundPosition: 'center 2px',
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='6' height='10' viewBox='0 0 6 10' fill='black'><path d='M1.63672 8L4.71442 5L1.63672 2' stroke='#B8C1D6' stroke-width='2.0518' stroke-linecap='round' stroke-linejoin='round'/></svg>")`
      }
    }
  },
  refreshBtn: {
    display: 'flex',
    alignItems: 'center',
    height: '24px',
    paddingLeft: '8px',
    paddingRight: '8px',
    background: '#DAE6E5',
    borderRadius: '100vh',
    cursor: 'pointer'
  },
  paper: {
    top: 0,
    borderRadius: 10,
    boxShadow: '0px 2px 20px rgba(0, 0, 0, 0.1)'
  },
  title: {
    fontSize: 32,

    fontWeight: 800,
    color: '#2D3047',
    marginTop: 8,
    [theme.breakpoints.down('xs')]: {
      fontSize: 22
    }
  },
  small: {
    fontSize: 14,

    fontWeight: 700,
    color: '#2D3047',
    marginTop: 16,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  smallMark: {
    padding: '3px 5px 2px 5px',
    backgroundColor: '#FFFFFF96',
    fontSize: 14,

    fontWeight: 700,
    color: '#2D3047',
    height: '24px',
    borderRadius: '5px',
    marginLeft: '5px',
    marginTop: 16,
    [theme.breakpoints.down('xs')]: {
      fontSize: 12
    }
  },
  subtitle: {
    fontSize: 14,

    fontWeight: 800,
    color: '#2D304780',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    marginLeft: 8,
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      marginLeft: 0
    }
  },

  tableSection: {
    marginTop: 50,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    borderBottom: '1px solid #00000022',
    overflow: 'scroll',
    '&::-webkit-scrollbar': {
      width: 0,
      height: 0
    }
  },
  tabItem: {
    fontSize: 14,
    fontWeight: 800,
    cursor: 'pointer',
    color: '#2D304780',
    whiteSpace: 'nowrap',
    textTransform: 'uppercase',
    '& + &': {
      marginLeft: theme.spacing(13)
    },
    [theme.breakpoints.down('sm')]: {
      '& + &': {
        marginLeft: theme.spacing(5)
      }
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
      '& + &': {
        marginLeft: theme.spacing(2)
      }
    }
  },
  tabItemActive: {
    color: '#65CB63',
    borderBottom: '2px solid #65CB63'
  },
  typo1: {
    fontSize: 14,
    fontWeight: 400,
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
    fontSize: 18,

    fontWeight: 800,
    color: '#2D3047',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  typo6: {
    fontSize: 22,

    fontWeight: 700,
    color: '#65CB6390',
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  typo7: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 32,
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    color: '#fff',
    [theme.breakpoints.down('md')]: {
      fontSize: 22
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 18
    }
  },
  typo8: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    color: '#fff',
    [theme.breakpoints.down('md')]: {
      fontSize: 10
    }
  },
  typo9: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 14,
    color: '#fff',
    textShadow: '0px 0px 20px rgba(255, 255, 255, 0.3)',
    opacity: 0.8
  },
  edition: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 34,
    marginTop: 8,
    borderRadius: 8,

    position: 'relative',

    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: '14px',
    textAlign: 'center',
    letterSpacing: '0.83em',
    textTransform: 'uppercase'
  },
  editions: {
    width: 'calc(100% - 32px)',
    display: 'flex',
    margin: '24px 16px 16px',
    paddingBottom: '8px',
    overflow: 'auto'
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
  },
  editionSection: {
    background: 'rgba(255, 255, 255, 0.42)',
    borderRadius: theme.spacing(4),
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    textAlign: 'center'
  },
  editionLabel: {
    fontSize: 14,
    fontWeight: 800,
    lineHeight: '18.2px',
    opacity: 0.5
  },
  editionAmount: {
    fontSize: 23,
    fontWeight: 800,
    lineHeight: '29.75px'
  },
  editionTitle: {
    fontSize: 16,
    fontWeight: 500,
    opacity: 0.6
  },
  editionTag: {
    color: '#54658F',

    fontWeight: 'bold',
    fontSize: 13,
    lineHeight: '120%',
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center'
  }
}));
