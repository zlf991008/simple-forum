package com.linfeng.simpleforum.dao;

import com.linfeng.simpleforum.entity.Task;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskMapper {
    Integer insertTask(Task task);
    Integer deleteTask(String taskId);
    Integer updateTask(Task task);
    Task getTaskByTaskId(String taskId);
    List<Task> listTasksByUserId(String userId);
}
