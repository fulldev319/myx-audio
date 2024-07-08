import { createContext } from 'react';

type MaintainenceContextType = {
  isOnMaintenance: boolean;
  setIsOnMaintenance: (val: boolean) => void;
};

const MaintainenceContext = createContext<MaintainenceContextType>({
  isOnMaintenance: false,
  setIsOnMaintenance: (val: boolean) => {}
});

export default MaintainenceContext;
