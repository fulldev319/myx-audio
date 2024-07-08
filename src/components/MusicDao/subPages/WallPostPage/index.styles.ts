import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const wallPostPageStyles = makeStyles((theme) => ({
  content: {
    height: `100%`,
    width: '100%',
    paddingBottom: '80px',
    color: '#181818'
  },
  subContent: {
    overflowY: 'auto',
    scrollbarWidth: 'none',
    padding: '30px 168px 150px 168px',
    height: 'calc(100vh - 80px)',
    paddingBottom: '80px',
    maxWidth: 1100,
    margin: '0 auto',
    boxSizing: 'content-box',
    [theme.breakpoints.down('sm')]: {
      padding: '30px 16px',
      boxSizing: 'border-box'
    }
  },
  title: {
    fontSize: '44px',
    fontWeight: 800,
    lineHeight: '120%',
    color: '#181818'
  },
  header1: {
    fontSize: '22px',
    fontWeight: 400
  },
  header2: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#181818',
    '& pre': {
      whiteSpace: 'unset'
    }
  },
  header3: {
    fontSize: '12px',
    fontWeight: 400
  },
  header4: {
    fontSize: '14px',
    fontWeight: 400,
    borderRadius: 12,
    padding: '20px 72px',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '16px 16px'
    }
  },
  flexBox: {
    display: 'flex',
    alignItems: 'center'
  },
  discussionDetailBox: {
    padding: '65px 90px',
    borderRadius: theme.spacing(1.5),
    background: 'white',
    boxShadow: '0px 30px 35px -12px rgba(29, 103, 84, 0.03)',
    [theme.breakpoints.down('sm')]: {
      padding: '40px 24px'
    }
  },
  avatarBox: {
    position: 'relative',
    '& > img': {
      width: 40,
      height: 40
    }
  },
  selectedButtonBox: {
    background: '#DDFF57',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(1),
    cursor: 'pointer'
  },
  tagBox: {
    background: Color.MusicDAOLightGreen,
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    borderRadius: theme.spacing(1)
  },
  imgBox: {
    borderRadius: theme.spacing(3),
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.down('sm')]: {
      height: 'auto !important'
    }
  },
  iconBox: {
    width: theme.spacing(3),
    cursor: 'pointer'
  },
  whiteBox: {
    background: 'white',
    boxShadow: '0px 30px 35px -12px rgba(29, 103, 84, 0.03)',
    borderRadius: '12px'
  },
  secondButtonBox: {
    position: 'relative',
    padding: `${theme.spacing(1)}px ${theme.spacing(10)}px`,
    borderRadius: theme.spacing(4),
    cursor: 'pointer',
    border: '1px solid #65CB63',

    '& svg': {
      position: 'absolute',
      right: '16px',
      width: '16px',
      transform: 'translateY(-150%)'
    }
  },
  reactPlayer: {
    height: '360px !important',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: '14px',
    transform: 'none',
    cursor: 'pointer',
    '& video': {
      borderRadius: '14px',
      height: 'auto'
    },
    overflow: 'hidden',
    [theme.breakpoints.down('sm')]: {
      width: '100% !important'
    }
  },
  reactPlayerModal: {}
}));
