import React from 'react';
import './SearchInputBox.css';

export const SearchInputBox = ({
  keyword,
  setKeyword,
  placeholder = '',
  style = {}
}) => {
  return (
    <div className="search-inputbox">
      <input
        className="input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder={placeholder}
        style={{ ...style }}
      />
      <img src={require('assets/icons/search.svg')} className="icon" />
    </div>
  );
};
