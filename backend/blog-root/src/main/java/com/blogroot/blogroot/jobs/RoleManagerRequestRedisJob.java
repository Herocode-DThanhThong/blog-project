package com.blogroot.blogroot.jobs;

import com.blogroot.blogroot.service.RoleManagerRequestRedisService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.scheduling.quartz.QuartzJobBean;

@RequiredArgsConstructor
@Slf4j
public class RoleManagerRequestRedisJob extends QuartzJobBean {
    private final RoleManagerRequestRedisService roleManagerRequestRedisService;

    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {
        roleManagerRequestRedisService.clearCache();
    }
}
