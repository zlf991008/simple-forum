import * as React from 'react';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Link,
} from '@mui/material';

import axios from 'axios';
import useCurrentUser from '../hooks/useCurrentUser';

import { addAvatarPrefix } from '../utils/addPrefix';

// components
import Page from '../components/Page';
import Label from '../components/Label';
import SearchNotFound from '../components/SearchNotFound';
import { FriendListHead, FriendListToolbar, FriendMoreMenu } from '../sections/@dashboard/friend';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: '昵称', alignRight: false },
  { id: 'college', label: '学院', alignRight: false },
  { id: 'major', label: '专业', alignRight: false },
  { id: 'goodAt', label: '擅长', alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Friend() {
  const [page, setPage] = React.useState(0);

  const [order, setOrder] = React.useState('asc');

  const [selected, setSelected] = React.useState([]);

  const [orderBy, setOrderBy] = React.useState('name');

  const [filterName, setFilterName] = React.useState('');

  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { currentUser } = useCurrentUser();
  const [userList, setUserList] = React.useState([]);

  React.useEffect(() => {
    const fetchFollowingUserList = async () => {
      await axios
        .get('/friend/getFriends', {
          params: {
            userId: currentUser.userId,
          },
        })
        .then((res) => {
          console.log(res);
          setUserList(res.data.data);
        });
    };

    fetchFollowingUserList();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
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

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const navigate = useNavigate();
  const handleClickName = (userId) => (event) => {
    event.preventDefault();

    navigate('/dashboard/visit', {
      state: {
        userId,
      },
    });
  };

  return (
    <Page title="Friend">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            朋友
          </Typography>
        </Stack>

        <Card>
          <FriendListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <FriendListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  const { userId, name, avatar, college, major, goodAt } = row;
                  const isItemSelected = selected.indexOf(name) !== -1;

                  return (
                    <TableRow
                      hover
                      key={userId}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, name)} />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={name} src={addAvatarPrefix(avatar)} />
                          <Link underline="hover" color="inherit" to="#" onClick={handleClickName(userId)}>
                            <Typography variant="subtitle2" sx={{ cursor: 'pointer' }} noWrap>
                              {name}
                            </Typography>
                          </Link>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{college}</TableCell>
                      <TableCell align="left">{major}</TableCell>
                      <TableCell align="left">{goodAt}</TableCell>

                      <TableCell align="right">
                        <FriendMoreMenu />
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

              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}
