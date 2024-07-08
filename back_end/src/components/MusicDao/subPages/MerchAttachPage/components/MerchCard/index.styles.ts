import { makeStyles } from '@material-ui/core/styles';

export const styles = makeStyles((theme) => ({
  leftCard: {
    display: 'flex',
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(84, 101, 143, 0.3)',
    boxSizing: 'border-box',
    borderRadius: '20px',
    padding: '22px 24px 36px 34px',
    marginRight: 13
  },
  rightCard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#E4F4FF',
    border: '1px solid #92CAFF',
    boxSizing: 'border-box',
    borderRadius: '24px',
    width: 222
  },
  image: {
    width: 206,
    height: 206,
    marginRight: 39,
    borderRadius: 5
  },
  merchName: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '26px',
    lineHeight: '150%',
    color: '#2D3047'
  },
  removeButton: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '120%',
    color: '#F43E5F',
    padding: '6px 11px',
    borderRadius: 8,
    textTransform: 'capitalize'
  },
  editButton: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '120%',
    color: '#54658F',
    padding: '6px 11px',
    borderRadius: 8,
    textTransform: 'capitalize'
  },
  desc: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '150%',
    color: '#7E7D95'
  },
  inputBigBox: {
    width: 248,
    height: 58,
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    boxSizing: 'border-box',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 19,
    paddingRight: 19
  },
  amountBox: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    boxSizing: 'border-box',
    borderRadius: '12px'
  },
  inputSuffix: {
    fontFamily: "'Pangram'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '104.5%',
    color: '#0D59EE'
  },
  typo1: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '104.5%',
    textAlign: 'center',
    color: '#2D3047',
    opacity: '0.9'
  },
  typo2: {
    marginTop: 10,
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: '21px',
    lineHeight: '120%',
    textAlign: 'center',
    color: '#2D3047'
  },
  typo3: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '16px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  },
  typo4: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '28px',
    lineHeight: '104.5%',
    color: '#2D3047'
  },
  typo5: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '28px',
    lineHeight: '104.5%',
    color: '#54658F'
  },
  typo6: {
    fontFamily: "'Pangram Regular'",
    fontStyle: 'normal',
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '104.5%',
    color: '#0D59EE'
  }
}));
