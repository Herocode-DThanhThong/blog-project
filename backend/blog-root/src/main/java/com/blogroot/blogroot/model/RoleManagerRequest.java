package com.blogroot.blogroot.model;

import com.blogroot.blogroot.constants.StatusRequest;
import com.blogroot.blogroot.listeners.RoleManagerRequestListener;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "role_manager_request")
@Entity
@EntityListeners(RoleManagerRequestListener.class)
public class RoleManagerRequest extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "title")
    private String title;
    @Column(name = "description", columnDefinition = "text")
    private String description;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StatusRequest status = StatusRequest.PENDING;
    @ManyToOne
    private User user;
}
