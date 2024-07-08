import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import createStyles from '@material-ui/core/styles/createStyles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export default function SongsRowHeader({ page }) {
  const mobileMatch = useMediaQuery('(max-width:600px)');

  if (mobileMatch) {
    return null;
  } else {
    return (
      <TableHead>
        <StyledTableRow>
          <StyledTableCell align="center">#</StyledTableCell>
          <StyledTableCell align="left">TRACK</StyledTableCell>
          <StyledTableCell align="center">PLATFORM</StyledTableCell>
          {page !== 'search' ? (
            <StyledTableCell align="center">VIEWS</StyledTableCell>
          ) : null}
          <StyledTableCell align="center">DURATION</StyledTableCell>
          <StyledTableCell></StyledTableCell>
        </StyledTableRow>
      </TableHead>
    );
  }
}

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      fontSize: '14px',
      color: '#fff',
      fontWeight: 800,
      borderBottom: '1px solid #ffffff20',
      padding: 16
    }
  })
)(TableCell);

const StyledTableRow = withStyles(() =>
  createStyles({
    head: {
      background: 'transparent'
    }
  })
)(TableRow);
