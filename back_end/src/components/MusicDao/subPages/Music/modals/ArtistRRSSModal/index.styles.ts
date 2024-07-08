import { makeStyles } from '@material-ui/core/styles';

export const artistRRSSModalStyles = makeStyles(() => ({
  root: {
    width: '892px !important',
    borderRadius: '0px !important'
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    '& button': {
      alignSelf: 'flex-end'
    },
    '& h5': {
      fontStyle: 'normal',
      fontWeight: 800,
      fontSize: 18,
      color: '#181818',
      margin: '0px 0px 16px'
    },
    '& label': {
      width: '100%',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: 18,
      display: 'flex',
      alignItems: 'center',
      color: '#181818',
      marginBottom: 8,
      marginTop: 0
    },
    '& input': {
      display: 'flex',
      background: '#f7f9fe',
      boxSizing: 'border-box',
      borderRadius: 0,
      width: '100%',
      color: '#707582',
      '&:placeholder': {
        color: '#707582'
      }
    },
    '& textarea': {
      display: 'flex',
      background: '#f7f9fe',
      border: '1px solid #e0e4f3',
      boxSizing: 'border-box',
      borderRadius: 0,
      marginBottom: 17,
      width: '100%',
      color: '#707582',
      padding: '12.5px 20px 10.5px',
      height: 139,
      '&:placeholder': {
        color: '#707582'
      }
    }
  },
  imageSquareImgTitleDescDiv: {
    height: '262px',
    borderRadius: '0px',
    position: 'relative'
  },
  imageSquareImgTitleDesc: {
    width: '100%',
    height: '262px',
    minHeight: '262px',
    borderRadius: '0px',
    backgroundImage: (photoImg) => `url(${photoImg})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  removeImageButtonSquareImgTitle: {
    position: 'absolute',
    fontSize: 18,
    cursor: 'pointer',
    right: '10px',
    top: '10px'
  },
  dragImageHereImgTitleDesc: {
    cursor: 'pointer',
    alignItems: 'center',
    width: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    border: '1px dashed #b6b6b6',
    boxSizing: 'border-box',
    padding: '40px 20px',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundColor: '#F7F9FE',
    height: '272px',
    flexDirection: 'column',
    borderRadius: '0px'
  },
  dragImageHereIconImgTitleDesc: {
    width: 26.3,
    height: 26.67,
    marginBottom: 6.58
  },
  dragImageHereLabelImgTitleDesc: {
    fontWeight: 400,
    color: '#99a1b3',
    fontSize: 18
  },
  dragImageHereLabelImgTitleSubDesc: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    color: '#949bab',
    '& span': {
      color: '#29e8dc'
    }
  }
}));
