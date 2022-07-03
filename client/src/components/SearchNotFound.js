import PropTypes from 'prop-types';
// material
import { Paper, Typography } from '@mui/material';

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
};

export default function SearchNotFound({ searchQuery = '', ...other }) {
  return (
    <Paper {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        {/* @Not found */}
        无记录
      </Typography>
      {/* <Typography variant="body2" align="center">
        No results found for &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong>. Try checking for typos or using complete words.
      </Typography> */}
      {/* <Typography variant="body2" align="center">
        没有包含 &nbsp;
        <strong>&quot;{searchQuery}&quot;</strong> 的结果. 检查你的输入.
      </Typography> */}
    </Paper>
  );
}
