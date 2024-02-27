package com.blogroot.blogroot.service;

import com.blogroot.blogroot.constants.ErrorCode;
import com.blogroot.blogroot.exception.BaseException;
import com.blogroot.blogroot.model.User;
import com.blogroot.blogroot.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User getCurrentUser(Principal connectedUsername) throws BaseException {
        String username = (String) ((UsernamePasswordAuthenticationToken) connectedUsername).getPrincipal();
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new BaseException(
                        ErrorCode.USER_NOT_FOUND.getMessage(),
                        ErrorCode.USER_NOT_FOUND.getErrorCode()
                )
        );
        return user;
    }

    public List<User> getUsers() {
        List<User> users = userRepository.findAllByOrderByCreatedDateAsc();
        return users;
    }
}
