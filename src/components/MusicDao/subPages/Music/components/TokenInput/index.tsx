import React from 'react';

import Box from '@material-ui/core/Box';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';

import { tokenInputStyles } from './index.styles';

const TokenInput = ({ symbol, amount, setAmount }) => {
  const classes = tokenInputStyles();

  return (
    <Input
      className={classes.root}
      style={{
        width: '100%',
        height: 46
      }}
      value={amount}
      onChange={(e) => {
        const targetValue = e.target.value.replace(',', '.');
        if (!targetValue || !isNaN(Number(targetValue))) setAmount(targetValue);
        else setAmount((prev) => prev);
      }}
      type="text"
      disableUnderline
      endAdornment={
        <InputAdornment position="end">
          <Box fontWeight={'bold'} mr={2}>
            {symbol}
          </Box>
        </InputAdornment>
      }
    />
  );
};

export default TokenInput;
