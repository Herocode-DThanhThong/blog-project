package com.blogroot.blogroot.model;

import com.blogroot.blogroot.listeners.BlogEntityListener;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "blog")
@Entity
@EntityListeners(BlogEntityListener.class)
public class Blog extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "title", columnDefinition = "text")
    private String title;
    @Column(name = "content", columnDefinition = "text")
    private String content;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
