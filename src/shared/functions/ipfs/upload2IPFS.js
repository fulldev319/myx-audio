import { createFFmpeg } from '@ffmpeg/ffmpeg';
import { readFile as readMyFile } from 'shared/functions/ipfs/crypto';
import { uploadKeyFiles } from 'shared/functions/ipfs/post';
import MyIPFS from './useIPFS';
import useIPFS from 'shared/utils-IPFS/useIPFS';
import getIPFSURL from 'shared/functions/getIPFSURL';
import { wbEncrypt } from 'shared/functions/ipfs/aes_lib/index.js';
import { useAlertMessage } from 'shared/hooks/useAlertMessage';
import { getDeCompressedPublicKey } from 'shared/functions/publicKeyConverter';

const { uploadMultipleFiles, setMultiAddr, uploadContent, upload } = MyIPFS;
const multiAddr = getIPFSURL();
setMultiAddr(multiAddr);
// server public key
const publicKey = Buffer.from(
  getDeCompressedPublicKey(
    process.env.HEX_COMPRESSED_KEY ??
      '032e8ed312d1fe642ab7b375496190d8b9ab188c6165ebf04c1b39befd19049f69'
  ),
  'hex'
);
let keyCreationStop = true;

export const initFFmpeg = async (file) => {
  try {
    const ffmpeg = createFFmpeg({
      log: false,
      corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core/dist/ffmpeg-core.js'
    });
    await ffmpeg.load();
    //console.log("ffmpeg-core loaded.");
    const { name } = file;
    let blob = await readMyFile(file);
    //console.log("blob downloaded");
    ffmpeg.FS('writeFile', name, new Uint8Array(blob));
    return { ffmpeg, name };
  } catch (err) {
    console.error('initFFmpeg', err);
    throw err;
  }
};

export const getFileDuration = async (file) => {
  return new Promise((resolve, reject) => {
    var video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      var duration = video.duration;
      resolve(duration);
    };

    video.src = window.URL.createObjectURL(file);
  });
};

const sleep = (duration) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('done');
    }, duration);
  });
};

const keyCreation = async (duration, ffmpeg) => {
  return new Promise(async (resolve, reject) => {
    // const baseURL = window.location.href;
    const segLength = 3;
    const baseURL = '';

    let mxCount = Math.ceil(duration / segLength) + 5;
    for (let i = 2; (i < mxCount) || !keyCreationStop; ++i) {
      let content = '';
      const key = window.crypto.getRandomValues(new Uint8Array(16));
      ffmpeg.FS('writeFile', `enc${i}.key`, key);
      content += `${baseURL}enc${i}.key\r\n`;
      content += `enc${i}.key\r\n`;
      content += [...crypto.getRandomValues(new Uint8Array(16))]
        .map((m) => ('0' + m.toString(16)).slice(-2))
        .join('');
      content += '\r\n';
      var enc = new TextEncoder(); // always utf-8
      const unit8Content = enc.encode(content);
      ffmpeg.FS('writeFile', 'enc.keyinfo', unit8Content);
      await sleep(segLength * 100);
    }
    resolve('success');
  });
};

export const addStreamingAudio2IPFS = async (file, setIsUpload) => {
  setIsUpload(2);
  let ffmpeg, name, duration;
  try {
    // get ffmpeg
    const result = await initFFmpeg(file);
    ffmpeg = result.ffmpeg;
    name = result.name;

    // KeyCreation
    duration = await getFileDuration(file);
    keyCreationStop = false;
    keyCreation(duration, ffmpeg);

    // run audio command
    const audioCommand = `-strftime 1 -strftime_mkdir 1 -preset ultrafast -c:a aac -b:a 128K -vn -hls_time 15 -hls_list_size 0 -f hls -hls_key_info_file enc.keyinfo -hls_flags second_level_segment_index+periodic_rekey -hls_segment_filename files/file-%Y%md%d-%%4d.ts master.m3u8`;
    const animationCommand = `-ss 30 -to 37 -preset ultrafast -c:a libmp3lame -v 0`;
    const animationFileName = `sample.mp3`;
    try {
      // audio final command
      await ffmpeg.run('-i', name, ...audioCommand.split(' '));
      await ffmpeg.run(
        '-i',
        name,
        ...animationCommand.split(' '),
        animationFileName
      );
      //console.log("ffmpeg result dir-", ffmpeg.FS("readdir", "/"));
    } catch (err) {
      console.error('ffmpeg command run', err);
      throw err;
    } finally {
      keyCreationStop = true;
    }
    // upload files
    const { playListCID, chunksCID, animationCID } = await uploadSeparate(
      ffmpeg
    );
    console.log({
      animationCID,
      animationURL: `${getURLfromCID(animationCID)}/${animationFileName}`
    });

    return {
      playListURL: playListCID,
      chunksCID,
      animationURL: `${getURLfromCID(animationCID)}/${animationFileName}`
    };
  } catch (err) {
    console.error('addStreamingAudio2IPFS', err);
    setIsUpload(3);
    throw err;
  }
};

const uploadSeparate = async (ffmpeg) => {
  const fileExists = (fileName) => ffmpeg.FS('readdir', '/').includes(fileName);
  const readFile = (fileName) => ffmpeg.FS('readFile', fileName);

  const streamKeyFiles = () => {
    const result = {};
    let buffer, index;
    if (fileExists(`enc.keyinfo`)) {
      buffer = readFile(`/enc.keyinfo`);
      result['enc_keyinfo'] = Array.from(buffer);
    }
    index = 2;
    while (fileExists(`enc${index}.key`)) {
      buffer = readFile(`enc${index}.key`);
      result[`enc${index}_key`] = Array.from(buffer);
      index++;
    }
    return result;
  };

  async function* streamFiles() {
    let index = 2,
      buffer;
    const filesList = ffmpeg.FS('readdir', 'files/');
    const len = filesList.length;

    while (index < len) {
      const fileName = filesList[index];
      buffer = readFile(`files/${fileName}`);
      yield {
        path: `/files/${fileName}`,
        content: [buffer]
      };
      index++;
    }
  }

  const uploadPlayList = async (chunksFolderCID, keysFolderCID) => {
    if (fileExists(`master.m3u8`)) {
      let utf8decoder = new TextDecoder();
      const buffer = readFile(`/master.m3u8`);

      let masterContent = utf8decoder.decode(buffer);
      const patt = /:\d{4}/i;
      let apiAddr = multiAddr.replace(patt, ':8080');
      const chunkPrefixURL = `${apiAddr}/ipfs/${chunksFolderCID}`;
      const keyPrefixURL = `${apiAddr}/ipfs/${keysFolderCID}`;
      masterContent = masterContent.replaceAll(
        `URI="`,
        `URI="${keyPrefixURL}/`
      );
      masterContent = masterContent.replaceAll(
        `files/`,
        `${chunkPrefixURL}/files/`
      );

      var enc = new TextEncoder(); // always utf-8
      const unit8Content = enc.encode(masterContent);

      const playListCID = await uploadContent(
        {
          path: `/master.m3u8`,
          content: [unit8Content]
        },
        unit8Content.length
      );
      return { added: playListCID };
    }
  };

  const uploadAnmiationFile = async (outputFileName) => {
    let buffer, animation_cid;
    try {
      buffer = readFile(`/${outputFileName}`);
    } catch (error) {
      console.error('uploadAnmiationFile-readFile', error);
    }
    // upload output image to ipfs
    try {
      const animationFile = await uploadContent(
        {
          path: `/${outputFileName}`,
          content: [buffer]
        },
        buffer.length
      );
      animation_cid = animationFile.cid.toString();
    } catch (err) {
      console.error('uploadAnmiationFile-upload', err);
    }
    return animation_cid;
  };

  let res, folderCID, chunksCID, keyFilesCID, data;
  try {
    data = streamKeyFiles();
    res = await uploadMultipleFiles(streamFiles);
    folderCID = res.folderCID.toString();
    chunksCID = res.files.map((file) => file.CID);
    keyFilesCID = await uploadKeyFilesToIPFS(data);
    //console.log({ keyFilesCID });
  } catch (err) {
    console.error('uploadSeparate', err);
    throw err;
  }

  const playListCID = await uploadPlayList(folderCID, keyFilesCID);
  const animationCID = await uploadAnmiationFile('sample.mp3');
  await uploadKeyFiles(data, playListCID?.added.cid.toString());

  if (!playListCID || !chunksCID || !keyFilesCID || !animationCID) {
    throw { message: 'Uploading Files to IPFS was failed' };
  }

  return {
    playListCID,
    chunksCID,
    keyFilesCID,
    animationCID
  };
};

export const uploadKeyFilesToIPFS = async (data) => {
  async function* streamEncryptedKeyFiles() {
    const keyFileNames = Object.keys(data);

    for (let keyFileName of keyFileNames) {
      yield new Promise(async (resolve, reject) => {
        const encryptedData = await wbEncrypt(data[keyFileName], publicKey);
        keyFileName = keyFileName.replace('_key', '.key');
        resolve({
          path: `/${keyFileName}`,
          content: [encryptedData]
        });
      });
    }
  }

  const res = await uploadMultipleFiles(streamEncryptedKeyFiles);
  const cid = res.folderCID.toString();
  return cid;
};

export const uploadNFTMetaData = async (obj) => {
  const doc = JSON.stringify(obj);
  const result = await upload(doc);
  const cid = result.cid.toString();
  return { uri: getURLfromCID(cid), cid };
};

export const getURLfromCID = (cid) => {
  const patt = /:\d{4}/i;
  const host = multiAddr.replace(patt, ':8080');
  return `${host}/ipfs/${cid}`;
};

export const useStreamingIPFS = () => {
  const { setShowUploadingModal, setIsUpload } = useIPFS();
  const { showAlertMessage } = useAlertMessage();
  const addStreamingMedia2IPFS = async (file) => {
    let result;
    setShowUploadingModal(true);
    try {
      result = await addStreamingAudio2IPFS(file, setIsUpload);
      //setShowUploadingModal(false);
      return result;
    } catch (err) {
      console.error('useStreamingIPFS', err);
      showAlertMessage(
        'Encryption & Uploading the audio file is failed, Please try again!'
      );
      setShowUploadingModal(false);
      throw err;
    }
  };
  return { addStreamingMedia2IPFS };
};

export const getWaveFormImageFile = async (file, output = 'output.png') => {
  let ffmpeg, name, url, buffer;
  const fileExists = (fileName) => ffmpeg.FS('readdir', '/').includes(fileName);
  const readFile = (fileName) => ffmpeg.FS('readFile', fileName);
  // initFFmpeg
  try {
    const result = await initFFmpeg(file);
    ffmpeg = result.ffmpeg;
    name = result.name;
    const command = `-filter_complex aformat=channel_layouts=mono,showwavespic=s=640x120 -frames:v 1 ${output}`;
    await ffmpeg.run('-i', name, ...command.split(' '));
  } catch (error) {
    console.error('getImageFile-initFFmpeg', error);
  }

  // get Buffer
  try {
    if (!fileExists(output)) {
      throw { msg: `getImageFile-ffmpeg not such file ${output}` };
    }
    buffer = readFile(`/${output}`);
  } catch (error) {
    console.error('getImageFile-readFile', error);
    buffer = 0;
  }
  // upload output image to ipfs
  try {
    const image = await uploadContent(
      {
        path: `/${output}`,
        content: [buffer]
      },
      buffer.length
    );
    const imageCID = image.cid.toString();
    if (!imageCID) {
      throw { msg: 'getImageFile-upload2IPFS file upload failed' };
    }
    url = `${getURLfromCID(imageCID)}/${output}`;
  } catch (error) {
    console.error('getImageFile-upload2IPFS', error);
  }
  return url;
};

export const getWaveData = async (file, outputFile = 'data.out') => {
  let ffmpeg, name, url, buffer;

  const fileExists = (fileName) => ffmpeg.FS('readdir', '/').includes(fileName);
  const readFile = (fileName) => ffmpeg.FS('readFile', fileName);
  // initFFmpeg
  try {
    const result = await initFFmpeg(file);
    ffmpeg = result.ffmpeg;
    name = result.name;
    const command = `-ac 1 -filter:a aresample=11000 -map 0:a -c:a pcm_s16le -f data`;
    await ffmpeg.run('-i', name, ...command.split(' '), outputFile);
  } catch (error) {
    console.error('getImageFile-initFFmpeg', error);
    buffer = 0;
  }

  // get Buffer
  try {
    if (!fileExists(outputFile)) {
      throw { msg: `getImageFile-ffmpeg not such file ${outputFile}` };
    }
    buffer = readFile(`/${outputFile}`);
  } catch (error) {
    console.error('getImageFile-readFile', error);
    buffer = 0;
  }

  const result = new Uint8Array(buffer);
  return result;
};

export const convert = (byteA, byteB) => {
  const sign = byteA & (1 << 7);
  const x = ((byteA & 0xff) << 8) | (byteB & 0xff);
  let result = x;
  if (sign) {
    result = 0xffff0000 | x; // fill in most significant bits with 1's
  }
  return result;
};

export const normalize = (data) => {
  const length = data.length;
  const countOfChunks = 200;
  const countPerChunk = Math.floor(length / countOfChunks);
  const maximumValue = 200;
  // balance
  let result = new Array(countOfChunks).fill(0);
  for (let i = 0, sum = 0; i < length; ++i) {
    sum += Math.abs(data[i]);
    if ((i + 1) % countPerChunk === 0) {
      result[Math.floor(i / countPerChunk)] = Math.floor(
        (1.0 * sum) / countPerChunk
      );
      sum = 0;
    }
  }

  const peaks = result.map((point) => Math.abs(point));
  // const peaks = data.filter(point => point >= 0);
  const ratio = Math.max(...peaks) / maximumValue;
  const normalized = peaks.map((point) => Math.round(point / ratio));
  return normalized;
};

export const getIntArray = (buffer) => {
  const newLen = buffer.length / 2;
  let result = new Array(newLen);
  for (let i = 0; i < buffer.length; i += 2) {
    const byteA = buffer[i];
    const byteB = buffer[i + 1];
    const val = convert(byteB, byteA);
    result[i / 2] = val;
  }
  return result;
};

export const getNormalizedData = (buffer) => {
  const signedArray = getIntArray(buffer);
  const result = normalize(signedArray);
  return result;
};

export const getWaveDataURL = async (file) => {
  const outputFile = `data.out`;
  const data = await getWaveData(file, outputFile);
  const result = getNormalizedData(data);
  const dataAdded = await uploadContent(
    {
      path: `/${outputFile}`,
      content: [Buffer.from(result)]
    },
    result.length
  );
  const dataCID = dataAdded?.cid?.toString();
  const url = `${getURLfromCID(dataCID)}/${outputFile}`;
  return url;
};

// Don't erase!!!

// const uploadAll = async ffmpeg => {
//   const fileExists = fileName => ffmpeg.FS("readdir", "/").includes(fileName);
//   const readFile = fileName => ffmpeg.FS("readFile", fileName);

//   async function* streamAllFiles() {
//     let index = 0,
//       buffer;

//     // video chunks
//     const filesList = ffmpeg.FS("readdir", "files/");
//     index = 2;
//     const len = filesList.length;
//     while (index < len) {
//       const fileName = filesList[index];
//       buffer = readFile(`/${fileName}`);
//       //console.log("ffmpeg readFile buffer", buffer);
//       yield {
//         path: `/${fileName}`,
//         content: [buffer],
//       };
//       index++;
//     }

//     // key files
//     // if (fileExists(`enc.keyinfo`)) {
//     //   buffer = readFile(`/enc.keyinfo`);
//     //   yield {
//     //     path: `/enc.keyinfo`,
//     //     content: [buffer],
//     //   };
//     // }
//     // index = 2;
//     // while (fileExists(`enc${index}.key`)) {
//     //   buffer = readFile(`enc${index}.key`);
//     //   //console.log("ffmpeg readFile buffer", buffer);
//     //   yield {
//     //     path: `/enc${index}.key`,
//     //     content: [buffer],
//     //   };
//     //   index++;
//     // }
//   }

//   const uploadPlayList = async folderCID => {
//     if (fileExists(`master.m3u8`)) {
//       let utf8decoder = new TextDecoder();
//       const buffer = readFile(`/master.m3u8`);
//       let masterContent = utf8decoder.decode(buffer);
//       const patt = /:\d{4}/i;
//       let apiAddr = multiAddr.replace(patt, ":8080");
//       // const prefixURL = `${apiAddr}/ipfs/${folderCID}/`;
//       // masterContent = (masterContent as any).replaceAll(`URI="`, `URI="${prefixURL}`);
//       // masterContent = (masterContent as any).replaceAll(`files/`, `${prefixURL}files/`);
//       var enc = new TextEncoder(); // always utf-8
//       const unit8Content = enc.encode(masterContent);
//       const playListCID = await uploadContent(
//         {
//           path: `/master.m3u8`,
//           content: [unit8Content],
//         },
//         unit8Content.length
//       );
//       return playListCID.cid.toString();
//     }
//   };

//   let res;
//   try {
//     res = await uploadMultipleFiles(streamAllFiles);
//   } catch (error) {
//     //console.log("error", error);
//   }

//   const folderCID = res.folderCID.toString();
//   const playListCID = await uploadPlayList(folderCID);
//   const patt = /:\d{4}/i;
//   let apiAddr = multiAddr.replace(patt, ":8080");
//   const resultURL = `${apiAddr}/ipfs/${playListCID}/master.m3u8`;
//   return resultURL;
// };

// audio command
// const rate = '128K', length = 10;
// const command = `-i ${name} -c aac -b:a 196K -f hls -hls_playlist_type vod -start_number 0 -hls_time 15 -hls_list_size 0 master.m3u8`;

// video final command
// const videoCommand = `-strftime 1 -strftime_mkdir 1 -c:v libx264 -crf 21 -preset ultrafast -c:a aac -b:a 128K -ac 2 -hls_time 1 -hls_list_size 0 -f hls -hls_key_info_file enc.keyinfo -hls_flags second_level_segment_index+periodic_rekey -hls_segment_filename files/file-%Y%m%d-%%4d.ts master.m3u8`;

// No need to erase, play using hls.js
// const video = document.getElementById("ipfs-test-video") as HTMLMediaElement;
// const hls = new Hls({
//   pLoader: pLoader,
//   fLoader: fLoader,
// } as HlsConfig);
// hls.loadSource(playListURL);
// //console.log({ playListURL });
// if (video) {
//   hls.attachMedia(video);
//   hls.on(Hls.Events.MANIFEST_PARSED, () => {
//     var playPromise = video.play();
//     if (playPromise !== undefined) {
//       playPromise.then(_ => {
//         // Automatic playback started!
//         // Show playing UI.
//         //console.log('Playing')
//       })
//         .catch(error => {
//           // Auto-play was prevented
//           // Show paused UI.
//           //console.log('Paused');
//         });
//     }
//   });
// }

// getURL
// const patt = /:\d{4}/i;
// let apiAddr = multiAddr.replace(patt, ":8080");
// const resultURL = `${apiAddr}/ipfs/${playListCID}/master.m3u8`;
//console.log({ resultURL });

// const patt = /:\d{4}/i;
// let apiAddr = multiAddr.replace(patt, ":8080");
// const resultURL = `${apiAddr}/ipfs/${cid}/master.m3u8`;
// return resultURL;
