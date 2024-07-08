import { makeStyles } from '@material-ui/core/styles';

export const mintBatchStyles = makeStyles((theme) => ({
  stepTitle: {
    marginTop: 32,
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: 16,

    '& label': {
      color: '#65CB63',
      marginRight: 10,
      minWidth: 48,
      [theme.breakpoints.down('xs')]: {
        fontSize: 14
      }
    },
    '& div': {
      color: 'rgb(101, 116, 154)',
      [theme.breakpoints.down('xs')]: {
        fontSize: 14
      }
    }
  },
  stepSection1: {
    background: '#E0F3E9',
    borderRadius: 12,
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stepSection2: {
    background: '#E0F3E9',
    borderRadius: 12,
    padding: '10px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
    // "& span": {
    //   color: "#2D3047",
    // },
  },
  mintedBG: {
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)'
  },
  failedBG: {
    background: '#FA9EAF'
  }
}));
