import React from 'react';
type ContextType = {
  fixSearch: string;
  setFixSearch: (state: string) => void;
  songsList: any[] | [];
  setSongsList: (state: any[] | []) => void;
  setQRCodeValue: (value: string) => void;
  qrCodeValue: string;
  setShowQRCodeDownload: (state: boolean) => void;
  showQRCodeDownload: boolean;
  setCopyLink: (link: string) => void;
};

const MusicContext: React.Context<ContextType> =
  React.createContext<ContextType>({
    fixSearch: '',
    setFixSearch: () => {},
    songsList: [],
    setSongsList: () => {},
    setQRCodeValue: () => {},
    qrCodeValue: '',
    setShowQRCodeDownload: () => {},
    showQRCodeDownload: false,
    setCopyLink: () => {}
  });

export default MusicContext;
