package com.linfeng.simpleforum.service;


import com.linfeng.simpleforum.entity.Comment;
import com.linfeng.simpleforum.entity.ResponseResult;


public interface CommentService {
    ResponseResult insertComment(Comment comment);
    ResponseResult listCommentsByPostId(String postId);
    Comment combineComments(Comment comment);

    Comment newCombineComments(Comment comment);
    ResponseResult newListCommentsByPostId(String postId);
}
