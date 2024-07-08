import React, { useState } from 'react';
import styles from './index.module.css';
import cls from 'classnames';

export default function Sidebar({ child, theme, hideClose = false }) {
  const [hideSidebar, setHideSidebar] = useState<boolean>(false);

  return (
    <div className={styles.sidebarContainer}>
      <div
        className={cls(
          { [styles.art]: theme === 'art' },
          { [styles.music]: theme === 'music' },
          { [styles.data]: theme === 'data' },
          { [styles.wallet]: theme === 'wallet' },
          { [styles.collab]: theme === 'collab' },
          { [styles.daoMusic]: theme === 'dao-music' },
          styles.sidebar,
          { [styles.hidden]: hideSidebar }
        )}
      >
        {!hideClose && (
          <div
            onClick={() => {
              setHideSidebar(true);
            }}
            className={styles.imgContainer}
          >
            <img
              src={require(`assets/icons/${
                theme === 'wallet'
                  ? 'arrow_gray'
                  : theme !== 'art' && theme !== 'dao-music'
                  ? 'cross'
                  : 'cross_white'
              }.webp`)}
              alt="close"
            />
          </div>
        )}
        {child}
      </div>

      {hideSidebar && (
        <button
          className={cls(styles.hideButton, {
            [styles.daoMusic]: theme === 'dao-music' || theme === 'music'
          })}
          onClick={() => {
            setHideSidebar(false);
          }}
        >
          <img
            src={require('assets/icons/big_arrow.webp')}
            alt="show sidebar"
          />
        </button>
      )}
    </div>
  );
}
