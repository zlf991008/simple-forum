import PropTypes from 'prop-types';
// material
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

TypePostsSort.propTypes = {
  options: PropTypes.array,
  onTypeSort: PropTypes.func,
  typeSortOptionValue: PropTypes.string,
};

export default function TypePostsSort({ options, onTypeSort, typeSortOptionValue }) {
  return (
    <TextField select size="small" value={typeSortOptionValue} onChange={onTypeSort} fullWidth>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
