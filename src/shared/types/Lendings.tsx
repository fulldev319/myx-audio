// Types and Interfaces for LENDING
import { LoanData } from 'store/actions/Loan';
import { MusicData } from 'store/actions/MusicLending';

export type Order = 'asc' | 'desc';

export interface MusicHeadCell {
  disablePadding: boolean;
  id: keyof MusicData;
  label: string;
  numeric: boolean;
}

export interface LoanHeadCell {
  disablePadding: boolean;
  id: keyof LoanData;
  label: string;
  numeric: boolean;
}

export interface EnhancedMusicTableProps {
  classes: any; // ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof MusicData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export interface EnhancedLoanTableProps {
  classes: any; // ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof LoanData
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}
