import { makeStyles } from '@material-ui/core/styles';
import { Color } from 'shared/ui-kit';

export const useTrackCarouSelBoxStyles = makeStyles((theme) => ({
  divider: {
    width: '100%',
    height: 1,
    background: 'rgba(84, 101, 143, 0.3)'
  },
  stampImg: {
    position: 'absolute',
    right: -80,
    top: '50%',
    transform: 'translate(0, -60%)',
    width: 200
  }
}));
