package com.blogroot.blogroot.service;

import com.blogroot.blogroot.constants.ErrorCode;
import com.blogroot.blogroot.dtos.BlogDTO;
import com.blogroot.blogroot.dtos.PaginationDTO;
import com.blogroot.blogroot.exception.BaseException;
import com.blogroot.blogroot.model.Blog;
import com.blogroot.blogroot.model.User;
import com.blogroot.blogroot.repositories.BlogRepository;
import com.blogroot.blogroot.repositories.UserRepository;
import com.blogroot.blogroot.response.BlogListResponse;
import com.blogroot.blogroot.scheduler.RedisScheduler;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BlogService {
    private final BlogRepository blogRepository;
    private final UserRepository userRepository;
    private final BlogRedisService blogRedisService;
    private final RedisScheduler redisScheduler;

    public BlogListResponse getAllBlog(String searchText, PageRequest pageRequest) throws JsonProcessingException, SchedulerException {
        BlogListResponse blogListResponseRedis = blogRedisService.getBlogListResponse(
                pageRequest.getPageNumber(),
                pageRequest.getPageSize(),
                pageRequest.getSort().getOrderFor("createdDate").getDirection().isAscending() ? "asc" : "desc",
                searchText
        );
        if (blogListResponseRedis == null) {
            Page page;
            if (searchText.equals(""))
                page = blogRepository.findAll(pageRequest);
            else
                page = blogRepository.findByContentContainingIgnoreCase(searchText, pageRequest);
            PaginationDTO paginationDTO = PaginationDTO.builder()
                    .page(page.getPageable().getPageNumber())
                    .limit(page.getPageable().getPageSize())
                    .total(page.getTotalElements())
                    .build();
            BlogListResponse blogListResponse = BlogListResponse
                    .builder()
                    .data(page.getContent())
                    .paginationDTO(paginationDTO)
                    .build();
            blogRedisService.saveBlogListResponse(blogListResponse,
                    page.getPageable().getPageNumber(),
                    page.getPageable().getPageSize(),
                    pageRequest.getSort().getOrderFor("createdDate").getDirection().isAscending() ? "asc" : "desc",
                    searchText
            );
            redisScheduler.schedulerClearCacheBlog(LocalDateTime.now().plusHours(1));
            return blogListResponse;
        }
        return blogListResponseRedis;
    }

    public Blog getDetailBlog(Long id) throws BaseException {
        return blogRepository.findById(id).orElseThrow(() -> new BaseException(ErrorCode.BLOG_NOT_FOUND.getMessage(), ErrorCode.BLOG_NOT_FOUND.getErrorCode()));
    }

    public List<Blog> getBlogByUser(Principal connectedUsername) {
        String username = (String) ((UsernamePasswordAuthenticationToken) connectedUsername).getPrincipal();
        return blogRepository.findAllByUserUsernameOrderByCreatedDateDesc(username);
    }

    public Blog createBlog(BlogDTO blogDTO, Principal connectedUsername) throws BaseException {
        String username = (String) ((UsernamePasswordAuthenticationToken) connectedUsername).getPrincipal();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND.getMessage(), ErrorCode.USER_NOT_FOUND.getErrorCode()));
        Blog blog = Blog.builder()
                .title(blogDTO.getTitle())
                .content(blogDTO.getContent())
                .user(user)
                .build();
        return blogRepository.save(blog);
    }

    @Transactional
    public Blog updateBlog(Long id, BlogDTO blogDTO) throws BaseException {
        Blog blog = this.getDetailBlog(id);
        blog.setTitle(blogDTO.getTitle());
        blog.setContent(blogDTO.getContent());
        return blogRepository.save(blog);
    }

    @Transactional
    public void deleteBlog(Long id) {
        blogRepository.deleteById(id);
    }
}
