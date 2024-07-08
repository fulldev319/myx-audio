import loadable from '@loadable/component';

// CONNECT (WAITLIST)
export const MusicDaoConnect = loadable(
  () => import('components/Connect/MusicDaoConnect')
);
export const MusicDao = loadable(() => import('components/MusicDao'));
