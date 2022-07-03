package com.linfeng.simpleforum.entity;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResponseResult {
    private int statusCode;
    private String message;
    private Object data;
}
