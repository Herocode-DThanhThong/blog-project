package com.blogroot.blogroot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "verification_token")
@Entity
public class VerificationToken extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "token", columnDefinition = "text", unique = true, nullable = false)
    private String token;
    @ManyToOne(optional = false)
    private User user;
}
