import { useContext } from 'react';
import { IPFSContext } from 'shared/contexts/IPFSContext';
const useIPFS = () => {
  const context = useContext(IPFSContext);
  if (!context) {
    throw new Error(
      'useContextIPFS hook must be used inside IPFSContextProvider'
    );
  }

  return context;
};

export default useIPFS;
