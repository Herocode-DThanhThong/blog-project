package com.blogroot.blogroot;

import com.blogroot.blogroot.constants.Role;
import com.blogroot.blogroot.model.User;
import com.blogroot.blogroot.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootApplication
public class BlogRootApplication {
    @Value("${account.admin.username}")
    private String adminUsername;
    @Value("${account.admin.password}")
    private String adminPassword;
    @Value("${account.admin.email}")
    private String adminEmail;
    @Value("${account.admin.firstName}")
    private String adminFirstName;
    @Value("${account.admin.lastName}")
    private String adminLastName;
    @Value("${account.admin.address}")
    private String adminAddress;
    @Value("${account.admin.avatar}")
    private String adminAvatar;

    public static void main(String[] args) {
        SpringApplication.run(BlogRootApplication.class, args);
    }

    @Bean
    public CommandLineRunner createAdminAccount(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            Optional<User> admin = userRepository.findByUsername(adminUsername);
            if (!admin.isPresent()) {
                User nUser = User.builder()
                        .username(adminUsername)
                        .password(passwordEncoder.encode(adminPassword))
                        .email(adminEmail)
                        .firstName(adminFirstName)
                        .lastName(adminLastName)
                        .address(adminAddress)
                        .avatar(adminAvatar)
                        .role(Role.ADMIN)
                        .activatedAccount(true)
                        .build();
                userRepository.save(nUser);
            }
        };
    }
}
