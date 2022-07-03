package com.linfeng.simpleforum.controller;

import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.entity.Task;
import com.linfeng.simpleforum.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task")
public class TaskController {

    private final TaskService taskService;

    @Autowired
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseResult add(@RequestParam String taskLabel, @RequestParam String userId) {
        return taskService.insertTask(taskLabel, userId);
    }

    // 这里用的是delete
    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    public ResponseResult delete(@RequestParam(value = "taskId") String taskId) {
        return taskService.deleteTask(taskId);
    }

    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public ResponseResult update(@RequestBody Task task) {
        return taskService.updateTask(task);
    }

    @RequestMapping(value = "/taskList", method = RequestMethod.GET)
    public ResponseResult taskList(@RequestParam(value = "userId") String userId) {
        return taskService.listTasksByUserId(userId);
    }
}
