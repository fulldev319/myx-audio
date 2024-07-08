import axios from 'axios';
import IPFSBackend from '../getIPFSBackendURL';
import { create as CreateOrbitDB } from './creator';
const BackendURL = IPFSBackend();

class OrbitDBClass {
  static db;
  static async setOrbitDB() {
    if (!this.db) {
      this.db = await CreateOrbitDB();
      const dbName = this.db.id;
      try {
        const userId = localStorage.getItem('userId');
        const URL = `${BackendURL}/orbit/addDatabase/${userId}/${encodeURIComponent(
          dbName
        )}`;
        console.log('URL', URL);
        await axios.post(URL);
        console.log('setOrbitDB');
      } catch (error) {
        console.error('setOrbitDB', error);
      }
    }
    return this.db;
  }
}

export default OrbitDBClass;
