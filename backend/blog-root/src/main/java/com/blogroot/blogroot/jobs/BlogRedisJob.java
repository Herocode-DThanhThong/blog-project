package com.blogroot.blogroot.jobs;

import com.blogroot.blogroot.service.BlogRedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

@RequiredArgsConstructor
@Slf4j
public class BlogRedisJob extends QuartzJobBean {
    private final BlogRedisService blogRedisService;

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        blogRedisService.clearCache();
    }
}
