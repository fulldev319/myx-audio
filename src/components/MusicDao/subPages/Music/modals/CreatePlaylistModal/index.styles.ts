import { makeStyles } from '@material-ui/core/styles';
import { Gradient } from 'shared/ui-kit';

export const createPlayListModalStyles = makeStyles((theme) => ({
  root: {
    width: '665px !important',
    '& > svg': {
      color: 'white'
    },
    borderRadius: '30px !important',
    background: '#13172C',
    color: 'white !important'
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    '& h5': {
      margin: '0px 0px 16px',
      fontWeight: 800,
      fontSize: '22px',
      color: 'white',
      lineHeight: '130%'
    },
    '& label': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: 16,
      display: 'flex',
      alignItems: 'center',
      color: 'white',
      '& img': {
        marginLeft: '8px'
      }
    },
    '& .MuiOutlinedInput-root': {
      width: '100%',
      height: 40
    },
    '& .MuiOutlinedInput-input': {
      padding: '14px'
    },
    '& .MuiFormControl-root': {
      marginTop: '8px',
      width: '100%',
      marginBottom: '20px'
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
  },
  divider: {
    marginBottom: '20px',
    opacity: 0.2,
    backgroundColor: '#707582',
    width: '100%',
    height: 1
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  uploadBox: {
    background: '#F0F5F5',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(5)}px ${theme.spacing(5)}px`
  },
  tipBox: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '150%',
    textAlign: 'center',
    color: '#7E7D95'
  },
  createBtn: {
    background: Gradient.Blue,
    width: 230,
    borderRadius: '100vh'
  }
}));
