import { makeStyles } from '@material-ui/core/styles';

export const podCardStyles = makeStyles((theme) => ({
  podCard: {
    // minWidth: 286,
    // maxWidth: 350,
    width: '100%',
    background: '#ffffff',
    borderRadius: theme.spacing(2),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0px 10px 20px rgba(19, 45, 38, 0.07)',
    '&:hover': {
      boxShadow:
        '0px 16px 24px rgba(19, 45, 38, 0.25), 0px 31px 44px -13px rgba(0, 0, 0, 0.02)',
      transform: 'scale(1.02)'
    }
    // [theme.breakpoints.down("sm")]: {
    //   minWidth: 350,
    // },
  },

  podImageContent: {
    height: '264px',
    borderRadius: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(2),
    right: theme.spacing(2),
    left: theme.spacing(2)
  },

  podImage: {
    width: '100%',
    height: '100%',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer'
  },

  playButtonBox: {
    width: theme.spacing(4.5),
    height: theme.spacing(4.5),
    borderRadius: '18px',
    background: '#7f6fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    // position: "absolute",
    // bottom: 0,
    // left: 8,
    transform: 'translate(0, 50%)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar1: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    // position: "absolute",
    // bottom: 0,
    // left: 30,
    marginLeft: '-10px',
    transform: 'translate(0, 50%)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarPlus: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    background: '#fff',
    // position: "absolute",
    // bottom: 0,
    // left: 52,
    transform: 'translate(0, 50%)',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 11,
    fontWeight: 800,
    lineHeight: 9,
    color: '#2D3047',
    marginLeft: '-10px'
  },
  collabList: {
    fontSize: 14,
    borderRadius: 16
  },
  collabItem: {
    padding: '10px 16px'
    // "&:hover": {
    //   background: "linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D"
    // }
  },
  collabAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: '100%',
    border: '2px solid #ffffff',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    background: '#fff',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  podStatus: {
    background: 'linear-gradient(97.4deg, #ff79d1 14.43%, #db00ff 79.45%)',
    borderRadius: theme.spacing(3),
    padding: '8px 18px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'white',
    textTransform: 'capitalize'
  },

  userGroup: {
    borderRadius: '50%',
    width: theme.spacing(4),
    height: theme.spacing(4)
  },

  podInfo: {
    marginTop: '300px',
    // padding: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px`,
    padding: `0px 0 ${theme.spacing(2)}px`,
    flexGrow: 1,
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer'
  },

  podInfoName: {
    fontWeight: 700,
    fontSize: '20px',
    padding: '0px 16px',
    color: 'black',
    marginTop: theme.spacing(2),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  podMainInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: `0 ${theme.spacing(2)}px`,
    marginTop: theme.spacing(1),

    '& span': {
      fontSize: '14px',
      fontWeight: 600,
      color: '#2D3047'
    },

    '& p': {
      fontSize: '18px',
      fontWeight: 800,
      color: '#65CB63',
      margin: 0
    }
  },

  podMainInfoContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',

    '& div': {
      display: 'flex',
      flexDirection: 'column'
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '& div': {
      fontSize: '14px',
      color: '#707582'
    }
  },
  divider: {
    width: '100%',
    height: '1px',
    background: '#000',
    opacity: 0.05,
    margin: '16px 0'
  },
  socialButtons: {
    display: 'flex',
    alignItems: 'center',
    background: '#FEECD7',
    border: '2px solid #ffffff',
    borderRadius: '32px',
    transform: 'translate(0, 50%)',
    columnGap: '4px',
    position: 'absolute',
    bottom: 0,
    right: '16px'
  },
  clickable: {
    cursor: 'pointer'
  },
  redBox: {
    background: 'rgba(255,0,0,0.2)',
    color: 'rgba(255,0,0)',
    borderRadius: theme.spacing(1)
  },
  greenBox: {
    background: 'rgba(101, 203, 99, 0.2)',
    color: '#65CB63',
    borderRadius: theme.spacing(1)
  },
  cyanBox: {
    background: 'rgba(60, 255, 243, 0.2)',
    color: '#00A4BA',
    borderRadius: theme.spacing(1)
  },
  noFundingBox: {
    background: 'rgba(60, 255, 243, 0.2)',
    color: '#00A4BA',
    borderRadius: theme.spacing(1)
  },
  orangeBox: {
    background: 'rgba(255, 142, 60, 0.2)',
    color: 'rgba(255, 142, 60, 1)',
    borderRadius: theme.spacing(1)
  },
  blueBox: {
    background: 'rgba(87, 60, 255, 0.2)',
    color: '#4218B5',
    borderRadius: theme.spacing(1)
  },
  proposalBox: {
    background: '#65CB63',
    color: '#FFFFFF',
    borderRadius: theme.spacing(1)
  },
  socialButtonBox: {
    display: 'flex',
    transform: 'translate(0, 50%)',
    marginLeft: '8px'
  },
  socialButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '30px',
    borderRadius: '50%',
    marginRight: '2px',
    '& img': {
      cursor: 'pointer',
      width: '28px',
      height: '28px'
    }
  }
}));
