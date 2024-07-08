import { makeStyles } from '@material-ui/core/styles';

export const SellingProposalModalStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',

    color: '#2D3047'
  },
  header1: {
    fontSize: 22,
    fontWeight: 800
  },
  header2: {
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '150%'
  },
  header3: {
    fontSize: 16,
    fontWeight: 800,
    lineHeight: '130%'
  },
  header4: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: '18px'
  },
  header5: {
    fontSize: 28,
    fontWeight: 800,
    '& > span': {
      opacity: 0.7
    }
  },
  header6: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: '150%'
  },
  item: {
    width: '100%',
    backgroundColor: '#F0F5F5',
    borderRadius: 8,
    height: 45
  },
  nft: {
    paddingLeft: 12
  },
  market: {
    paddingLeft: 12,
    textAlign: 'left'
  },
  price: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: 12,
    paddingRight: 12,
    '& input': {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none'
    }
  },
  popover: {
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    border: '1px solid #DEE7DA',
    boxShadow:
      '0px 8px 8px -4px rgba(86, 101, 123, 0.15), 0px 24px 35px -1px rgba(42, 52, 65, 0.12)',
    borderRadius: 16,
    '& .MuiListItem-root': {
      cursor: 'pointer',
      borderBottom: '1px solid #0000001A'
    }
  },
  listText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#404658'
  },
  selectText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#65CB63'
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 6
  }
}));
