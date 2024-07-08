import React from 'react';
import styled from 'styled-components';

import InputAdornment from '@material-ui/core/InputAdornment';

import { Input } from './Input';
import { Icon } from '../display/Icon';

export const SearchInput = styled(Input).attrs({
  endAdornment: (
    <InputAdornment position="end">
      <Icon name="search" />
    </InputAdornment>
  )
})``;
