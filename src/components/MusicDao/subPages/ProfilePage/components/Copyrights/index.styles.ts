import makeStyles from '@material-ui/core/styles/makeStyles';

export const useCopyRightStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: 80
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    lineHeight: '39px',
    color: '#FFFFFF'
  },
  table: {
    borderSpacing: '0 12px',
    borderCollapse: 'separate',

    '& .MuiTableCell-head': {
      fontSize: 14,
      color: '#707582',
      fontWeight: 600,
      textTransform: 'uppercase',
      // whiteSpace: "nowrap",
      '&:not(:first-child)': {
        [theme.breakpoints.down('xs')]: {
          paddingLeft: 0,
          paddingRight: 0,
          maxWidth: 70
        }
      },
      [theme.breakpoints.down('xs')]: {
        fontSize: 10,
        lineHeight: '15px'
      }
    },
    '& .MuiTableRow-root.MuiTableRow-body': {
      background: '#fff'
    },
    '& .MuiTableCell-body': {
      fontSize: 14,
      background: 'white',
      boxShadow: '0px 30px 35px -12px rgb(0 0 0 / 3%)',
      '&:first-child': {
        borderTopLeftRadius: 14,
        borderBottomLeftRadius: 14
      },
      '&:last-child': {
        borderTopRightRadius: 14,
        borderBottomRightRadius: 14
      },
      '& button': {
        backgroundColor: '#65CB63',
        width: 136,
        height: 40,
        fontSize: 16,
        fontWeight: 800,
        borderRadius: 30
      },
      [theme.breakpoints.down('xs')]: {
        padding: 8,
        fontSize: 10
      }
    },
    '& .MuiTableCell-root': {
      borderBottom: 'none'
    }
  },
  text1: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2D3047',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  podInfo: {
    display: 'flex',
    alignItems: 'center',
    '& img': {
      width: 110,
      height: 110,
      objectFit: 'cover',
      borderRadius: 8,
      [theme.breakpoints.down('xs')]: {
        width: 50,
        height: 50
      }
    },
    '& span': {
      color: '#081831',
      fontSize: 18,
      fontWeight: 700,
      [theme.breakpoints.down('xs')]: {
        fontSize: 12
      }
    },
    '& p': {
      color: '#707582',
      fontSize: 14,
      fontWeight: 500,
      display: '-webkit-box',
      '-webkit-line-clamp': 3,
      '-webkit-box-orient': 'vertical',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      [theme.breakpoints.down('xs')]: {
        fontSize: 10
      }
    }
  }
}));
