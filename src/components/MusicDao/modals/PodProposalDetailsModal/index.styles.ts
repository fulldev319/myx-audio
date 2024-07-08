import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const useModalStyles = makeStyles((theme) => ({
  headerTitle: {
    fontWeight: 800,
    fontSize: 18,
    lineHeight: '130%',
    color: '#2D3047',
    paddingLeft: 52
  },
  headerMenuContent: {
    width: 380,
    position: 'absolute',
    left: '50%',
    top: 0,
    transform: 'translateX(-50%)',
    [theme.breakpoints.down('xs')]: {
      width: 280
    }
  },
  warningScreen: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 88,
    '& h3': {
      marginTop: 0,
      marginBottom: 72,
      fontSize: 32,
      fontWeight: 800,
      textAlign: 'center',
      color: '#2D3047',

      lineHeight: '130%'
    },
    '& button': {
      height: 50,
      width: 250,
      marginTop: 104,
      borderRadius: '48px',

      fontSize: 16,
      fontWeight: 600,
      lineHeight: '18px',
      border: 'none',
      color: '#ffffff',
      background: '#2D3047'
    },
    '& span': {
      fontSize: 16,
      fontWeight: 600,
      color: '#65CB63',
      textAlign: 'center',
      marginTop: 30
    }
  },
  proposalTypeItem: {
    width: 120,
    height: 120,
    background: '#FFFFFF',
    boxShadow:
      'inset 0px 0px 2px rgba(0, 0, 0, 0.12), inset 0px 24px 11px rgba(0, 0, 0, 0.03), inset 0px 3px 8px rgba(0, 0, 0, 0.06)',
    borderRadius: 35
  },
  warningContainer: {
    background: 'rgba(231, 218, 175, 0.3)',
    borderRadius: '49px',
    height: '39px',
    width: '39px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '11px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    height: 101
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  tooltipHeaderInfo: {
    width: 14,
    height: 14,
    margin: 0,
    marginLeft: 3,
    transform: 'translateY(-1px)'
  },
  flexCenterCenterRow: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  popper: {
    maxWidth: 131,

    fontSize: 11
  },
  popperArrow: {
    '&::before': {
      borderColor: '#EFF2F8',
      backgroundColor: '#EFF2F8'
    }
  },
  tooltip: {
    padding: '22px 9px',
    borderColor: '#EFF2F8',
    backgroundColor: '#EFF2F8',
    color: '#707582',

    fontSize: 11,
    textAlign: 'center'
  },
  buttons: {
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 24,
    marginBottom: 32,
    '& button': {
      minWidth: 240,
      height: '59px',
      borderRadius: '48px',

      fontWeight: 800,
      lineHeight: '20px',
      border: 'none',
      color: '#FFFFFF',
      background: '#2D3047'
    }
  },
  confirmInfoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #FF8A00',
    padding: '24px 16px',
    fontSize: 22,
    fontWeight: 400,

    color: '#2D3047',
    borderRadius: 16,
    margin: '120px 64px',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      margin: '24px 0'
    }
  },
  infoIconSection: {
    marginBottom: 46
  },
  switchBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#f6f6f6',
    borderRadius: '68px',
    padding: 7,
    position: 'absolute',
    left: '50%',
    top: 0,
    transform: 'translateX(-50%)',
    marginTop: 18
  },
  switchItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 148,
    height: 50,
    cursor: 'pointer'
  },
  selectedSwitchItem: {
    background: 'linear-gradient(0deg, #2D3047, #2D3047)',
    borderRadius: '25px'
  },
  divider: {
    opacity: 0.2,
    backgroundColor: '#707582',
    width: '100%',
    height: 1
  },
  typo1: {
    fontSize: 19,
    fontWeight: 800,
    background: 'linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)',
    '-webkit-text-fill-color': 'transparent',
    '-webkit-background-clip': 'text',
    lineHeight: '130%',

    width: 'fit-content',
    textTransform: 'uppercase',
    [theme.breakpoints.down('xs')]: {
      fontSize: 16
    }
  },
  typo2: {
    fontSize: 16,
    fontWeight: 500,

    color: '#54658F'
  },
  typo3: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: '104.5%',

    textTransform: 'capitalize'
  },
  typo4: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: '104.5%'
  }
}));
