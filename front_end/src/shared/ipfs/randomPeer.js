import getIPFSURL from 'shared/functions/getIPFSURL';
const mapPeers = {
  1: getIPFSURL()
};

export const randomPeer = () => {
  const random = randomNumber(6);
  console.log(random);
  return {
    number: random,
    url: mapPeers[random]
  };
};

// random number form 1 to max
const randomNumber = (max) => {
  return Math.floor(Math.random() * max) + 1;
};
