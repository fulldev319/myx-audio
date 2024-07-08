const URLTraxMicroservice = (): string => {
  if (process.env.NODE_ENV === 'development') {
    if (process.env.REACT_APP_ENV === 'dev_ssl') {
      // When executing [ REACT_APP_ENV='dev_ssl' npm start ]
      return 'https://localhost:3010';
    } else if (process.env.REACT_APP_ENV === 'dev') {
      // When executing [ REACT_APP_ENV='dev' npm start ]
      return 'http://localhost:3010';
    } else {
      // When executing [ npm start ]
      return (
        process.env.REACT_APP_MICROSERVICE_URL ??
        'https://e91bfd-microservice.myx.audio'
      );
    }
    // When executing [ npm build ]
  } else {
    return (
      process.env.REACT_APP_MICROSERVICE_URL ?? 'https://microservice.myx.audio'
    );
  }
};

export default URLTraxMicroservice;
