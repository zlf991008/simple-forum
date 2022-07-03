package com.linfeng.simpleforum.controller;

import com.linfeng.simpleforum.entity.Comment;
import com.linfeng.simpleforum.entity.ResponseResult;
import com.linfeng.simpleforum.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/comment")
public class CommentController {

    private final CommentService commentService;

    @Autowired
    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseResult addComment(@RequestBody Comment comment) {
        return commentService.insertComment(comment);
    }

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public ResponseResult all(@RequestParam String postId) {
        return commentService.listCommentsByPostId(postId);
    }

    @RequestMapping(value = "/allCommentsArray", method = RequestMethod.GET)
    public ResponseResult allCommentsArray(@RequestParam String postId) {
        return commentService.newListCommentsByPostId(postId);
    }
}
