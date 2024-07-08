import * as React from 'react';

import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';

import Box from 'shared/ui-kit/Box';
import Avatar from 'shared/ui-kit/Avatar';
import { getDefaultAvatar } from 'shared/services/user/getUserAvatar';
import { Color } from 'shared/ui-kit';
import { processImage } from 'shared/helpers';

import { useStyles } from './index.styles';

const DistributionTab = (props: any) => {
  const { proposal, pod } = props;

  const classes = useStyles();

  return (
    <div className={classes.generalNftMediaTab}>
      <Box className={classes.typo2} mb={5}>
        Media Fractions Distribution
      </Box>
      <Box className={classes.infoSection}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Artists</TableCell>
              {/* <TableCell>Role</TableCell> */}
              <TableCell>Share</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pod.Collabs?.filter(
              (_, i) =>
                proposal.copyrightAllocations &&
                proposal.copyrightAllocations[i]
            ).map((user, index) => (
              <TableRow key={`creators-${index}`}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar
                      size={48}
                      image={processImage(user.imageUrl) || getDefaultAvatar()}
                      radius={25}
                      bordered
                      rounded
                    />
                    <Box display="flex" flexDirection="column" ml={2}>
                      <Box className={classes.nameTypo} mb={0.5}>
                        {user.name}
                      </Box>
                      <Box className={classes.slugTypo} mb={0.5}>
                        @{user.urlSlug}
                      </Box>
                    </Box>
                  </Box>
                </TableCell>
                {/* <TableCell>
                  <Box className={classes.box}>
                    {proposal.Role && proposal.Role[index]
                      ? proposal.Role[index]
                      : 'Artist'}
                  </Box>
                </TableCell> */}
                <TableCell>
                  <Box className={`${classes.box} ${classes.bigBox}`}>{`${
                    proposal.copyrightAllocations
                      ? proposal.copyrightAllocations[index] / 100
                      : '0'
                  }%`}</Box>
                </TableCell>
                <TableCell>
                  {(proposal.votes && proposal.votes[user.id] === true) ||
                  user.id === proposal.proposer ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={'center'}
                      style={{
                        color: Color.MusicDAOGreen,
                        fontSize: 14,
                        lineHeight: '15px'
                      }}
                    >
                      Accepted&nbsp;
                      <img
                        src={require('assets/musicDAOImages/accepted.webp')}
                      />
                    </Box>
                  ) : proposal.votes && proposal.votes[user.id] === false ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={'center'}
                      style={{
                        color: Color.Red,
                        fontSize: 14,
                        lineHeight: '15px'
                      }}
                    >
                      Declined&nbsp;
                      <img
                        src={require('assets/musicDAOImages/declined.webp')}
                      />
                    </Box>
                  ) : (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent={'center'}
                      style={{
                        color: Color.MusicDAOGray,
                        fontSize: 14,
                        lineHeight: '15px'
                      }}
                    >
                      Pending&nbsp;
                      <img
                        src={require('assets/musicDAOImages/pending.webp')}
                      />
                    </Box>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {proposal.InvestorShare && (
          <Box
            className={classes.investorBox}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Investors</Box>
            <Box
              className={`${classes.box} ${classes.bigBox}`}
              style={{ background: '#FFFFFF' }}
            >
              {proposal.InvestorShare}%
            </Box>
          </Box>
        )}
      </Box>
    </div>
  );
};

export default DistributionTab;
