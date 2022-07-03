import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

// @mui
import { styled } from '@mui/material/styles';
import { Autocomplete, InputAdornment, Popper, TextField } from '@mui/material';
// components
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const PopperStyle = styled((props) => <Popper placement="bottom-start" {...props} />)({
  width: '280px !important',
});

// ----------------------------------------------------------------------

PostSearch.propTypes = {
  postList: PropTypes.array.isRequired,
};

export default function PostSearch({ postList }) {
  const [value, setValue] = React.useState(null);
  const navigate = useNavigate();

  return (
    <Autocomplete
      sx={{ width: 280 }}
      autoHighlight
      popupIcon={null}
      PopperComponent={PopperStyle}
      options={postList}
      getOptionLabel={(post) => post.title}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          // placeholder="@Search post..."
          placeholder="搜索帖子"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon={'eva:search-fill'} sx={{ ml: 1, width: 20, height: 20, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        navigate('/dashboard/detail', {
          state: {
            post: newValue,
          },
          replace: true,
        });
      }}
    />
  );
}
