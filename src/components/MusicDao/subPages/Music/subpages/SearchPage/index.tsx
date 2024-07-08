import React, { useEffect, useContext } from 'react';

// import Box from 'shared/ui-kit/Box';
import RecentSearchesPage from './RecentSearchesPage';
import SearchedPage from './SearchedPage';

import { searchPageStyles } from './index.styles';
// import { useDebounce } from 'use-debounce/lib';
// import InputWithLabelAndTooltip from 'shared/ui-kit/InputWithLabelAndTooltip';
// import { SearchIcon } from 'components/MusicDao/components/Icons/SvgIcons';
// import { Color } from 'shared/ui-kit';
import MusicContext from 'shared/contexts/MusicContext';

export default function SearchPage() {
  const classes = searchPageStyles();

  const { fixSearch } = useContext(MusicContext);

  // const [searchValue, setSearchValue] = React.useState<string>('');
  // const [debouncedSearchValue] = useDebounce(searchValue, 1000);

  // useEffect(() => {
  //   // refresh page with searching
  //   // console.log(debouncedSearchValue)
  // }, [debouncedSearchValue]);

  // useEffect(() => {
  //   console.log('========', fixSearch);
  // }, [fixSearch]);

  return (
    <div className={classes.page} id={'scrollContainer'}>
      <div className={classes.content}>
        {/* <div className={classes.searchBox}>
          <InputWithLabelAndTooltip
            type="text"
            inputValue={searchValue}
            placeHolder="Search"
            onInputValueChange={(e) => {
              setSearchValue(e.target.value);
            }}
            style={{
              background: 'transparent',
              margin: 0,
              marginRight: 8,
              padding: 0,
              border: 'none',
              height: 'auto'
            }}
            theme="music dao"
          />
          <Box
            onClick={() => {}}
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{ cursor: 'pointer' }}
          >
            <SearchIcon color={Color.MusicDAODark} />
          </Box>
        </div> */}
        {fixSearch?.length > 0 ? (
          <SearchedPage search={fixSearch} />
        ) : (
          <RecentSearchesPage />
        )}
      </div>
    </div>
  );
}

export const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  400: 1,
  570: 2,
  700: 3,
  800: 4,
  1200: 5,
  1440: 6
};
