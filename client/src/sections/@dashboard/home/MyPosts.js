import { filter } from 'lodash';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  IconButton,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
// components
import Label from '../../../components/Label';
import Iconify from '../../../components/Iconify';
import SearchNotFound from '../../../components/SearchNotFound';
import { MyPostsHead, MyPostsToolbar, MyPostsMoreMenu } from './index';
// mock
// import USERLIST from '../../../_mock/user';
import { fType } from '../../../utils/formatType';
import { fDateTime } from '../../../utils/formatTime';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  // { id: '@title', label: 'Title', alignRight: false },
  // { id: 'postCreateTime', label: 'Create Time', alignRight: false },
  // { id: 'heat', label: 'Heat', alignRight: false },
  // { id: 'type', label: 'Type', alignRight: false },
  // { id: '' },
  { id: 'title', label: '标题', alignRight: false },
  { id: 'postCreateTime', label: '发布时间', alignRight: false },
  { id: 'heat', label: '热度', alignRight: false },
  { id: 'type', label: '类型', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_post) => _post.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

MyPosts.propTypes = {
  myPosts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setMyPosts: PropTypes.func,
};

export default function MyPosts({ myPosts, setMyPosts }) {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('desc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('postCreateTime');

  const [filterTitle, setFilterTitle] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = myPosts.map((n) => n.postId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, postId) => {
    const selectedIndex = selected.indexOf(postId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, postId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByTitle = (event) => {
    setFilterTitle(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - myPosts.length) : 0;

  const filteredPosts = applySortFilter(myPosts, getComparator(order, orderBy), filterTitle);

  const isPostNotFound = filteredPosts.length === 0;

  return (
    // <Page title="User">
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Stack direction="row">
          <IconButton aria-label="recent" disabled>
            <AccessTimeIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom sx={{ pt: 1 }}>
            {/* @My Posts */}
            我的帖子
          </Typography>
        </Stack>
        <Button
          variant="contained"
          component={RouterLink}
          to="/dashboard/newPost"
          startIcon={<Iconify icon="eva:plus-fill" />}
        >
          {/* @New Post */}
          发布帖子
        </Button>
      </Stack>

      <Card>
        <MyPostsToolbar numSelected={selected.length} filterTitle={filterTitle} onFilterTitle={handleFilterByTitle} />
        {/* <Scrollbar /> */}
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <MyPostsHead
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={myPosts.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                const { postId, title, postCreateTime, heat, type } = row;
                const isItemSelected = selected.indexOf(postId) !== -1;
                return (
                  <TableRow
                    hover
                    key={postId}
                    tabIndex={-1}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, postId)} />
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ pl: 2 }}>
                        <Typography variant="subtitle2" noWrap>
                          {title}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="left">{fDateTime(postCreateTime)}</TableCell>
                    <TableCell align="left">{heat}</TableCell>
                    <TableCell align="left">
                      <Label
                        variant="ghost"
                        color={
                          type === 'SEEK_HELP' || type === 'SEEK_OWNER' || type === 'SEEK_LOST_PROP'
                            ? 'error'
                            : 'primary'
                        }
                        sx={{ textTransform: 'uppercase' }}
                      >
                        {fType(type)}
                      </Label>
                    </TableCell>

                    <TableCell align="right">
                      <MyPostsMoreMenu postId={postId} myPosts={myPosts} setMyPosts={setMyPosts} />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>

            {isPostNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterTitle} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={myPosts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
    // </Page>
  );
}
