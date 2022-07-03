package com.linfeng.simpleforum;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.linfeng.simpleforum.dao")
public class SimpleForumApplication {

    public static void main(String[] args) {
        SpringApplication.run(SimpleForumApplication.class, args);
    }

}
