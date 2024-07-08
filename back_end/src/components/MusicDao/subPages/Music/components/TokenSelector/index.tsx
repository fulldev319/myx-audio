import React from 'react';

import FormControl from '@material-ui/core/FormControl';

import {
  StyledSelect,
  StyledMenuItem
} from 'shared/ui-kit/Styled-components/StyledComponents';
import { tokenSelectorStyles } from './index.styles';

const Tokens = [{ name: 'USDT', image: 'USDT' }];

const TokenSelector = ({ token, setToken }) => {
  const classes = tokenSelectorStyles();

  return (
    <>
      <FormControl style={{ width: '100%' }}>
        <StyledSelect
          className={classes.root}
          value={token}
          onChange={(v) => setToken(v.target.value)}
          renderValue={(value: any) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {value &&
                Tokens.find(
                  (item) => item.name?.toLowerCase() === value?.toLowerCase()
                ) && (
                  <img
                    src={require(`assets/tokenImages/${value}.webp`)}
                    className={classes.icon}
                  />
                )}
              {value}
            </div>
          )}
        >
          {Tokens.map((item, index) => (
            <StyledMenuItem key={`token-item-${index}`} value={item['name']}>
              {item['name']}
            </StyledMenuItem>
          ))}
        </StyledSelect>
      </FormControl>
    </>
  );
};

export default TokenSelector;
