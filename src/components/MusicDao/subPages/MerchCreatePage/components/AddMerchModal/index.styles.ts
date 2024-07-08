import { makeStyles } from '@material-ui/core/styles';

export const styles = makeStyles((theme) => ({
  modalContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  inputLabel: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  },
  input: {
    background: 'linear-gradient(0deg, #F6F8FA, #F6F8FA), #17172D',
    border: '1px solid #DADADB',
    boxSizing: 'border-box',
    borderRadius: '8px',
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '160%',
    display: 'flex',
    alignItems: 'center',
    color: '#7E7D95',
    outline: 'none',
    padding: '13px 19px',
    width: '100%'
  },
  alert: {
    border: '1px solid rgba(255, 138, 1, 0.32)',
    boxSizing: 'border-box',
    borderRadius: '12px',
    background:
      'linear-gradient(0deg, #FF9101, #FF9101), linear-gradient(80.77deg, #FFB800 -52.72%, #FF9F00 10.9%, #FF8A00 63.78%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    padding: '20px 24px',
    display: 'flex',
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '150%'
  },
  uploadBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#F2F4FB',
    border: '1px dashed #0D59EE',
    borderRadius: 8,
    padding: '12px 12px 12px 12px',
    '& button': {
      color: 'white',
      background: 'transparent',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: 8,
      fontSize: 12,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 'unset'
    }
  },
  imageBox: {
    width: 85,
    height: 85,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  },
  controlBox: {
    fontFamily: "'Pangram Regualr'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '18px',
    color: '#2D3047',
    '& span': {
      color: '#0D59EE'
    }
  },
  nextButton: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '-0.04em',
    color: '#FFFFFF',
    padding: '14px 100px',
    borderRadius: '48px',
    textTransform: 'capitalize',
    marginTop: 35
  },
  title: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '22px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: 0.9,
    textAlign: 'center',
    width: '100%'
  },
  typo1: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '32px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  },
  typo2: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '150%',
    textAlign: 'center',
    color: '#2D3047',
    opacity: '0.6'
  },
  typo3: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '120%',
    color: '#2D3047'
  },
  typo4: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '28px',
    lineHeight: '104.5%',
    textAlign: 'right',
    color: '#0D59EE',
    opacity: '0.9'
  },
  typo5: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '104.5%',
    textTransform: 'uppercase',
    color: '#0D59EE',
    opacity: '0.9'
  },
  typo6: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  }
}));
