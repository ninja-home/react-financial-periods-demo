import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel, Box } from "@mui/material";
import { FinancePeriodType } from "utils/types";
import { visuallyHidden } from '@mui/utils';

type Order = 'asc' | 'desc';

interface HeadCell {
  disablePadding: boolean;
  id?: keyof FinancePeriodType;
  label: String;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'Name',
  },
  {
    id: 'start_date',
    numeric: true,
    disablePadding: false,
    label: 'Start Date',
  },
  {
    id: 'end_date',
    numeric: true,
    disablePadding: false,
    label: 'End Date',
  },
  {
    id: 'weeks',
    numeric: true,
    disablePadding: false,
    label: 'Number Of Weeks',
  },
  {
    numeric: false,
    disablePadding: false,
    label: 'Action',
  }
]

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof FinancePeriodType) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: String;
  rowCount: number;
}

const EnhancedTableHead: React.FC<EnhancedTableProps> = (props) => {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler =
    (property: keyof FinancePeriodType) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map(({ id, numeric, disablePadding, label }, index) => (
          id ? <TableCell
            key={index}
            align={numeric ? 'right' : 'left'}
            padding={disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === id ? order : false}
          >
            <TableSortLabel
              active={orderBy === id}
              direction={orderBy === id ? order : 'asc'}
              onClick={createSortHandler(id)}
            >
              {label}
              {orderBy === id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell> : <TableCell
            key={index}
            align={'center'}
            padding={disablePadding ? 'none' : 'normal'}
          >
            {label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead