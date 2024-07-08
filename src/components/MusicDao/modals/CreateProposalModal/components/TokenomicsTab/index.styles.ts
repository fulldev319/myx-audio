import { makeStyles } from '@material-ui/core/styles';

export const tokenomicsTabStyles = makeStyles((theme) => ({
  tokenomicsTab: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
    margin: 0,
    '& input': {}
  },
  img: {
    [theme.breakpoints.down('xs')]: {
      width: theme.spacing(10)
    }
  },
  flexRowInputs: {
    display: 'flex',
    marginTop: 28
  },
  supplyBox: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  infoHeaderCreatePod: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2D3047',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  tooltipHeaderInfo: {
    marginLeft: 2,
    width: 15,
    height: 15
  },
  textAreaCreatePod: {
    width: '100%',
    height: 140,
    paddingTop: 17,
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    border: '1px solid #b6b6b6',
    marginTop: 8,
    color: 'rgb(101, 110, 126)',
    fontSize: 14,
    fontWeight: 400,
    paddingLeft: 20,
    textTransform: 'none',
    outline: 'none',
    '&::placeholder': {
      color: 'rgba(101, 110, 126, 0.5)',
      fontSize: 14,
      fontWeight: 400,
      textTransform: 'none'
    }
  },
  divCreatorInput: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  imageCreatePodDiv: {
    position: 'relative',
    marginTop: 8
  },
  imageCreatePod: {
    width: '100%',
    height: 'calc(200px - 17px) !important',
    borderRadius: 16
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 80,
    fontSize: 18,
    cursor: 'pointer',
    color: 'rgb(100, 200, 158)'
  },
  dragImageHereCreatePod: {
    borderRadius: 16,
    width: '100%',
    height: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: 20,
    background: '#f6f6f6',
    border: '1px dashed #b6b6b6',
    boxSizing: 'border-box',
    marginTop: 8
  },
  dragImageHereIcon: {
    width: 40,
    height: 32,
    marginBottom: 16
  },
  dragImageHereLabelImgTitleDesc: {
    fontWeight: 400,
    color: '#99a1b3',
    fontSize: 18
  },
  dragImageHereLabelImgTitleSubDesc: {
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: 14,
    color: '#949bab',
    '& span': {
      color: '#29e8dc'
    }
  },
  optionButtons: {
    display: 'flex',
    alignContent: 'space-between',
    alignSelf: 'flex-start',
    backgroundColor: 'transparent'
  },
  plotSection: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonCreatePodRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 32,

    '& button': {
      border: 'none'
    }
  },
  textFieldCreatePod: {
    background: '#f7f8fa',
    border: '1px solid #99a1b3',
    borderRadius: 10,
    height: 48,
    width: '100%',
    padding: '0px 10px',
    outline: 'none',
    marginTop: 8
  },
  selectorFormControlCreatePod: {
    width: '100%'
  },
  selectCreatePod: {
    fontStyle: 'normal',
    backgroundColor: 'transparent',
    fontWeight: 800,
    fontSize: 18,
    color: '#181818',
    border: 'none'
  },
  datePicker: {
    // marginTop: "25px",
    width: '100%',
    '& .MuiInput-root::before': {
      border: 'none'
    }
  },
  mt25: {
    marginTop: '25px'
  },
  typo1: {
    fontSize: 14,
    fontWeight: 500,

    color: '#FF8E3C'
  },
  withFundingSection: {
    boxSizing: 'border-box',
    borderRadius: '12px',
    padding: '27px 23px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  },
  grayLabel: {
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: 0.6
  },
  subTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 800,
    lineHeight: '104.5%',
    color: '#2D3047',
    opacity: '0.9'
  }
}));
