import React from 'react';

import Skeleton from '@material-ui/lab/Skeleton';
import withStyles from '@material-ui/core/styles/withStyles';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Menu from '@material-ui/core/Menu';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Box from 'shared/ui-kit/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper
  },
  buttonBox: {
    background: 'black',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginLeft: theme.spacing(1),
    color: 'white',
    fontSize: '14px',

    fontWeight: 'bold',
    borderRadius: theme.spacing(0.5)
  }
}));

const options = ['MUSIC Wallet', 'Ethereum Wallet'];

export const CustomWalletSelector = ({ onChange }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClickButton = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    setSelectedIndex(index);
    onChange(options[index]);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <Box className={classes.buttonBox} onClick={handleClickButton}>
        {options[selectedIndex]}
      </Box>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export const StyledSlider = withStyles({
  root: {
    color: '#45CFEA'
  },
  thumb: {
    color: 'white',
    border: '2px #45CFEA solid'
  },
  valueLabel: {
    color: '#45CFEA'
  }
})(Slider);

export const StyledBlueSelect = withStyles({
  select: {
    fontSize: '14px'
  },
  icon: {
    fill: '#000'
  }
})(Select);

export const StyledModalSelect = withStyles({
  select: {
    fontSize: '16px',

    background: 'white',
    boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.08)',
    borderRadius: '10px',
    padding: '18px 12px'
  },
  icon: {
    fill: '#181818'
  }
})(Select);

export const StyledTextField = withStyles({
  root: {
    fontSize: '14px',

    borderRadius: '10px',
    padding: '12px 12px'
  }
})(TextField);

export const StyledTextField2 = withStyles({
  root: {
    fontSize: '16px',

    background: 'white',
    boxShadow: '0px 2px 14px rgba(0, 0, 0, 0.08)',
    borderRadius: '10px',
    padding: '18px 12px',
    '& .MuiInput-root::before': {
      border: 'none'
    }
  }
})(TextField);

export const StyledSelect = withStyles({
  select: {
    paddingTop: '11px',
    fontSize: '14px',

    fontWeight: 'bold'
  }
})(Select);

export const StyledSelectDao = withStyles({
  select: {
    fontSize: '14px',

    fontWeight: 'bold',
    '&:focus': {
      backgroundColor: 'transparent'
    },
    padding: '12px 14px'
  }
})(Select);

export const StyledWhiteSelect = withStyles({
  select: {
    fontSize: '14px'
  },
  icon: {
    fill: 'white'
  }
})(Select);

export const StyledMenuItem = withStyles({
  root: {
    fontSize: '14px'
  }
})(MenuItem);

export const StyledSkeleton = withStyles({
  root: {
    borderRadius: 12
  }
})(Skeleton);
