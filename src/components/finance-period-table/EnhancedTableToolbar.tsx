import { Delete, Add } from "@mui/icons-material";
import { Toolbar, alpha, Typography, Tooltip, IconButton } from "@mui/material";

interface EnhancedTableToolbarProps {
  numSelected: number;
  newClickOpen: () => void;
  multiDeleteClick: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const { numSelected, newClickOpen, multiDeleteClick } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          FINANCIAL PERIODS
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={multiDeleteClick}>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Add item">
          <IconButton onClick={newClickOpen}>
            <Add />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default EnhancedTableToolbar