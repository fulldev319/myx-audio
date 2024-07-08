import { makeStyles } from '@material-ui/core/styles';

export const createPodStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(4),
    boxSizing: 'content-box',
    maxWidth: '876px',
    '& .MuiInputBase-root.MuiInput-root': {
      background: 'linear-gradient(0deg, #F6F8FA, #F6F8FA), #17172D',
      border: '1px solid rgba(78, 76, 132, 0.8)',
      borderRadius: 8
    },
    '& textarea': {
      background: 'linear-gradient(0deg, #F6F8FA, #F6F8FA), #17172D',
      border: '1px solid rgba(78, 76, 132, 0.8)',
      borderRadius: 8
    },
    '& svg': {
      // color: "grey",
      width: '48px',
      '& circle': {
        stroke: 'none',
        fill: '#DAE6E5'
      }
    },
    '& .dragImageHereImgTitleDesc': {
      background: 'rgba(238, 242, 247, 0.5) !important'
    },
    [theme.breakpoints.down('xs')]: {
      '& svg': {
        width: '72px'
      }
    }
  },
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
    fontSize: 18,
    fontWeight: 400,
    color: 'black'
  },
  textFieldCreatePod: {
    background: '#f7f9fe',
    border: '1px solid #e0e4f3',
    boxSizing: 'border-box',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    padding: 15,
    height: 46,
    marginTop: 8,
    width: '100%',
    outline: 'none'
  },
  hashtagsRow: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
    marginRight: 20
  },
  formControlHashInputWide: {
    '& div.MuiOutlinedInput-root': {
      height: 40,
      marginTop: '0 !important'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0
    }
  },
  hashtagInput: {
    background: '#f7f9fe',
    border: '1px solid #e0e4f3',
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 46,
    width: '100%',
    '& .MuiFormControl-root': {
      width: '100%'
    }
  },
  hashtagInputImg: {
    height: 10,
    width: 10,
    cursor: 'pointer',
    marginRight: 10
  },
  hashtagInputTag: {
    border: 0,
    padding: 0,
    margin: 0,
    background: 'transparent',
    borderRadius: 0,
    height: 'auto'
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
  optionButtonsMedia: {
    backgroundColor: 'rgb(227, 233, 239)',
    borderRadius: 20,
    marginTop: 8,
    padding: 2,
    background: '#949bab',
    height: 32,
    width: 52,
    display: 'flex',
    flexDirection: 'row',
    cursor: 'pointer',
    '& div': {
      backgroundColor: 'white',
      boxShadow:
        '0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06)',
      width: 27,
      height: 27,
      borderRadius: '50%'
    }
  },
  optionButtonsMediaActive: {
    background: 'linear-gradient(97.4deg, #23d0c6 73.68%, #00cc8f 85.96%)',
    justifyContent: 'flex-end',
    borderRadius: 20,
    marginTop: 8,
    padding: 2,
    height: 32,
    width: 52,
    display: 'flex',
    flexDirection: 'row',
    cursor: 'pointer',
    '& div': {
      backgroundColor: 'white',
      boxShadow:
        '0px 3px 8px rgba(0, 0, 0, 0.15), 0px 3px 1px rgba(0, 0, 0, 0.06)',
      width: 27,
      height: 27,
      borderRadius: '50%'
    }
  },
  myTooltip: {
    '& .MuiTooltip-tooltip': {
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#fff',
      fontSize: 12,
      lineHeight: '130%'
    },
    '& .MuiTooltip-arrow': {
      color: 'rgba(0, 0, 0, 0.8)'
    }
  },
  alertTypo: {
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '150%',
    // textAlign: "center",
    background: `linear-gradient(80.77deg, #FFB800 -52.72%, #FF9F00 10.9%, #FF8A00 63.78%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
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
      color: '#0D59EE !important'
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
  addNewArtist: {
    background: '#0D59EE',
    borderRadius: '22px',
    height: 32,
    padding: '7px 14px'
  },
  renderItemBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 26px',
    width: '100%',
    [theme.breakpoints.down(560)]: {
      paddingLeft: '8px',
      paddingRight: '8px'
    }
  },
  urlSlug: {
    fontSize: 16,
    color: '#404658',
    maxWidth: 120,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    marginLeft: 10,
    whiteSpace: 'nowrap'
  },
  removeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    marginLeft: theme.spacing(1),
    border: '1.5px solid red',
    borderRadius: '50%',
    width: theme.spacing(3),
    height: theme.spacing(3),
    background: 'none',
    '& svg': {
      width: '10px',
      height: '10px'
    }
  }
}));

export const useAutocompleteStyles = makeStyles(() => ({
  root: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.4)',
    border: '1px solid rgba(78, 76, 132, 0.8)',
    borderRadius: 8,
    '& .MuiInputBase-root': {
      padding: '0 24px',
      width: '100%'
    }
  },
  paper: {
    borderRadius: 24,
    boxShadow:
      '0px 8px 8px -4px rgba(86, 101, 123, 0.15), 0px 24px 35px -1px rgba(42, 52, 65, 0.12)'
  },
  listbox: {
    borderRadius: 20,
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    border: '1px solid #DEE7DA',
    padding: 0
  },
  option: {
    padding: 0,
    borderBottom: '1px solid #00000021',
    '&:last-child': {
      borderBottom: 'none'
    }
  },
  input: {
    height: 58,
    boxSizing: 'border-box',

    fontStyle: 'normal',
    fontWeight: 60,
    fontSize: '16px',
    lineHeight: '160%',
    color: '#7E7D95'
  }
}));
