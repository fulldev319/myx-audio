import React from 'react';
import { useSelector } from 'react-redux';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import { RootState } from 'store/reducers/Reducer';
import Box from 'shared/ui-kit/Box';
import { Color, SignatureRequestModal } from 'shared/ui-kit';

const useStyles = makeStyles((theme) => ({
  container: {
    background: (p: any) =>
      p.theme === 'music dao' ? Color.MusicDAODeepGreen : 'rgba(0, 0, 0, 0.16)',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    borderRadius: '50%',
    cursor: 'pointer'
  },
  contentContainer: {
    background: 'rgba(0, 0, 0, 0.7)',
    borderRadius: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`
  },
  contentBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    background: '#7F6FFFaa',
    borderTopLeftRadius: theme.spacing(2),
    borderTopRightRadius: theme.spacing(2),
    position: 'absolute',
    left: 0,
    top: 0
  },
  itemContainer: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    fontSize: '22px',
    fontWeight: 600,
    '& img': {
      width: '20px'
    }
  }
}));

export const FruitSelect = ({
  fruitObject,
  members = [] as any,
  onGiveFruit = undefined as any,
  parentNode = undefined as HTMLElement | undefined,
  style = {} as any,
  fruitWidth = 16,
  fruitHeight = 16,
  theme = ''
}) => {
  const classes = useStyles({ theme });
  const userSelector = useSelector((state: RootState) => state.user);

  const [appAnchorEl, setAppAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const appPopperOpen = Boolean(appAnchorEl);
  const [openSignRequestModal, setOpenSignRequestModal] =
    React.useState<boolean>(false);

  const [signRequestModalDetail, setSignRequestModalDetail] =
    React.useState<any>(null);
  const [amount, setAmount] = React.useState<any>(0);

  const [showChildInParent, setShowChildInParent] =
    React.useState<boolean>(false);

  const childRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (parentNode && childRef.current) {
      if (showChildInParent) {
        parentNode.appendChild(childRef.current);
      } else if (parentNode.querySelector('.' + childRef.current.className)) {
        parentNode.removeChild(childRef.current);
      }
    }
  }, [showChildInParent]);

  const handleFruit = (type, event) => {
    event.stopPropagation();
    event.preventDefault();
    if (onGiveFruit) {
      onGiveFruit(type);
    }
  };

  const handleSubmit = () => {};

  const getChildInParent = () => {
    return (
      <div
        className={classes.contentBox}
        style={{
          width: parentNode?.clientWidth || '100%',
          height: parentNode?.clientHeight || '100%'
        }}
        ref={childRef}
      >
        <Box
          className={classes.itemContainer}
          mb={2}
          onClick={(e) => handleFruit(1, e)}
        >
          <img src={require('assets/emojiIcons/watermelon.webp')} />
          <Box ml={1}>
            {fruitObject.fruits?.filter((fruit) => fruit.fruitId === 1)
              ?.length || 0}
          </Box>
        </Box>
        <Box
          className={classes.itemContainer}
          mb={2}
          onClick={(e) => handleFruit(2, e)}
        >
          <img src={require('assets/emojiIcons/avocado.webp')} />
          <Box ml={1}>
            {fruitObject.fruits?.filter((fruit) => fruit.fruitId === 2)
              ?.length || 0}
          </Box>
        </Box>
        <Box
          className={classes.itemContainer}
          onClick={(e) => handleFruit(3, e)}
        >
          <img src={require('assets/emojiIcons/orange.webp')} />
          <Box ml={1}>
            {fruitObject.fruits?.filter((fruit) => fruit.fruitId === 3)
              ?.length || 0}
          </Box>
        </Box>
      </div>
    );
  };

  return (
    <>
      <Box
        className={classes.container}
        onClick={(e) => {
          e.stopPropagation();
          if (parentNode) {
            setShowChildInParent((prev) => !prev);
          } else {
            setAppAnchorEl(e.currentTarget);
          }
        }}
        style={style}
      >
        <img
          src={require('assets/emojiIcons/fruits.webp')}
          width={fruitWidth}
          height={fruitHeight}
        />
      </Box>
      {parentNode && (
        <Box
          width="0px"
          height="0px"
          overflow="hidden"
          style={{ display: 'none' }}
        >
          {getChildInParent()}
        </Box>
      )}
      {!parentNode && (
        <Popper
          open={appPopperOpen}
          anchorEl={appAnchorEl}
          transition
          placement="top-end"
          style={{ zIndex: 9999, cursor: 'initial' }}
          // disablePortal
        >
          <ClickAwayListener
            onClickAway={() => {
              setAppAnchorEl(null);
            }}
          >
            <MenuList
              autoFocusItem={appPopperOpen}
              className={classes.contentContainer}
            >
              <MenuItem>
                <Box
                  className={classes.itemContainer}
                  mb={1}
                  onClick={(e) => handleFruit(1, e)}
                >
                  <img src={require('assets/emojiIcons/watermelon.webp')} />
                  <Box ml={1}>
                    {fruitObject.fruits?.filter((fruit) => fruit.fruitId === 1)
                      ?.length || 0}
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem>
                <Box
                  className={classes.itemContainer}
                  mb={1}
                  onClick={(e) => handleFruit(2, e)}
                >
                  <img src={require('assets/emojiIcons/avocado.webp')} />
                  <Box ml={1}>
                    {fruitObject.fruits?.filter((fruit) => fruit.fruitId === 2)
                      ?.length || 0}
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem>
                <Box
                  className={classes.itemContainer}
                  onClick={(e) => handleFruit(3, e)}
                >
                  <img src={require('assets/emojiIcons/orange.webp')} />
                  <Box ml={1}>
                    {fruitObject.fruits?.filter((fruit) => fruit.fruitId === 3)
                      ?.length || 0}
                  </Box>
                </Box>
              </MenuItem>
            </MenuList>
          </ClickAwayListener>
        </Popper>
      )}
      {openSignRequestModal && (
        <SignatureRequestModal
          open={openSignRequestModal}
          address={userSelector.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={handleSubmit}
          handleClose={() => setOpenSignRequestModal(false)}
        />
      )}
    </>
  );
};
