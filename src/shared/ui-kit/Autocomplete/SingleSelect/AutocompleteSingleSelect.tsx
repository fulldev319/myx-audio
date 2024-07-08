import React, { useState } from 'react';
import { Autocomplete } from '@material-ui/lab';
import styled from 'styled-components';

import InputAdornment from '@material-ui/core/InputAdornment';

import { Input } from 'shared/ui-kit';
import { grid, Color } from '../../../constants/const';

type AutocompleteSingleSelectProps<T> = {
  selectedItem: T;
  onSelectedItemChange: (newSelectedItem: T) => void;
  allItems: T[];
  placeholder: string;
  renderOption: (item: T) => React.ReactNode;
  getOptionLabel: (item: T) => string;
  autoFocus?: boolean;
};

export const AutocompleteSingleSelect = <T extends { id: string | number }>({
  selectedItem,
  onSelectedItemChange,
  allItems,
  placeholder,
  renderOption,
  getOptionLabel,
  autoFocus
}: AutocompleteSingleSelectProps<T>) => {
  const [autocompleteKey, setAutocompleteKey] = useState<number>(() =>
    new Date().getTime()
  );

  return (
    <Container>
      <Autocomplete<T, false, false, false>
        options={allItems}
        clearOnBlur
        key={autocompleteKey}
        value={selectedItem}
        PaperComponent={PaperComponent}
        onChange={(_event, item) => {
          if (item) {
            onSelectedItemChange(item);
            setAutocompleteKey(new Date().getTime());
          }
        }}
        getOptionLabel={getOptionLabel}
        renderInput={(params) => (
          <Input
            fullWidth
            size="large"
            ref={params.InputProps.ref}
            inputProps={params.inputProps}
            autoFocus={autoFocus}
            placeholder={placeholder}
            style={{ color: '#181818', fontSize: 14 }}
            endAdornment={
              <InputAdornment position="end" style={{ marginRight: 0 }}>
                <DropIcon />
              </InputAdornment>
            }
          />
        )}
        renderOption={(item) => (
          <Option>
            <OptionContent>{renderOption(item)}</OptionContent>
          </Option>
        )}
      />
    </Container>
  );
};

const OPTION_HEIGHT = grid(7);

const Option = styled.div`
  width: 100%;
  height: ${OPTION_HEIGHT};
  display: flex;
  border-bottom: 1px solid ${Color.GrayLight};
  font-family: Agrandir;
`;

const OptionContent = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: left;
  font-size: 14px;
`;

const PaperComponent = styled.div`
  width: calc(100% + 2px);
  margin: 0 -1px;
  font-family: inherit;

  .MuiAutocomplete-listbox {
    background: #f7f9fe;
    padding: 0;
  }

  .MuiAutocomplete-option {
    padding: 0;

    ${Option} {
      padding-left: ${grid(2)};
    }
  }
`;

const Container = styled.div``;

const DropIcon = () => (
  <svg
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z"
      fill="#181818"
    />
  </svg>
);
