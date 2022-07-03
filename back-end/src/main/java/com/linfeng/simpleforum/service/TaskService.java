package com.linfeng.simpleforum.service;


import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.entity.Task;

public interface TaskService {
    ResponseResult insertTask(String taskLabel, String userId);
    ResponseResult deleteTask(String taskId);
    ResponseResult updateTask(Task task);
    ResponseResult listTasksByUserId(String userId);
}
