import makeStyles from '@material-ui/core/styles/makeStyles';

export const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: '0px 46px 35px -31px rgba(29, 103, 84, 0.13)',
    borderRadius: '34px',
    color: '#2D3047',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '52px 59px !important',
    width: '682px !important',
    maxWidth: 'unset',
    [theme.breakpoints.down('xs')]: {
      padding: '52px 16px !important'
    }
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '22px',
    lineHeight: '130%',
    textAlign: 'center'
  },
  description: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '160%',
    textAlign: 'center',
    color: '#54658F'
  },
  alert: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '160%',
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: '#65CB63',
    cursor: 'pointer'
  },
  back: {
    position: 'absolute',
    top: 24,
    left: 24,
    cursor: 'pointer'
  },
  divider: {
    width: 300,
    height: 1,
    background: 'rgba(0, 0, 0, 0.05)',
    marginTop: 10,
    marginBottom: 50
  },
  toolbox: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gridGap: '10px',
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: '1fr'
    }
  },
  qrcodeBox: {
    border: '1px solid rgba(84, 101, 143, 0.3)',
    borderRadius: 28,
    width: 452,
    height: 452
  },
  button: {
    position: 'relative',
    border: '1px solid #CCD1DE',
    borderRadius: '20px',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '38px 40px',

    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '22px',
    lineHeight: '130%',
    transition: 'opacity 0.1s ease',
    whiteSpace: 'nowrap',
    '&:hover': {
      opacity: 0.8,
      border: '1px solid #2D3047'
    },
    '&:active': {
      opacity: 0.5
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '16px',
      padding: '24px 16px'
    }
  }
}));
