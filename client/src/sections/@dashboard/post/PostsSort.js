import PropTypes from 'prop-types';
// material
import { MenuItem, TextField } from '@mui/material';

// ----------------------------------------------------------------------

PostsSort.propTypes = {
  options: PropTypes.array,
  onSort: PropTypes.func,
  sortOptionValue: PropTypes.string,
};

export default function PostsSort({ options, onSort, sortOptionValue }) {
  return (
    <TextField select size="small" value={sortOptionValue} onChange={onSort}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
