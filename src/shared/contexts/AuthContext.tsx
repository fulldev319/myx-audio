import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react';
import Cookies from 'js-cookie';
type AuthContextType = {
  isSignedin: boolean;
  setSignedin: (val: boolean) => void;
  accountStatus: string;
  updateAccountStatus: (val: string) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider: React.FunctionComponent = ({ children }) => {
  const [isSignedin, setIsSignedin] = useState<boolean>(false);
  const [accountStatus, setAccountStatus] = useState<string>('');

  const setSignedin = (val: boolean) => {
    setIsSignedin(val);
  };

  const updateAccountStatus = (status: string) => {
    setAccountStatus(status);
  };

  useEffect(() => {
    setIsSignedin(!!Cookies.get('accessToken'));
  }, []);

  const context = {
    isSignedin,
    setSignedin,
    accountStatus,
    updateAccountStatus
  };

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth hook must be used inside AuthContextProvider');
  }
  return context;
};
