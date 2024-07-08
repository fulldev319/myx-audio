import { makeStyles } from '@material-ui/core/styles';

export const tokenSelectorStyles = makeStyles((theme) => ({
  root: {
    background: 'rgba(218, 230, 229, 0.8)',
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
    width: 37
  }
}));
