import ecies from 'ecies-parity';
import Resizer from 'react-image-file-resizer';

import TimeLogger from '../utils-IPFS/TimeLogger';
import {
  uploadMetaDataPrivate,
  uploadMetaDataPublic
} from '../utils-IPFS/post';
import { generateMusicWallet } from './generateMusicWallet';

export const onUploadEncrypt = async (
  file,
  address,
  mnemonic,
  uploadWithEncryption,
  peerNumber
) => {
  // console.log("----------Upload Start----------");
  const processFile = new File(
    [file],
    file.name?.replace(/[^a-zA-Z0-9.]/g, ''),
    { type: file.type }
  );
  TimeLogger.start('Upload(Encryption + IPFS)');
  const { added, newFile, keyData } = await uploadWithEncryption(processFile);
  TimeLogger.end('Upload(Encryption + IPFS)');

  const k = keyData.k;
  TimeLogger.start('ECIES_Encryption');
  const wallet = await generateMusicWallet(mnemonic);
  keyData.k = await getEncryptedKey(wallet.publicKey, k);
  TimeLogger.end('ECIES_Encryption');

  TimeLogger.start('Upload MetaData');
  const keyPair = {};
  keyPair[address] = keyData.k;
  const newMetaDataID = await uploadMetaDataPrivate(
    added,
    keyPair,
    newFile,
    processFile,
    peerNumber
  );
  TimeLogger.end('Upload MetaData');

  /*TimeLogger.start("add file to HLF");
  const metaHLF = await addFile("createFile", added, newFile, file, keyPair, address, "private");
  TimeLogger.end("add file to HLF");*/

  // console.log("----------Upload End----------");
  TimeLogger.log();

  return newMetaDataID;
};

const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      1024,
      768,
      'WEBP',
      50,
      0,
      (uri) => {
        resolve(uri);
      },
      'file'
    );
  });

export const onUploadNonEncrypt = async (
  file,
  uploadWithNonEncryption,
  isCompress = true
) => {
  return new Promise(async (resolve, reject) => {
    let processFile = new File(
      [file],
      file.name?.replace(/[^a-zA-Z0-9.]/g, ''),
      { type: file.type }
    );
    if (
      isCompress &&
      file?.type?.includes('image') &&
      !file?.type?.includes('gif')
    ) {
      try {
        processFile = await resizeFile(processFile);
      } catch (err) {
        console.log('While resizing image, ', err);
      }
    }
    TimeLogger.start('Upload IPFS');
    const { added } = await uploadWithNonEncryption(processFile);
    TimeLogger.end('Upload IPFS');

    TimeLogger.start('Upload MetaData');
    const newMetaDataID = await uploadMetaDataPublic(added, processFile);
    TimeLogger.end('Upload MetaData');
    TimeLogger.log();

    resolve(newMetaDataID);
  });
};

export const onUploadStreamingMedia = async (file, uploadWithNonEncryption) => {
  return new Promise(async (resolve, reject) => {
    // console.log("----------Upload Start----------");

    TimeLogger.start('Upload IPFS');
    try {
      const processFile = new File(
        [file],
        file.name?.replace(/[^a-zA-Z0-9.]/g, ''),
        { type: file.type }
      );
      const {
        playListURL,
        chunksCID,
        animationURL
      } = await uploadWithNonEncryption(processFile);
      TimeLogger.end('Upload IPFS');

      console.log("added 1", playListURL.added);

      TimeLogger.start('Upload MetaData');
      const metadata = await uploadMetaDataPublic(
        playListURL.added,
        processFile
      );
      TimeLogger.end('Upload MetaData');

      /*TimeLogger.start("add file to HLF");
      const metaHLF = await addFile("createFile", added, {}, file, {}, address, "public");
      TimeLogger.end("add file to HLF");*/

      console.log("----------Upload End----------");
      TimeLogger.log();

      resolve({ metadata, chunksCID, animationURL });
    } catch (err) {
      console.error('onUploadStreamingMedia', err);
      reject(err);
    }
  });
};

const getEncryptedKey = async (pubKey, encryptKey, isAddNewPubKey = false) => {
  /*if (useMetaMask) {
    if (isAddNewPubKey) return await encrypt(encryptKey, pubKey);
    return await encrypt(encryptKey);
  }*/
  return (
    await eciesEncrypt(Buffer.from(pubKey, 'base64'), encryptKey)
  ).toString('base64');
};

const eciesEncrypt = async (publicKeyA, text) => {
  const encrypted = await ecies.encrypt(publicKeyA, Buffer.from(text));
  return encrypted;
};
