import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import makeStyles from '@material-ui/core/styles/makeStyles';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';

import Box from 'shared/ui-kit/Box';
import { Text } from 'shared/ui-kit';
import { FontSize, Color } from 'shared/constants/const';

interface NavItemProps {
  name: string;
  subName?: string;
  value: string;
  subNavs?: NavItemProps[];
  link?: string;
}

const Navigations: NavItemProps[] = [
  // { name: "Free Music", value: "music", link: "/free-music" },
  // {
  //   name: "Finance",
  //   value: "finance",
  //   subNavs: [
  //     { name: "Liquidity", value: "liquidity", link: "/liquidity" },
  //     { name: "High Yield", value: "yield", link: "/high-yield" },
  //     { name: "Trade TRAX", value: "ftrade", link: "/trade-trax" },
  //   ],
  // },
  // { name: "Claimable Music", value: "claimable", link: "/claimable-music" },
  // {
  //   name: "DAO",
  //   value: "dao",
  //   subNavs: [
  //     { name: "Staking", value: "staking", link: "/staking" },
  //     { name: "Governance", value: "governance", link: "/governance" },
  //   ],
  // },
  // { name: "Potions", value: "potions", link: "/potions" },
  { name: 'Home', value: 'home', link: '/' },
  { name: 'Music', value: 'music', link: '/music' },
  // { name: 'Merch', value: 'merch', link: '/merch' },
  { name: 'Myx Artists', value: 'artists', link: '/artists' },
  // { name: 'Marketplace', value: 'marketplace', link: '/marketplace' },
  {
    name: 'Capsules',
    subName: '(Raise Money)',
    value: 'capsules',
    link: '/capsules'
  }
];

const useStyles = makeStyles({
  nav: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer'
  },
  paper: {
    background: Color.White,
    boxShadow:
      '0px 8px 24px -5px rgba(71, 78, 104, 0.19), 0px 41px 65px -11px rgba(36, 46, 60, 0.1)',
    borderRadius: 12,
    '& .MuiList-root': {
      padding: '14px 16px',
      '& .MuiListItem-root.MuiMenuItem-root': {
        fontSize: 13,
        fontWeight: 600,
        transition: 'none',
        '&:hover': {
          color: Color.MusicDAOGreen,
          borderRadius: 12,
          background: 'linear-gradient(0deg, #F2FBF6, #F2FBF6), #17172D'
        }
      }
    }
  }
});

const MusicAppNavigation = () => {
  const classes = useStyles();

  const history = useHistory();
  const location = useLocation();

  const [selected, setSelected] = React.useState<NavItemProps | undefined>(
    Navigations[0]
  );

  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  const anchorNavMenuRef = React.useRef<(HTMLDivElement | null)[]>(
    Array(Navigations.length).fill(null)
  );

  React.useEffect(() => {
    if (location.pathname) {
    }
    const selectedNav = Navigations.find((nav) => {
      if (nav.subNavs) {
        const tmp = nav.subNavs.find(
          (subNav) => subNav.link === location.pathname
        );
        if (tmp) {
          return true;
        } else {
          return false;
        }
      } else {
        if (nav.link) {
          if (location.pathname === '/' && nav.link === '/') {
            return true;
          } else if (nav.link !== '/') {
            return location.pathname.startsWith('/' + nav.value);
          }
        }
        return false;
      }
    });

    if (selectedNav) {
      setSelected(selectedNav);
    } else {
      setSelected(undefined);
    }

    setOpenSubMenu(null);
  }, [location.pathname]);

  const handleOpenSubMenu = (nav: NavItemProps) => (
    event: React.MouseEvent<EventTarget>
  ) => {
    event.stopPropagation();

    if (nav.subNavs) {
      setOpenSubMenu(nav.value);
    } else {
      if (nav.link) history.push(nav.link);
    }
  };

  const handleCloseSubMenu = (index: number) => (
    event: React.MouseEvent<EventTarget>
  ) => {
    const ref = anchorNavMenuRef.current[index];
    if (ref && ref.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenSubMenu(null);
  };

  const handleListKeyDownSubMenu = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpenSubMenu(null);
    }
  };

  const handleClickSubMenu = (nav: NavItemProps) => (
    event: React.MouseEvent<EventTarget>
  ) => {
    event.preventDefault();

    if (nav.link) history.push(nav.link);
  };

  return (
    <Box display="flex" flexDirection="row">
      {Navigations.map((nav, index) => (
        <Box key={`music-nav-${index}`} onClick={handleOpenSubMenu(nav)} ml={2}>
          <div
            className={classes.nav}
            ref={(ref) => (anchorNavMenuRef.current[index] = ref)}
          >
            <Box
              fontSize={FontSize.M}
              color={
                nav.value === selected?.value ? Color.White : Color.GrayDark
              }
              mr={1}
              display="flex"
              position={'relative'}
            >
              <Box>{nav.name}</Box>
              {nav.subName && (
                <Box
                  position={'absolute'}
                  bottom={12}
                  left={60}
                  whiteSpace="nowrap"
                >
                  {nav.subName}
                </Box>
              )}
            </Box>
            {nav.subNavs && (
              <>
                <NavArrowDown
                  color={
                    nav.value === selected?.value
                      ? Color.MusicDAOGreen
                      : Color.MusicDAODark
                  }
                />
                <Popper
                  open={openSubMenu === nav.value}
                  anchorEl={anchorNavMenuRef.current[index]}
                  transition
                  disablePortal={false}
                  placement="bottom"
                  style={{ zIndex: 100000 }}
                >
                  {({ TransitionProps }) => (
                    <Grow {...TransitionProps}>
                      <Paper className={classes.paper}>
                        <ClickAwayListener
                          onClickAway={handleCloseSubMenu(index)}
                        >
                          <MenuList
                            autoFocusItem={openSubMenu === nav.value}
                            onKeyDown={handleListKeyDownSubMenu}
                          >
                            {nav.subNavs &&
                              nav.subNavs.map((subNav, subIndex) => (
                                <MenuItem
                                  key={`sub-menu-item-${subNav.value}-${subIndex}`}
                                  value={subNav.value}
                                  onClick={handleClickSubMenu(subNav)}
                                >
                                  {subNav.name}
                                </MenuItem>
                              ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            )}
          </div>
        </Box>
      ))}
    </Box>
  );
};

export default MusicAppNavigation;

const NavArrowDown = ({ color }) => (
  <svg width="8" height="5" viewBox="0 0 8 5" stroke={color} fill="none">
    <path
      d="M1 1L4 4L7 1"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
