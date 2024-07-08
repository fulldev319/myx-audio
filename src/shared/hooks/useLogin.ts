import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
const useLogin = () => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(true);

  useEffect(() => {
    let token: string = Cookies.get('accessToken') || '';
    let userId: string = localStorage.getItem('userId') || '';

    if (
      !token ||
      token === '' ||
      token === 'undefined' ||
      !userId ||
      userId === '' ||
      userId === 'undefined'
    ) {
      setIsSignedIn(false);
    } else {
      setIsSignedIn(true);
    }
  });

  return isSignedIn;
};

export { useLogin };
