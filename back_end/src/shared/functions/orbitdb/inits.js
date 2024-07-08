import { create } from 'ipfs-http-client';
import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';
import getIPFSURL from '../getIPFSURL';
const IPFSURL = getIPFSURL();
// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

const ipfsOptions = {
  repo: './ipfs1',
  config: {
    Addresses: {
      Swarm: [
        '/ip4/0.0.0.0/tcp/4001',
        '/ip6/::/tcp/4001',
        '/ip4/0.0.0.0/udp/4001/quic',
        '/ip6/::/udp/4001/quic'
      ],
      API: 'http://127.0.0.1:5001',
      Gateway: '/ip4/127.0.0.1/tcp/9191'
    },
    EXPERIMENTAL: {
      pubsub: true
    },
    relay: {
      enabled: true,
      hop: {
        enabled: true
      }
    }
  }
};

// Do something with your db.
// Of course, you may want to wrap these in an async function.
export async function initDb(ipfs, repo) {
  if (repo) {
    return await OrbitDB.createInstance(ipfs, { repo: repo });
  }
  return await OrbitDB.createInstance(ipfs);
}

export async function initIPFS() {
  return create(IPFSURL);
}

export async function spawnIpfs(repo, port) {
  if (repo) {
    ipfsOptions.repo = repo;
  }
  if (port) {
    ipfsOptions.config.Addresses.Swarm = ['/ip4/0.0.0.0/tcp/' + port];
  }
  return IPFS.create(ipfsOptions);
}
