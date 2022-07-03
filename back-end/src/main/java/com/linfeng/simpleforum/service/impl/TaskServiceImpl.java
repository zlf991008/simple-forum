package com.linfeng.simpleforum.service.impl;

import com.linfeng.simpleforum.dao.TaskMapper;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.entity.Task;
import com.linfeng.simpleforum.service.TaskService;
import com.linfeng.simpleforum.utils.DateUtil;
import com.linfeng.simpleforum.utils.UuidUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskMapper taskMapper;

    @Autowired
    public TaskServiceImpl(TaskMapper taskMapper) {
        this.taskMapper = taskMapper;
    }

    @Override
    public ResponseResult insertTask(String taskLabel, String userId) {
        Task task = new Task();
        task.setTaskId(UuidUtil.uuid());
        task.setTaskLabel(taskLabel);
        task.setUserId(userId);
        task.setCreateTime(DateUtil.taskCreateTime());
        if (taskMapper.insertTask(task) != 1)
            return new ResponseResult(999, "Add task failed", task);
        return new ResponseResult(200, "Add task success", task);
    }

    @Override
    public ResponseResult deleteTask(String taskId) {
        Task task = taskMapper.getTaskByTaskId(taskId);
        if (taskMapper.deleteTask(taskId) > 0)
            return new ResponseResult(200, "Delete task success", task);
        return new ResponseResult(999, "Delete task failed", task);
    }

    @Override
    public ResponseResult updateTask(Task task) {
        if (taskMapper.updateTask(task) == 1) {
            Task newTask = taskMapper.getTaskByTaskId(task.getTaskId());
            return new ResponseResult(200, "Update success", newTask);
        }
        return new ResponseResult(999, "Update failed", task);
    }

    @Override
    public ResponseResult listTasksByUserId(String userId) {
        List<Task> taskList = taskMapper.listTasksByUserId(userId);
        if (taskList.size() == 0) {
            Map<String, Object> res = new HashMap<>();
            res.put("taskList", new ArrayList<>());
            res.put("taskCheckedList", new ArrayList<>());
            return new ResponseResult(404, "Task list is empty", res);
        }
        int n = taskList.size();
        List<Map> finalTaskList = new ArrayList<>();
        List<String> checkedList = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", i + "");
            map.put("taskId", taskList.get(i).getTaskId());
            map.put("label", taskList.get(i).getTaskLabel());
            map.put("checked", taskList.get(i).isCompleted());
//            map.put("userId", taskList.get(i).getUserId());
            if (taskList.get(i).isCompleted())
                checkedList.add(i + "");
            finalTaskList.add(map);
        }
        Map<String, Object> res = new HashMap<>();
        res.put("taskList", finalTaskList);
        res.put("taskCheckedList", checkedList);
        return new ResponseResult(200, "Get task list success", res);
    }
}
