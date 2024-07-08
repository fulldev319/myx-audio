const getIPFSURL = () => {
  return process.env.IPFS_API_URL ?? 'https://elb.ipfs.myx.audio:8000';
};

export const getIPFSFileURL = () => {
  return process.env.IPFS_FILE_URL ?? 'https://elb.ipfs.myx.audio:8080';
};

export default getIPFSURL;
