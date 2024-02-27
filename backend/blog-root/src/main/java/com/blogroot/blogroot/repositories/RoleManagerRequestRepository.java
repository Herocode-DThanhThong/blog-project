package com.blogroot.blogroot.repositories;

import com.blogroot.blogroot.constants.StatusRequest;
import com.blogroot.blogroot.model.RoleManagerRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleManagerRequestRepository extends JpaRepository<RoleManagerRequest, Long> {

    Optional<RoleManagerRequest> findByUserUsernameAndStatus(String username, StatusRequest status);

    Page<RoleManagerRequest> findAll(Pageable pageable);

}
