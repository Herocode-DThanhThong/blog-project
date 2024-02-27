package com.blogroot.blogroot.repositories;

import com.blogroot.blogroot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findAllByOrderByCreatedDateAsc();

    Optional<User> findByUsernameIgnoreCase(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmailIgnoreCase(String email);
}
