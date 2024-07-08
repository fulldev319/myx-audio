import { makeStyles } from '@material-ui/core/styles';

export const fundingTabStyles = makeStyles((theme) => ({
  input: {
    background: '#F0F5F5',
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 16,
    width: '100%',
    height: 100,
    '& .MuiInputBase-input': {
      height: '100%',
      paddingTop: 0,
      paddingBottom: 0,

      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: 32,
      lineHeight: '104.5%',
      color: '#181818'
    }
  },
  myTooltip: {
    '& .MuiTooltip-tooltip': {
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fontSize: 12,
      lineHeight: '130%'
    },
    '& .MuiTooltip-arrow': {
      color: 'rgba(0, 0, 0, 0.8)'
    }
  },
  withFundingSection: {
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',

    border: '1px solid #65CB63',
    boxSizing: 'border-box',
    borderRadius: '12px',
    padding: '27px 23px'
  },
  grayLabel: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: 0.6
  }
}));
