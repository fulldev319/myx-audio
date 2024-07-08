import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';

import Box from 'shared/ui-kit/Box';
import { musicSubPageStyles } from '../index.styles';
import GenreCard from '../../components/Cards/GenreCard';
import { Text } from '../../../../components/ui-kit';

export default function Index() {
  const classes = musicSubPageStyles();
  const history = useHistory();

  const [genres, setGenres] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const loadGenres = useCallback((page) => {}, []);

  useEffect(() => {
    loadGenres(page);
  }, [page]);

  const handlePagination = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <Box
          className={classes.pointer}
          display="flex"
          flexDirection="row"
          alignItems="center"
          mb={3}
          onClick={() => {
            history.push('/player/search');
          }}
        >
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path
              d="M6 1L1 6L6 11"
              stroke="#181818"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Text ml={1.5}>Back</Text>
        </Box>
        <div className={classes.title}>Explore All</div>
        {loading ? (
          <div className={classes.loaderDiv}>
            <CircularProgress style={{ color: '#A0D800' }} />
          </div>
        ) : genres && genres.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {genres.map((genre, index) => (
                <Grid key={`genre-card-${index}`} item md={2} sm={3} xs={6}>
                  <GenreCard item={genre} size="small" />
                </Grid>
              ))}
            </Grid>
            {total > 18 && (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                mt={5}
              >
                <Pagination
                  count={Math.floor((total - 1) / 18) + 1}
                  page={page}
                  onChange={handlePagination}
                />
              </Box>
            )}
          </>
        ) : (
          <div className={classes.content} style={{ marginTop: '104px' }}>
            <div className={classes.empty}>You have not created any genres</div>
          </div>
        )}
      </div>
    </div>
  );
}
