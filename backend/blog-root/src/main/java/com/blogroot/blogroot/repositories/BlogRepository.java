package com.blogroot.blogroot.repositories;

import com.blogroot.blogroot.model.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BlogRepository extends JpaRepository<Blog, Long> {
    Page<Blog> findByContentContainingIgnoreCase(String keyword, Pageable pageable);

    List<Blog> findAllByUserUsernameOrderByCreatedDateDesc(String username);
}
