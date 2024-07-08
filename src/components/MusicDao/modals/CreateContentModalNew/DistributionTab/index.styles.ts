import { makeStyles } from '@material-ui/core/styles';
import { Color, Gradient } from 'shared/ui-kit';

export const useDistributionTabStyles = makeStyles((theme) => ({
  generalNftMediaTab: {},
  flexRowInputs: {
    display: 'flex'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#2D3047',
    opacity: 0.9,

    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '8px'
  },
  tooltipHeaderInfo: {
    verticalAlign: 'top',
    marginLeft: 2,
    width: 14,
    height: 14,
    transform: 'translateY(-5px)'
  },
  infoHeaderCreatePod: {
    fontSize: 16,
    fontWeight: 600,

    lineHeight: '104.5%',
    color: '#2D3047'
  },
  distribBox: {
    background: 'rgba(236, 240, 244, 0.4)',
    borderRadius: 8,
    padding: '12px 12px 12px 20px',
    '& + &': {
      marginTop: 8
    },
    [theme.breakpoints.down(400)]: {
      padding: '12px 6px 12px 6px'
    }
  },
  percentageBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    minWidth: 85,
    height: 45,
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    borderRadius: 8,
    '& > input': {
      textAlign: 'center'
    },
    [theme.breakpoints.down(400)]: {
      width: 75,
      minWidth: 75
    }
  },
  nameTypo: {
    fontSize: 16,
    fontWeight: 600,

    color: '#181818',
    lineHeight: '104.5%',
    overflow: 'hidden',
    width: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down(400)]: {
      fontSize: 12
    }
  },
  slugTypo: {
    fontSize: 14,
    fontWeight: 600,

    color: '#65CB63',
    lineHeight: '104.5%',
    overflow: 'hidden',
    width: '100%',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    [theme.breakpoints.down('xs')]: {
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      width: 140,
      flexWrap: 'nowrap'
    },
    [theme.breakpoints.down(400)]: {
      fontSize: 10
    }
  },
  totalPercentageBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 45,
    background: '#fff',
    border: '1px solid #DADADB',
    borderRadius: 8,
    padding: '0px 8px 0px 18px',
    [theme.breakpoints.down('xs')]: {
      width: 85
    }
  },
  totalBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#D1F8D0',
    border: '1px solid #65CB63',
    borderRadius: 8,
    padding: '12px 12px 12px 26px',
    marginTop: 20,
    marginBottom: 16,
    '& span': {
      fontSize: 16,
      fontWeight: 600,

      color: '#181818',
      textTransform: 'uppercase'
    }
  },
  input: {
    background: 'rgba(218, 230, 229, 0.4)',
    border: '1px solid #DADADB',
    borderRadius: 8,
    height: 45,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
    outline: 'none',
    fontSize: 14,
    color: '#2D3047'
  },
  albumSelectOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    borderBottom: '1px solid #ccc',
    '&:last-child': {
      border: 'none'
    }
    // "&:hover": {
    //   background: "#E4E9E9",
    // },
  }
}));
