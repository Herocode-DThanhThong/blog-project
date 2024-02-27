package com.blogroot.blogroot.scheduler;

import com.blogroot.blogroot.jobs.BlogRedisJob;
import com.blogroot.blogroot.jobs.RoleManagerRequestRedisJob;

import lombok.RequiredArgsConstructor;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.Date;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class RedisScheduler {
    private final Scheduler scheduler;
    @Value("${job.blog.redis.group-name-job-detail}")
    private String blogGroupNameJobDetail;
    @Value("${job.blog.redis.group-name-trigger}")
    private String blogGroupNameTrigger;
    @Value("${job.blog.redis.description-job-detail}")
    private String blogDescriptionJobDetail;
    @Value("${job.blog.redis.description-trigger}")
    private String blogDescriptionTrigger;
    @Value("${job.role-manager-request.redis.group-name-job-detail}")
    private String roleManagerRequestGroupNameJobDetail;
    @Value("${job.role-manager-request.redis.group-name-trigger}")
    private String roleManagerRequestGroupNameTrigger;
    @Value("${job.role-manager-request.redis.description-job-detail}")
    private String roleManagerRequestDescriptionJobDetail;
    @Value("${job.role-manager-request.redis.description-trigger}")
    private String roleManagerRequestDescriptionTrigger;

    public void schedulerClearCacheBlog(LocalDateTime startAt) throws SchedulerException {
        ZonedDateTime dateTime = ZonedDateTime.of(startAt, ZoneId.systemDefault());
        if (dateTime.isBefore(ZonedDateTime.now())) return;
        JobDetail jobDetail = buildBlogJobDetail();
        Trigger trigger = buildBlogTrigger(jobDetail, dateTime);
        scheduler.scheduleJob(jobDetail, trigger);
    }

    public void schedulerClearCacheRoleManagerRequest(LocalDateTime startAt) throws SchedulerException {
        ZonedDateTime dateTime = ZonedDateTime.of(startAt, ZoneId.systemDefault());
        if (dateTime.isBefore(ZonedDateTime.now())) return;
        JobDetail jobDetail = buildRoleManagerRequestJobDetail();
        Trigger trigger = buildRoleManagerRequestTrigger(jobDetail, dateTime);
        scheduler.scheduleJob(jobDetail, trigger);
    }

    public JobDetail buildBlogJobDetail() {
        return JobBuilder
                .newJob(BlogRedisJob.class)
                .withIdentity(UUID.randomUUID().toString(), blogGroupNameJobDetail)
                .withDescription(blogDescriptionJobDetail)
                .storeDurably()
                .build();
    }

    public JobDetail buildRoleManagerRequestJobDetail() {
        return JobBuilder
                .newJob(RoleManagerRequestRedisJob.class)
                .withIdentity(UUID.randomUUID().toString(), roleManagerRequestGroupNameJobDetail)
                .withDescription(roleManagerRequestDescriptionJobDetail)
                .storeDurably()
                .build();
    }

    public Trigger buildRoleManagerRequestTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobDetail.getKey().getName(), roleManagerRequestGroupNameTrigger)
                .withDescription(roleManagerRequestDescriptionJobDetail)
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }

    public Trigger buildBlogTrigger(JobDetail jobDetail, ZonedDateTime startAt) {
        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity(jobDetail.getKey().getName(), blogGroupNameTrigger)
                .withDescription(blogDescriptionTrigger)
                .startAt(Date.from(startAt.toInstant()))
                .withSchedule(SimpleScheduleBuilder.simpleSchedule().withMisfireHandlingInstructionFireNow())
                .build();
    }
}
