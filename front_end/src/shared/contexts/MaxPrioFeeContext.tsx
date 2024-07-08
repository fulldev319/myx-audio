import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect
} from 'react';
import axios from 'axios';
import URL from 'shared/functions/getURL';

type MaxPrioFeeContextType = {
  maxPrioFee: string;
};

const MaxPrioFeeContext = createContext<MaxPrioFeeContextType | null>(null);

export const MaxPrioFeeContextProvider: React.FunctionComponent = ({
  children
}) => {
  const [maxPrioFee, setMaxPrioFee] = useState<string>('50');

  useEffect(() => {
    axios.get(`${URL()}/web3/maxPrioFee`).then((res) => {
      const resp = res.data;

      if (resp.success) {
        setMaxPrioFee(resp.data.value);
      }
    });
  }, []);

  const context = useMemo<MaxPrioFeeContextType>(
    () => ({
      maxPrioFee
    }),
    [maxPrioFee]
  );

  return (
    <MaxPrioFeeContext.Provider value={context}>
      {children}
    </MaxPrioFeeContext.Provider>
  );
};

export const useMaxPrioFee = () => {
  const context = useContext(MaxPrioFeeContext);
  if (!context) {
    throw new Error(
      'useTokenConversion hook must be used inside TokenConversionContextProvider'
    );
  }
  return context;
};
