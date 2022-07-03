import * as React from 'react';
import PropTypes from 'prop-types';
import { Form, FormikProvider, useFormik } from 'formik';
// @mui
import {
  Card,
  CardContent,
  Stack,
  Divider,
  Checkbox,
  MenuItem,
  IconButton,
  CardHeader,
  FormControlLabel,
  Button,
  TextField,
  Collapse,
  Box,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';

import axios from 'axios';
import useCurrentUser from '../../../hooks/useCurrentUser';

// components
import Iconify from '../../../components/Iconify';
import MenuPopover from '../../../components/MenuPopover';

// ----------------------------------------------------------------------

HomeTasks.propTypes = {
  subheader: PropTypes.string,
};

export default function HomeTasks({ subheader, ...other }) {
  // const title = '@Tasks';
  const title = '任务清单';
  const [list, setList] = React.useState([]);
  const { currentUser } = useCurrentUser();
  const [isDisabled, setIsDisabled] = React.useState(false);
  React.useEffect(() => {
    const fetchTaskList = async () => {
      await axios
        .get('/task/taskList', {
          params: {
            userId: currentUser.userId,
          },
        })
        .then((res) => {
          setList(res.data.data.taskList);
          setFieldValue('checked', res.data.data.taskCheckedList);

          if (res.data.data.taskList.length === 7) setIsDisabled(true);
        });
    };

    fetchTaskList();
  }, [currentUser.userId]);

  const formik = useFormik({
    initialValues: {
      checked: [],
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const { values, handleSubmit, setFieldValue } = formik;

  // 选中复选框
  const handleChangeChecked = (e) => {
    const { checked, value } = e.target;
    if (checked === true) {
      const res = values.checked;
      res.push(value);
      setFieldValue('checked', res);
    } else if (checked === false) {
      const res = values.checked.filter((id) => id !== value);
      setFieldValue('checked', res);
    }

    const updateChecked = async () => {
      const task = list.find((item) => item.id === value);
      await axios
        .post('/task/update', {
          taskId: task.taskId,
          taskLabel: task.label,
          completed: checked,
          userId: currentUser.userId,
        })
        .then((res) => {
          console.log(res);
        });
    };
    updateChecked();
  };

  const [openAddTask, setOpenAddTask] = React.useState(false);
  // const [taskButtonText, setTaskButtonText] = React.useState('@New Task');
  const [taskButtonText, setTaskButtonText] = React.useState('添加');
  const [taskButtonIcon, setTaskButtonIcon] = React.useState('eva:plus-fill');
  const [newTaskLabel, setNewTaskLabel] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const handleClickTaskButton = () => {
    if (openAddTask === false) {
      setOpenAddTask(true);
      // setTaskButtonText('Cancel');
      setTaskButtonText('取消');
      setTaskButtonIcon('eva:minus-fill');
    } else {
      setOpenAddTask(false);
      // setTaskButtonText('@New Task');
      setTaskButtonText('添加');
      setTaskButtonIcon('eva:plus-fill');
    }
  };

  const handleChangeNewTaskLabel = (e) => {
    setNewTaskLabel(e.target.value);
  };

  const handleAddNewTask = () => {
    const addNewTask = async () => {
      const newTask = new FormData();
      newTask.append('taskLabel', newTaskLabel);
      newTask.append('userId', currentUser.userId);
      await axios.post('/task/add', newTask).then((res) => {
        if (res.data.statusCode === 200) {
          setList([
            ...list,
            {
              id: list.length.toString(),
              label: res.data.data.taskLabel,
              checked: res.data.data.completed,
              taskId: res.data.data.taskId,
            },
          ]);

          if (list.length === 7) setIsDisabled(true);
        }
      });
    };
    setIsSending(true);
    if (newTaskLabel === '') {
      setTimeout(() => {
        setIsSending(false);
        handleClickTaskButton();
      }, 2000);
    } else {
      setTimeout(() => {
        setNewTaskLabel('');
        setIsSending(false);
        handleClickTaskButton();
        addNewTask();
      }, 2000);
    }
  };

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button
            variant="contained"
            startIcon={<Iconify icon={taskButtonIcon} />}
            onClick={handleClickTaskButton}
            disabled={isDisabled}
          >
            {taskButtonText}
          </Button>
        }
      />
      <CardContent>
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            {list.map((task) => (
              <TaskItem
                key={task.taskId}
                task={task}
                checked={values.checked.includes(task.id)}
                formik={formik}
                handleChangeChecked={handleChangeChecked}
                list={list}
                setList={setList}
              />
            ))}
          </Form>
        </FormikProvider>
      </CardContent>
      <Collapse in={openAddTask} timeout="auto" unmountOnExit>
        <Box sx={{ width: 1, ml: 2, mr: 2, mt: 2, mb: 2 }}>
          <Stack direction="row" spacing={2}>
            <TextField sx={{ width: '65%' }} value={newTaskLabel} onChange={handleChangeNewTaskLabel}>
              {newTaskLabel}
            </TextField>
            <LoadingButton
              sx={{ width: '25%' }}
              endIcon={<SendIcon />}
              variant="contained"
              onClick={handleAddNewTask}
              loading={isSending}
            >
              {/* @Add Task */}
              添加
            </LoadingButton>
          </Stack>
        </Box>
      </Collapse>
    </Card>
  );
}

// ----------------------------------------------------------------------

TaskItem.propTypes = {
  formik: PropTypes.object,
  task: PropTypes.object,
  checked: PropTypes.bool,
  handleChangeChecked: PropTypes.func,
  list: PropTypes.arrayOf(PropTypes.object),
  setList: PropTypes.func,
};

function TaskItem({ formik, task, checked, handleChangeChecked, list, setList, ...other }) {
  const { getFieldProps } = formik;
  const [open, setOpen] = React.useState(null);
  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleMarkComplete = () => {
    console.log('MARK COMPLETE', task);
    // const task = list.find((item) => item.id === value);
    handleCloseMenu();
  };

  const handleShare = (e) => {
    const { value } = e.target;
    const task = list.find((item) => item.id === value);
    handleCloseMenu();
    console.log('SHARE', task);
  };

  const handleEdit = (e) => {
    const { value } = e.target;
    const task = list.find((item) => item.id === value);
    handleCloseMenu();
    console.log('EDIT', task);
  };

  const handleDelete = () => {
    handleCloseMenu();
    const deleteTask = async () => {
      await axios
        .delete('/task/delete', {
          params: {
            taskId: task.taskId,
          },
        })
        .then((res) => {
          if (res.data.statusCode === 200) {
            const finalList = list.filter((item) => item.taskId !== task.taskId);
            setList(finalList);
          }
        });
    };
    deleteTask();
  };

  return (
    <Stack
      direction="row"
      sx={{
        px: 2,
        py: 0.75,
        ...(checked && {
          color: 'text.disabled',
          textDecoration: 'line-through',
        }),
      }}
    >
      <FormControlLabel
        control={
          <Checkbox
            {...getFieldProps('checked')}
            value={task.id}
            checked={checked}
            onChange={handleChangeChecked}
            {...other}
          />
        }
        label={task.label}
        sx={{ flexGrow: 1, m: 0 }}
      />

      <MoreMenuButton
        open={open}
        onClose={handleCloseMenu}
        onOpen={handleOpenMenu}
        actions={
          <>
            <MenuItem onClick={handleMarkComplete}>
              <Iconify icon={'eva:checkmark-circle-2-fill'} />
              {/* @Mark Complete */}
              完成
            </MenuItem>

            <MenuItem onClick={handleEdit}>
              <Iconify icon={'eva:edit-fill'} />
              {/* @Edit */}
              编辑
            </MenuItem>

            <MenuItem onClick={handleShare}>
              <Iconify icon={'eva:share-fill'} />
              {/* @Share */}
              分享
            </MenuItem>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <Iconify icon={'eva:trash-2-outline'} />
              {/* @Delete */}
              删除
            </MenuItem>
          </>
        }
      />
    </Stack>
  );
}

// ----------------------------------------------------------------------

MoreMenuButton.propTypes = {
  actions: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  onOpen: PropTypes.func,
  open: PropTypes.object,
};

function MoreMenuButton({ actions, open, onOpen, onClose }) {
  return (
    <>
      <IconButton size="large" color="inherit" sx={{ opacity: 0.48 }} onClick={onOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={onClose}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 'auto',
          '& .MuiMenuItem-root': {
            px: 1,
            typography: 'body2',
            borderRadius: 0.75,
            '& svg': { mr: 2, width: 20, height: 20 },
          },
        }}
      >
        {actions}
      </MenuPopover>
    </>
  );
}
