import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const createBopStyles = makeStyles((theme) => ({
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: Color.MusicDAODark,
    '& span': {
      color: Color.MusicDAOGreen
    }
  },
  stepContainer: {
    position: 'relative',
    width: 45,
    height: 45,
    color: '#9897B8',
    border: '1px solid #9897B8',
    borderRadius: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& span': {
      zIndex: 10,
      fontSize: 14,
      fontWeight: 700
    }
  },
  activeStep: {
    position: 'absolute',
    margin: 2,
    width: 'calc(100% - 4px)',
    height: 'calc(100% - 4px)',
    background: '#65CB63',
    borderRadius: '100%'
  },
  completeStep: {
    position: 'absolute',
    margin: 2,
    width: 'calc(100% - 4px)',
    height: 'calc(100% - 4px)',
    background: '#65CB63',
    borderRadius: '100%',
    opacity: 0.5
  },
  highlight: {
    fontSize: 18,
    fontWeight: 600,
    color: '#4218B5'
  },
  text1: {
    fontSize: 18,
    fontWeight: 600,
    color: '#2D3047'
  },
  text2: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2D3047',
    opacity: 0.9
  },
  text3: {
    fontSize: 14,
    fontWeight: 500,
    color: '#54658F'
  },
  outlineSelect: {
    background: Color.White,
    border: '1px solid rgba(64, 70, 88, 0.1)',
    borderRadius: 44,
    paddingLeft: 20,
    paddingRight: 20,
    height: 50,
    '& .MuiSelect-root': {
      '& span': {
        fontSize: 14,
        color: '#181818',
        fontWeight: 600
      }
    }
  },
  tokenSelect: {
    borderRadius: '44px !important',
    backgroundColor: 'rgba(218, 230, 229, 0.8) !important',
    '& .MuiSelect-root': {
      '& div': {
        fontSize: 14,
        color: '#181818',
        fontWeight: 600
      }
    }
  },
  tokenValue: {
    height: 50,
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #7BCBB7',
    borderRadius: 44,
    paddingLeft: 18,
    paddingRight: 14,
    '& input': {
      color: '#2D3047',
      fontSize: 18,
      fontWeight: 500,
      outline: 'none',
      border: 'none',
      background: 'transparent',
      marginRight: 12
    },
    '& span': {
      fontSize: 14,
      color: '#54658F',
      whiteSpace: 'nowrap'
    }
  },
  accordion: {
    boxShadow: 'none',
    marginTop: '40px !important',
    '&:before': {
      display: 'none'
    },
    '& .MuiAccordionSummary-root': {
      padding: 0
    },
    '& .MuiAccordionDetails-root': {
      background: '#F2FBF6',
      padding: '25px 34px',
      flexDirection: 'column',
      borderRadius: 12,
      '& input': {
        background: '#FFFFFF',
        border: '1px solid #DADADB',
        borderRadius: 86,
        outline: 'none',
        height: 50,
        paddingLeft: 20,
        fontSize: 14,
        fontWeight: 500,
        color: '#54658F'
      }
    }
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    maxWidth: 300,
    minWidth: 200,
    cursor: 'pointer',
    '& svg': {
      width: '100%',
      top: 0
      // height: 0,
    },
    '& + &': {
      marginLeft: 16
    }
  }
}));
