import { makeStyles } from '@material-ui/core/styles';

export const chainSelectorStyles = makeStyles((theme) => ({
  root: {
    background: 'linear-gradient(0deg, #FFFFFF, #FFFFFF), #17172D',
    border: '1px solid #DEE7DA',
    borderRadius: '45px',
    height: 46,
    '& .MuiSelect-select:focus': {
      backgroundColor: 'transparent'
    }
  },
  icon: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: -5,
    width: 18
  }
}));
