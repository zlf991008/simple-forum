package com.linfeng.simpleforum;

import com.linfeng.simpleforum.dao.PostMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class SimpleForumApplicationTests {

    @Autowired
    PostMapper noticeMapper;

    @Test
    void contextLoads() {
        System.out.println("======================");

    }

}
