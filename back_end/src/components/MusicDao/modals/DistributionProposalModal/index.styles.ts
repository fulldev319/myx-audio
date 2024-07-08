import { makeStyles } from '@material-ui/core/styles';

export const distributionProposalModalStyles = makeStyles((theme) => ({
  root: {
    width: '653px !important'
  },
  firstSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '38px 31px 31px'
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2D3047',
    lineHeight: '130%',

    marginTop: 37
  },
  content: {
    color: '#54658F',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '24px',

    marginTop: 14,
    textAlign: 'center',
    marginBottom: 58,
    '& span': {
      fontWeight: 800
    }
  },
  startBtn: {
    background: '#2D3047',
    borderRadius: 25,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 600,

    lineHeight: '18px',
    color: '#ffffff',
    cursor: 'pointer',
    padding: '14px 67px'
  },
  footer: {
    color: '#65CB63',
    fontSize: 16,
    fontWeight: 600,

    lineHeight: '24px',
    marginTop: 30
  },
  mainContent: {
    padding: '18px 9px 11px'
  },
  mainContentTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#2D3047',
    lineHeight: '130%',

    display: 'flex',
    justifyContent: 'center'
  },
  title1: {
    fontSize: 14,
    fontWeight: 400,
    color: '#707582',
    lineHeight: '104.5%'
  },
  priceContent: {
    fontSize: 30,
    fontWeight: 400,
    color: '#181818',
    lineHeight: '104.5%',

    paddingBottom: 10.5,
    borderBottom: '1px dashed #18181822',
    '& span': {
      fontSize: 14,
      color: '#707582',
      lineHeight: '104.5%'
    }
  },
  title2: {
    fontSize: 14,
    fontWeight: 600,
    color: '#4218B5',
    lineHeight: '104.5%'
  },
  title3: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2D3047',
    lineHeight: '18px'
  },
  artistContent: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column'
  },
  proposal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '17px 8px',
    marginBottom: 2,
    background: 'rgba(236, 240, 244, 0.4)'
  },
  nameTypo: {
    fontSize: 16,
    fontWeight: 600,

    color: '#181818',
    lineHeight: '104.5%'
  },
  slugTypo: {
    fontSize: 14,
    fontWeight: 600,

    color: '#65CB63',
    lineHeight: '104.5%'
  },
  priceTypo1: {
    fontSize: 16,
    fontWeight: 500,

    lineHeight: '104.5%',
    color: '#2D3047'
  },
  priceTypo2: {
    fontSize: 14,
    fontWeight: 500,

    lineHeight: '104.5%',
    color: 'rgba(45, 48, 71, 0.5)'
  },
  priceSection: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    borderRadius: 8,
    padding: '12px 27px',
    fontSize: 14,
    fontWeight: 500,

    lineHeight: '22.4px',
    color: '#2D3047'
  },
  addedAddressContent: {
    padding: '20px 0',
    borderBottom: '1px dashed #18181822'
  },
  walletAddressBtn: {
    display: 'flex',
    alignItems: 'center',
    background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
    borderRadius: 17,
    padding: '11px 15px',
    maxWidth: 180,
    cursor: 'pointer',
    '& span': {
      fontSize: 14,
      fontWeight: 700,
      color: '#2D3047',

      lineHeight: '100%',
      marginLeft: 10
    }
  },
  previewContent: {
    padding: '22px 0px 27px',
    borderBottom: '1px solid #00000022'
  },
  previewLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 14,
    fontWeight: 500,

    lineHeight: '104.5%'
  },
  mainContentFooter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  footerTitle1: {
    fontSize: 16,
    fontWeight: 500,
    color: '#54658F',

    lineHeight: '24px',
    textAlign: 'center',
    marginTop: 18,
    marginBottom: 41
  },
  footerTitle2: {
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 600,
    color: '#65CB63',

    lineHeight: '24px',
    textAlign: 'center',
    marginTop: 24,
    '& span': {
      marginLeft: 10
    }
  },
  addedAddressBox: {
    width: 458
  },
  addedPercentBox: {
    width: 85
  }
}));
