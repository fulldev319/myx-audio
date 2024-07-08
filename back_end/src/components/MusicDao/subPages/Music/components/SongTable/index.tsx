import React, { useLayoutEffect, useRef, useState } from 'react';

import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';

import { songTableStyles } from './index.styles';
import SongsRowHeader from '../SongsRowHeader';
import SongRow from '../SongRow';
import { CircularLoadingIndicator } from 'shared/ui-kit';

export default function SongTable({
  height = 100,
  loading,
  hasMore,
  itemArray,
  myPlaylists = [],
  simplified,
  page,
  playlist = null,
  loadMore = () => {},
  refreshPlaylist = () => {}
}: {
  height?: number;
  loading: boolean;
  hasMore: boolean;
  itemArray: any[];
  myPlaylists?: any[];
  simplified?: any;
  page?: any;
  playlist?: any;
  loadMore: () => void;
  refreshPlaylist?: () => void;
}) {
  const classes = songTableStyles();
  const itemListRef = useRef<HTMLDivElement>(null);
  const [distanceBottom, setDistanceBottom] = useState(0);

  const scrollListener = React.useCallback(() => {
    if (!itemListRef || !itemListRef.current) return;

    let bottom =
      itemListRef?.current?.scrollHeight - itemListRef?.current?.clientHeight;
    // if you want to change distanceBottom every time new data is loaded
    // don't use the if statement
    if (!distanceBottom) {
      // calculate distanceBottom that works for you
      setDistanceBottom(Math.round((bottom / 100) * 20));
    }
    if (
      itemListRef?.current?.scrollTop > bottom - distanceBottom &&
      hasMore &&
      !loading
    ) {
      loadMore();
    }
  }, [hasMore, loadMore, loading, distanceBottom]);

  useLayoutEffect(() => {
    const tableRef = itemListRef.current;

    if (!tableRef) return;

    tableRef.addEventListener('scroll', scrollListener);
    return () => {
      tableRef.removeEventListener('scroll', scrollListener);
    };
  }, [scrollListener]);

  return (
    <TableContainer ref={itemListRef} style={{ maxHeight: height }}>
      <Table className={classes.table}>
        <SongsRowHeader page={page} />
        {itemArray &&
          itemArray.length > 0 &&
          itemArray.map((item, index) => (
            <SongRow
              row={item}
              simplified={false}
              page={page}
              key={`item-${page}-${index}`}
              myPlaylists={myPlaylists}
              playlist={playlist}
              refreshPlaylist={refreshPlaylist}
            />
          ))}
      </Table>
      {loading && (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: 16
          }}
        >
          <CircularLoadingIndicator />
        </div>
      )}
    </TableContainer>
  );
}
