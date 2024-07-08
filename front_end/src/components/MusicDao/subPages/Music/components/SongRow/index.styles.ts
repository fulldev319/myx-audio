import { makeStyles } from '@material-ui/core/styles';

export const songRowStyles = makeStyles((theme) => ({
  songImage: {
    width: 48,
    height: 48,
    minWidth: 48,
    minHeight: 48,
    marginRight: 24,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  row: {
    color: 'white',
    '& button': {
      background: 'transparent',
      padding: 0,
      borderRadius: 0,
      marginRight: 20
    },
    '& button:last-child': {
      marginRight: 0
    }
  },
  paper: {
    background: '#181818',
    borderRadius: 12,
    '& .MuiListItem-root.MuiMenuItem-root': {
      color: 'white',
      '& > svg': {
        marginRight: 12
      }
    },
    minWidth: 197,
    marginLeft: -197,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)'
  },
  paper1: {
    background: '#181818',
    borderRadius: 12,
    '& .MuiListItem-root.MuiMenuItem-root': {
      color: 'white',
      '& > svg': {
        marginRight: 12
      }
    },
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)'
  },
  shareButton: {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      marginRight: 12
    }
  },
  songNameLabel: {
    color: 'white',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical'
  },
  artistNameLabel: {
    color: 'white',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
    display: '-webkit-box',
    '-webkit-line-clamp': 1,
    '-webkit-box-orient': 'vertical'
  },
  albumNameLabel: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
    height: '65px',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical'
  },
  buttonPlaySong: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));
