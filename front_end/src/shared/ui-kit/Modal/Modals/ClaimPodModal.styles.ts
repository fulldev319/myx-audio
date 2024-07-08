import { makeStyles } from '@material-ui/core/styles';

export const claimPodModalStyles = makeStyles(() => ({
  modal: {
    width: '458px !important',
    padding: '30px 45px !important',
    maxHeight: '85vh !important',
    maxWidth: '85vw !important',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& img': {
      width: '50px',
      height: '50px',
      margin: '27px 0px'
    },
    '& h3': {
      margin: '0px',
      color: '#181818',
      fontWeight: 'normal',
      fontSize: '30px',
      textAlign: 'center'
    },
    '& h5': {
      margin: '18.5px 0px 30px',
      color: '#707582',
      fontWeight: 'normal',
      fontSize: '18px',
      lineHeight: '19px',
      textAlign: 'center'
    }
  },
  artistList: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    borderTop: '1px solid #17171736',
    borderBottom: '1px solid #17171736',
    marginBottom: '32px'
  },
  artistTile: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '2px 0px',
    borderBottom: '1px dashed #17171736',
    '& span': {
      fontSize: '14px',
      fontWeight: 700,
      color: '#181818'
    },
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  artistImage: {
    border: '2px solid #FFFFFF',
    marginRight: '10px',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    borderRadius: '24px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  label: {
    color: '#181818',
    fontSize: '18px',
    marginBottom: '8px',
    '& first-child': {
      marginTop: '20px'
    }
  },
  input: {
    padding: '18px 11.5px',
    background: '#F7F9FE',
    border: '1px solid #E0E4F3',
    boxSizing: 'border-box',
    borderRadius: '6px',
    marginBottom: '27px',
    width: '100%',
    color: '#707582'
  }
}));
