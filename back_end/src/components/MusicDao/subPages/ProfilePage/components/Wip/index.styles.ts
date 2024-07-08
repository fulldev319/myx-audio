import makeStyles from '@material-ui/core/styles/makeStyles';

export const useWipStyles = makeStyles((theme) => ({
  container: {
    paddingBottom: 80
  },
  title: {
    display: 'flex',
    alignItems: 'center'
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
      fontSize: 16,
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
  textName: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2D3047',
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  textCollection: {
    fontSize: 20,
    fontWeight: 400,
    color: '#2D3047',
    textAlign: 'center',
    opacity: 0.7,
    [theme.breakpoints.down('xs')]: {
      fontSize: 14
    }
  },
  textStatus: {
    color: '#fff',
    fontWeight: 600,
    background: '#65CB63',
    padding: '10px 20px',
    borderRadius: 8,
    textAlign: 'center',
    width: 'fit-content',
    lineHeight: '14px',
    [theme.breakpoints.down('xs')]: {
      padding: '5px 12px'
    }
  },
  image: {
    '& img': {
      width: 110,
      height: 110,
      borderRadius: 8,
      [theme.breakpoints.down('xs')]: {
        width: 50,
        height: 50
      }
    }
  },
  explorer: {
    display: 'flex',
    justifyContent: 'center',
    '& img': {
      width: 24,
      height: 24,
      [theme.breakpoints.down('xs')]: {
        width: 16,
        height: 16
      }
    }
  },
  mintingButton: {}
}));
