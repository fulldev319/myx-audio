import { makeStyles } from '@material-ui/core/styles';

export const distributionStyles = makeStyles((theme) => ({
  title: {
    fontWeight: 800,
    fontSize: 22,
    lineHeight: '150%',
    color: '#2D3047',
    textAlign: 'center'
  },
  leftSection: {
    background: 'rgba(255, 255, 255, 0.6)',
    border: '1px solid #C6C6C6',
    borderRadius: 16,
    padding: 16
  },
  rightSection: {
    background: '#E4F4FF',
    border: '1px solid #92CAFF',
    borderRadius: 16,
    padding: 16,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  totalRise: {
    fontWeight: 600,
    fontSize: 16,
    lineHeight: '104.5%',
    textAlign: 'center',
    color: '#2D3047',
    opacity: 0.9
  },
  totalValue: {
    fontWeight: 800,
    fontSize: 20,
    lineHeight: '120%',
    textAlign: 'center',
    color: '#2D3047'
  }
}));
