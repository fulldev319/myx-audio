import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const fruitPageStyles = makeStyles((theme) => ({
  pageTitle: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 32,
    lineHeight: '104.5%',
    color: '#2D3047'
  },
  tabButton: {
    display: 'flex',
    alignItems: 'center',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: '104.5%',
    textTransform: 'uppercase',
    padding: '12px 24px',
    borderRadius: '100vh',
    marginRight: 16,
    cursor: 'pointer'
  },
  title: {
    fontStyle: 'normal',
    fontWeight: 800,
    fontSize: 18,
    lineHeight: '104.5%',
    textTransform: 'uppercase',
    color: '#2D3047'
  },
  more: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: '104.5%',
    textTransform: 'uppercase',
    color: '#2D3047'
  }
}));
