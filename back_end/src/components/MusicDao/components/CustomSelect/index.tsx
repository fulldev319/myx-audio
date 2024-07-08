import React, { useState, useEffect } from 'react';

import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import Box from 'shared/ui-kit/Box';
import { DownArrowIcon } from '../Icons/SvgIcons';
import { useCustomSelectStyles } from './index.styles';

export default function CustomSelect({
  items,
  value,
  onSelect,
  containerStyle = '',
  label = '',
  theme = 'light',
  isNotOffset = false,
  width = 'auto'
}) {
  const [open, setOpen] = useState(false);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const classes = useCustomSelectStyles({ width: open ? width : 'auto' });

  return (
    <div
      ref={anchorRef}
      className={`${classes.content} ${containerStyle} ${open && classes.open}`}
      onClick={handleToggle}
    >
      <Box display="flex" alignItems="center">
        {label && <Box className={classes.label}>{label}</Box>}
        <Box className={classes.popUpSection}>{value}</Box>
      </Box>
      <Box ml={1}>
        <DownArrowIcon color={theme === 'light' ? '#ffffff' : '#2D3047'} />
      </Box>
      <Popper
        className={classes.popUpMenu}
        style={{ left: isNotOffset ? '0px !important' : undefined }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement={isNotOffset ? 'bottom-start' : 'bottom'}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper className={classes.popUpMenuContent}>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  {items.map((item, index) => (
                    <MenuItem
                      onClick={(e) => {
                        onSelect(item);
                        handleClose(e);
                      }}
                      key={index}
                    >
                      <Box>{item}</Box>
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}
