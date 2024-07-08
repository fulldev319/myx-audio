import makeStyles from '@material-ui/core/styles/makeStyles';
import { Color } from 'shared/ui-kit';
import { FontSize } from 'shared/ui-kit';

export const styles = makeStyles((theme) => ({
  root: {
    height: '100%',
    position: 'relative',
    background: 'white'
  },
  header: {
    position: 'fixed',
    top: 80,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottom: '1px solid #DAE6E5',
    background: 'white',
    height: '100px',
    padding: '0px 52px',
    fontWeight: 700,
    fontSize: 22,
    lineHeight: '140%',
    color: '#2D3047',
    zIndex: 2
  },
  content: {
    maxWidth: 1600,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 100,
    marginBottom: 100,
    padding: '36px 170px',
    background: '#FFFFFF',
    zIndex: 1
  },
  footer: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    borderTop: '1px solid #DAE6E5',
    padding: '19px 0 20px 0',
    display: 'flex',
    justifyContent: 'space-around',
    background: '#FFFFFF',
    zIndex: 2
  },
  title: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '22px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: 0.9
  },
  addZone: {
    border: '1px dashed #788BA2',
    boxSizing: 'border-box',
    borderRadius: '12px',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '33px 0 38px 0'
  },
  addButton: {
    height: 60,
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '22px',
    textTransform: 'uppercase',
    color: '#FFFFFF',
    borderRadius: 65,
    padding: '18px 62px'
  },
  backButton: {
    height: 60,
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '-0.04em',
    color: '#2D3047',
    padding: '20px 62px',
    border: '1px solid #2D3047 !important',
    borderRadius: '48px',
    textTransform: 'capitalize'
  },
  browseButton: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '16px !important',
    lineHeight: '19px',
    textAlign: 'center',
    color: '#FFFFFF !important',
    padding: '10px 20px',
    borderRadius: '48px !important',
    margin: 'auto',
    marginTop: '28px',
    textTransform: 'capitalize',
    '& span': {
      color: '#000000 !important'
    }
  },
  nextButton: {
    height: 60,
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '19px',
    textAlign: 'center',
    letterSpacing: '-0.04em',
    color: '#FFFFFF',
    padding: '20px 100px',
    borderRadius: '48px',
    textTransform: 'capitalize'
  },
  stepTitle: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#0D59EE'
  },
  searchIcon: {
    position: 'absolute',
    top: 16,
    right: 16
  },
  merchBox: {
    position: 'relative',
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    borderRadius: 20,
    height: 186,
    padding: '34px',
    '& img': {
      width: 110,
      height: 110,
      borderRadius: 6
    }
  },
  controlMerchBox: {
    position: 'absolute',
    display: 'flex',
    gridGap: 16, 
    top: 20,
    right: 20
  },
  removeBtn: {
    display: 'flex',
    alignItems:'center',
    height: 33,
    background: '#EFDDDD',
    borderRadius: 8,
    padding: '7px 10px',
    color: '#F43E5F'
  },
  editBtn: {
    display: 'flex',
    alignItems:'center',
    height: 33,
    background: '#DDE6EF',
    borderRadius: 8,
    padding: '7px 10px',
    color: '#54658F'
  },
  inputLabel: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  },
  input: {
    background: '#F2F4FB',
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
  priceInput: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#F2F4FB',
    border: '1px solid #DADADB',
    boxSizing: 'border-box',
    borderRadius: 8,
    padding: '34px 64px',
    height: '135px',
    fontWeight: 400,
    fontSize: '43px',
    lineHeight: '160%',
    color: 'rgba(107, 118, 156, 0.5)'
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
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 371,
    minHeight: 371,
    alignItems: 'center',
    background: '#F2F4FB',
    borderRadius: 8,
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
    width: '371px',
    height: '371px',
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  },
  uploadBox2: {
    display: 'flex',
    alignItems: 'center',
    background: '#F2F4FB',
    borderRadius: 8,
    padding: '28px 35px',
    border: '1px dashed #0D59EE',
    minHeight: 160,
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
  imageBox2: {
    width: 100,
    height: 100,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 27,
    color: '#ffffff'
  },
  controlBox: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '12px',
    lineHeight: '18px',
    color: '#2D3047',
    '& span': {
      color: '#0D59EE'
    },
    '& b': {
      fontWeight: 700,
      fontSize: 14
    }
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
  },
  typo7: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '140%',
    color: '#2D3047',
    textAlign: 'center'
  },
  typo8: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '150%',
    color: '#2D3047',
    textAlign: 'center'
  },
  typo9: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '18px',
    lineHeight: '120%',
    color: '#FFFFFF'
  },
  typo10: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '28px',
    lineHeight: '104.5%',
    color: '#FFFFFF'
  },
  typo11: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '22px',
    lineHeight: '104.5%',
    color: '#2D3047'
  },
  hashtagsRow: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    marginRight: 20
  },
  hashtagPillFilled: {
    color: 'white',
    backgroundColor: 'black',
    borderColor: 'black',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14.5,
    textAlign: 'center',
    padding: '6px 12px',
    borderRadius: 36,
    marginRight: 6,
    cursor: 'pointer'
  },
  hashtagPill: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14.5,
    textAlign: 'center',
    color: '#949bab',
    padding: '6px 12px',
    borderRadius: 36,
    border: '1px solid #949bab',
    marginRight: 6,
    cursor: 'pointer'
  },
  radioButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    border: '1px solid #DAE6E5',
    borderRadius: 8,
    '& div': {
      flex: 1,
      textAlign: 'center',
      padding: '4px 0',
      '&:first-child': {
        borderRight: '1px solid #DAE6E5'
      }
    },
    '& .MuiRadio-colorSecondary': {
      color: `${Color.MusicDAOBlue} !important`
    },
    '& .MuiFormControlLabel-label': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '104.5%',
      color: '#2D3047',
      opacity: '0.9'
    }
  },

  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#2D3047',
    opacity: 0.9,

    fontSize: '16px',
    fontWeight: 600
  },

  royaltyShareSection: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #0D59EE',
    borderRadius: 12,
    padding: '30px 20px',
    marginTop: 30
  }
}));
