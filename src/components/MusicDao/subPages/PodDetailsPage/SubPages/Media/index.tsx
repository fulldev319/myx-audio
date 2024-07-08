import React from 'react';
// import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from 'shared/ui-kit/Box';
// import { MediaSimpleCard } from "components/MusicDao/components/Cards/MediaSimpleCard";
import { MasonryGrid } from 'shared/ui-kit/MasonryGrid/MasonryGrid';
import ArtistSongCard from 'components/MusicDao/components/Cards/ArtistSongCard';
import { useTypedSelector } from 'store/reducers/Reducer';

const COLUMNS_COUNT_BREAK_POINTS = {
  400: 1,
  700: 2,
  1000: 3,
  1440: 4
};

// const GUTTER = "16px";

const useStyles = makeStyles(() => ({
  cardsGrid: {
    display: 'grid',
    gridColumnGap: '20px',
    gridRowGap: '20px',
    width: '100%'
  }
}));

export const Media = ({ medias, pod, podInfo, handleRefresh }) => {
  const classes = useStyles();
  const user = useTypedSelector((state) => state.user);

  const [podMedias, setPodMedias] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (medias.length) {
      setPodMedias(
        medias
          .map((v) => {
            return {
              ...v,
              isPod: true,
              podInfo: pod,
              draft: v.draft === true || v.draft === false ? v.draft : true
            };
          })
          .filter((media) => {
            // if (media.metadataMedia) { // FIXME: Add condition for investors
            //   return false;
            // }
            return true;
          })
      );
    }
  }, [medias]);
  return (
    <Box width={1} display="flex" flexGrow={1} marginTop={5}>
      {podMedias.length ? (
        <Grid className={classes.cardsGrid}>
          {/* <ResponsiveMasonry columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}> */}
          <MasonryGrid
            gutter={'24px'}
            data={podMedias}
            renderItem={(item, _) => (
              <ArtistSongCard
                song={item}
                isLoading={Object.entries(item).length === 0}
                isShowEditionControl={
                  pod.Collabs?.find((v) => v.userId === user.id) ? true : false
                }
                refresh={handleRefresh}
              />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS}
          />
          {/* <Masonry gutter={GUTTER}>
              {podMedias.map((media, index) => (
                <Box key={index}>
                  <MediaSimpleCard media={media} pod={pod} podInfo={podInfo} handleRefresh={handleRefresh} />
                </Box>
              ))}
            </Masonry> */}
          {/* </ResponsiveMasonry> */}
        </Grid>
      ) : (
        <p>No medias available</p>
      )}
    </Box>
  );
};
