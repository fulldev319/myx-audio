import makeStyles from '@material-ui/core/styles/makeStyles';

export const useCustomSelectStyles = makeStyles((theme) => ({
  open: {
    // borderBottomLeftRadius: 0,
    // borderBottomRightRadius: 0,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    justifyContent: 'space-between',
    width: (props: any) => props.width
  },
  popUpSection: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '14px',
    lineHeight: '18px',
    color: '#2D3047',
    textTransform: 'capitalize'
  },
  popUpMenu: {
    zIndex: 100,
    width: (props: any) => props.width
  },
  label: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '18px',
    color: '#7E7D95',
    marginRight: 8
  },
  popUpMenuContent: {
    background: '#FFFFFF',
    boxShadow:
      '0px 8px 24px -20px rgba(71, 78, 104, 0.19), 0px 41px 65px -11px rgba(36, 46, 60, 0.1)',
    borderRadius: '17px',
    maxHeight: '310px',
    overflow: 'scroll',
    '& li': {
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '14px',
      lineHeight: '18px',
      color: '#2D3047',
      textTransform: 'capitalize',
      backgroundColor: 'inherit !important',
      paddingTop: 0,
      paddingBottom: 0,
      '& > div': {
        padding: '4px 8px',
        width: '100%'
      },
      '&:hover': {
        color: '#65CB63',
        '& > div': {
          background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D',
          borderRadius: 51
        }
      }
    }
  }
}));
