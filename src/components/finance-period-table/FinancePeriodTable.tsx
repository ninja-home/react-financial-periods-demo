import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, TextField } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { FinancePeriodType, StoreValue } from 'utils/types';
import { useSelector } from 'react-redux';
import { APIService } from 'service/api-service';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: any },
  b: { [key in Key]: any },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface IFinancialPeriodsTableProps {
  getFinancialPeriodsData: () => void
}
const FinancePeriodsTable: React.FC<IFinancialPeriodsTableProps> = ({getFinancialPeriodsData}) => {
  let financialPeriods = useSelector((state: StoreValue) => state.recipeReducer.financialPeriods)
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof FinancePeriodType>('name');
  const [selected, setSelected] = useState<Number[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dlgOpen, setDlgOpen] = useState<boolean>(false)
  const [dlgItem, setDlgItem] = useState<FinancePeriodType>({
    id: 0,
    year: 0,
    name: '',
    start_date: new Date(),
    end_date: new Date(),
    weeks: 0
  })
  const [dlgCreate, setDlgCreate] = useState<boolean>(false)

  const nameChanged = useCallback((e: { target: { value: string; }; }) => {
    setDlgItem({
      ...dlgItem,
      name: e.target.value
    })
  }, [dlgItem])

  const startDateChanged = useCallback((e: { target: { value: any; }; }) => {
    setDlgItem({
      ...dlgItem,
      start_date: e.target.value
    })
  }, [dlgItem])
  const endDateChanged = useCallback((e: { target: { value: any; }; }) => {
    setDlgItem({
      ...dlgItem,
      end_date: e.target.value
    })
  }, [dlgItem])
  const weeksChanged = useCallback((e: { target: { value: any; }; }) => {
    setDlgItem({
      ...dlgItem,
      weeks: e.target.value
    })
  }, [dlgItem])

  const handleClickOpen = useCallback((financeItem: FinancePeriodType) => {
    setDlgItem(financeItem)
    setDlgCreate(false)
    setDlgOpen(true)
  }, [])

  const newClickOpen = useCallback(() => {
    setDlgItem({
      id: 0,
      year: 0,
      name: '',
      start_date: new Date(),
      end_date: new Date(),
      weeks: 0
    })
    setDlgCreate(true)
    setDlgOpen(true)
  }, [])

  const multiDeleteClick = useCallback(async () => {
    const {result} = await APIService.deleteFinancialPeriods(selected)
    if (result) {
      getFinancialPeriodsData()
    }
  }, [getFinancialPeriodsData, selected])

  const deleteItem = useCallback(async (item: FinancePeriodType) => {
    const {result} = await APIService.deleteFinancialPeriods([item.id])
    if (result) {
      getFinancialPeriodsData()
    }
  }, [getFinancialPeriodsData])

  const handleSave = useCallback(async () => {
    if (dlgCreate) {
      setDlgOpen(false)
      const {result} = await APIService.addFinancialPeriods(dlgItem)
      if (result) {
        getFinancialPeriodsData()
      }
    } else {
      setDlgOpen(false)
      const {result} = await APIService.updateFinancialPeriods(dlgItem)
      if (result) {
        getFinancialPeriodsData()
      }
    }
  }, [dlgCreate, dlgItem, getFinancialPeriodsData])

  const handleClose = useCallback(() => {
    setDlgOpen(false)
  }, [])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof FinancePeriodType,
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = financialPeriods.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: Number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: Number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: Number) => selected.indexOf(id) !== -1;

  useEffect(() => {
    setSelected(selected.filter(item => {
      const selectedItem = financialPeriods.find(period => period.id === item)
      return !!selectedItem
    }))
  }, [financialPeriods])

  // Avoid a layout jump when reaching the last page with empty financialPeriods.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - financialPeriods.length) : 0;

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} newClickOpen={newClickOpen} multiDeleteClick={multiDeleteClick}/>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={financialPeriods.length}
            />
            <TableBody>
              {financialPeriods.slice().sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((financePeriodItem: FinancePeriodType, index) => {
                  const { id, name, start_date, end_date, weeks } = financePeriodItem
                  const isItemSelected = isSelected(id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event: React.MouseEvent<unknown, MouseEvent>) => handleClick(event, id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {name}
                      </TableCell>
                      <TableCell align="right">{`${start_date}`}</TableCell>
                      <TableCell align="right">{`${end_date}`}</TableCell>
                      <TableCell align="right">{`${weeks}`}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          aria-label="edit"
                          component="span"
                          onClick={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                            event.stopPropagation();
                            handleClickOpen(financePeriodItem)
                          }}
                        >
                          <EditOutlined />
                        </IconButton>
                        <IconButton
                          color="primary"
                          aria-label="delete"
                          component="span"
                          onClick={(event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
                            event.stopPropagation();
                            deleteItem(financePeriodItem)
                          }}
                        >
                          <DeleteOutline />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={financialPeriods.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog
        open={dlgOpen}
        onClose={handleClose}
      >
        <DialogTitle>{dlgCreate ? 'Create ' : 'Edit ' }Financial Period</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <TextField
            id="outlined-name"
            label="Name"
            variant="outlined"
            size='small'
            defaultValue={dlgItem.name}
            sx={{
              width: 400,
              my: 2
            }}
            onChange={nameChanged}
          />
          <TextField
            id="start_date"
            label="Start Date"
            type="date"
            defaultValue={dlgItem.start_date}
            size='small'
            sx={{
              width: 400,
              mb: 2
            }}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={startDateChanged}
          />
          <TextField
            id="end_date"
            label="End Date"
            type="date"
            defaultValue={dlgItem.end_date}
            sx={{
              width: 400,
              mb: 2
            }}
            size='small'
            InputLabelProps={{
              shrink: true,
            }}
            onChange={endDateChanged}
          />
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={dlgItem.weeks}
            label="weeks"
            sx={{
              color: 'black'
            }}
            size='small'
            onChange={weeksChanged}
          >
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default FinancePeriodsTable;