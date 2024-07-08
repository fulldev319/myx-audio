import React, {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState
} from 'react';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import FileUploadingModal from 'components/MusicDao/modals/FileUploadingModal';
import { encryptFile, decryptContent, getBlob } from 'shared/utils-IPFS/crypto';
import TimeLogger from 'shared/utils-IPFS/TimeLogger';
import { sizeToString } from 'shared/utils-IPFS/functions';
import getIPFSURL, { getIPFSFileURL } from 'shared/functions/getIPFSURL';

export const IPFSContext = createContext(null);

export const IPFSContextProvider = ({ children }) => {
  const [ipfs, setIpfs] = useState({});
  const [isConnected, setConnected] = useState(false);
  const [multiAddr, setMultiAddr] = useState(getIPFSURL());
  const [cookies] = useCookies(['accessToken']);
  const token = cookies.accessToken ?? '';
  const [showUploadingModal, setShowUploadingModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUpload, setIsUpload] = useState(true);

  const isIPFSAvailable = useMemo(
    () => ipfs && Object.keys(ipfs).length !== 0 && isConnected,
    [ipfs, isConnected]
  );

  useEffect(() => {
    if (!multiAddr) return;
    let configuration = { url: multiAddr };
    if(token) configuration.headers = { Authorization: 'Bearer ' + token };
    const ipfsInstance = ipfsHttpClient({ ...configuration });
    setIpfs(ipfsInstance);
    setConnected(true);
  }, [multiAddr, token]);

  const getFiles = async (fileCID) => {
    if (ipfs && Object.keys(ipfs).length !== 0) {
      const files = [];
      for await (let file of ipfs.ls(fileCID)) {
        files.push(file);
      }
      return files;
    } else {
      return [];
    }
  };

  const uploadWithFileName = async (newFile, animation = true) => {
    if (newFile && newFile.name) {
      setIsUpload(true);
      setShowUploadingModal(animation);
      const fileDetails = {
        path: newFile.name,
        content: newFile
      };

      console.log('File size to Upload', sizeToString(newFile.size));
      const options = {
        wrapWithDirectory: true,
        progress: (prog) => {
          const value = ((100.0 * prog) / newFile.size).toFixed(0);
          setProgress(value);
          console.log(`IPFS Upload: ${value}%`);
        }
      };

      try {
        const added = await ipfs.add(fileDetails, options);
        console.log('The File is Uploaded Successfully to IPFS');
        setShowUploadingModal(false);
        setProgress(0);
        return added;
      } catch (err) {
        setShowUploadingModal(false);
        setProgress(0);
        console.error(err);
      }
    }
  };

  const uploadWithEncryption = async (file) => {
    TimeLogger.start('Encryption');
    const { resultBytes: encryptedBytes, keyData } = await encryptFile(file);
    TimeLogger.end('Encryption');
    const newFile = new File([encryptedBytes], file.name + '.enc');
    let added = await uploadFile(newFile);
    return { added, newFile, keyData };
  };

  const uploadWithNonEncryption = async (file, animation = true) => {
    let added = await uploadFile(file, animation);
    return { added };
  };

  const uploadFile = async (file, animation = true) => {
    return new Promise(async (resolve, reject) => {
      TimeLogger.start('Upload2IPFS');
      const added = await uploadWithFileName(file, animation);
      TimeLogger.end('Upload2IPFS');
      resolve(added);
    });
  };

  const downloadWithDecryption = async (
    fileCID,
    fileName,
    isEncrypted = false,
    keyData,
    download,
    peerNumber
  ) => {
    const file = `${getIPFSFileURL()}/ipfs/${fileCID}/${fileName}.enc`;

    const response = await axios.get(file, {
      responseType: 'arraybuffer',
      transformRequest: (data, headers) => {
        delete headers.common['Authorization'];
        return data;
      }
    });
    const buffer = Buffer.from(response.data, 'utf-8');

    let content = buffer;

    if (isEncrypted) {
      TimeLogger.start('Decryption');
      content = await decryptContent(content, keyData);
      TimeLogger.end('Decryption');
      fileName = fileName?.replace('.enc', '');
    }
    const blob = getBlob(content);

    if (download) {
      saveAs(blob, fileName);
    } else {
      return { blob, content };
    }
  };

  const downloadWithNonDecryption = async (fileCID, fileName, download) => {
    const file = `${getIPFSFileURL()}/ipfs/${fileCID}/${fileName}`;

    const response = await axios.get(file, {
      responseType: 'arraybuffer',
      transformRequest: (data, headers) => {
        delete headers.common['Authorization'];

        return data;
      }
    });
    const buffer = Buffer.from(response.data, 'utf-8');
    const blob = getBlob(buffer);
    if (download) {
      saveAs(blob, fileName);
    } else {
      return { blob, buffer };
    }
  };

  const upload = async (file) => {
    try {
      setIsUpload(true);
      setShowUploadingModal(true);
      const added = await ipfs.add(file, {
        progress: (prog) => {
          const value = ((100.0 * prog) / file.size).toFixed(0);
          setProgress(value);
          console.log(`IPFS Upload: ${value}%`);
        },
        pin: false
      });
      console.log('IPFS Upload: 100%');
      setShowUploadingModal(false);
      setProgress(0);
      return added;
    } catch (err) {
      console.error(err);
      setShowUploadingModal(false);
      setProgress(0);
    }
  };

  const context = {
    ipfs,
    setMultiAddr,
    isConnected,
    isIPFSAvailable,
    getFiles,
    uploadWithFileName,
    upload,
    uploadWithEncryption,
    uploadWithNonEncryption,
    downloadWithDecryption,
    downloadWithNonDecryption,
    setProgress,
    setShowUploadingModal,
    setIsUpload
  };

  return (
    <IPFSContext.Provider value={context}>
      {children}
      {showUploadingModal && (
        <FileUploadingModal
          open={showUploadingModal}
          progress={progress}
          isUpload={isUpload}
        />
      )}
    </IPFSContext.Provider>
  );
};

export const useContextIPFS = () => {
  const context = useContext(IPFSContext);
  if (!context) {
    throw new Error(
      'useContextIPFS hook must be used inside IPFSContextProvider'
    );
  }

  return context;
};
