import create from 'zustand';
import { create as CreateOrbitDB } from './creator';

const store = create(() => ({
  db: await CreateOrbitDB()
}));

export function useOrbitDB() {
  return store().db;
}

export async function setOrbitDB() {
  const newDB = await CreateOrbitDB();
  store.setState({ db: newDB });
}
