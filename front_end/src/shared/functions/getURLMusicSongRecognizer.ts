const URLTraxSongRecognizer = (): string => {
  if (process.env.NODE_ENV === 'development') {
    if (process.env.REACT_APP_ENV === 'dev_ssl') {
      // When executing [ REACT_APP_ENV='dev_ssl' npm start ]
      return 'http://localhost:3010';
    } else if (process.env.REACT_APP_ENV === 'dev') {
      // When executing [ REACT_APP_ENV='dev' npm start ]
      return (
        process.env.REACT_APP_FINGERPRINTER_URL ??
        'https://e91bfd-fingerprinter.myx.audio'
      );
    } else {
      // When executing [ npm start ]
      return (
        process.env.REACT_APP_FINGERPRINTER_URL ??
        'https://e91bfd-fingerprinter.myx.audio'
      );
    }
    // When executing [ npm build ]
  } else {
    return (
      process.env.REACT_APP_FINGERPRINTER_URL ??
      'https://fingerprinter.myx.audio'
    );
  }
};

export default URLTraxSongRecognizer;
