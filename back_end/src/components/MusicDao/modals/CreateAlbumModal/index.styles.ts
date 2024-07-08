import makeStyles from '@material-ui/core/styles/makeStyles';

export const useCreateAlbumStyles = makeStyles((theme) => ({
  root: {},
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '130%',
    color: '#2D3047',
    textAlign: 'center'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#2D3047',
    opacity: 0.9,

    fontSize: '16px',
    fontWeight: 600
  },
  uploadBox: {
    background: '#F0F5F5',
    borderRadius: 8,
    padding: '40px'
  }
}));
