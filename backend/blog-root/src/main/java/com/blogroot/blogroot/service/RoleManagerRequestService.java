package com.blogroot.blogroot.service;

import com.blogroot.blogroot.constants.ErrorCode;
import com.blogroot.blogroot.constants.Role;
import com.blogroot.blogroot.constants.StatusRequest;
import com.blogroot.blogroot.dtos.PaginationDTO;
import com.blogroot.blogroot.dtos.RoleManagerRequestDTO;
import com.blogroot.blogroot.exception.BaseException;
import com.blogroot.blogroot.model.RoleManagerRequest;
import com.blogroot.blogroot.model.User;
import com.blogroot.blogroot.repositories.RoleManagerRequestRepository;
import com.blogroot.blogroot.repositories.UserRepository;
import com.blogroot.blogroot.response.RoleManagerRequestListResponse;
import com.blogroot.blogroot.scheduler.RedisScheduler;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.quartz.SchedulerException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleManagerRequestService {
    private final RoleManagerRequestRepository roleManagerRequestRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final RoleManagerRequestRedisService roleManagerRequestRedisService;
    private final RedisScheduler redisScheduler;

    public RoleManagerRequestListResponse getAllRequest(PageRequest pageRequest) throws JsonProcessingException, SchedulerException {
        RoleManagerRequestListResponse roleManagerRequestListRedis = roleManagerRequestRedisService.getRoleManagerRequestListResponse(
                pageRequest.getPageNumber(),
                pageRequest.getPageSize(),
                pageRequest.getSort().getOrderFor("createdDate").getDirection().isAscending() ? "asc" : "desc");
        if (roleManagerRequestListRedis == null) {
            Page page = roleManagerRequestRepository.findAll(pageRequest);
            PaginationDTO paginationDTO = PaginationDTO.builder()
                    .page(page.getPageable().getPageNumber())
                    .limit(page.getPageable().getPageSize())
                    .total(page.getTotalElements())
                    .build();
            RoleManagerRequestListResponse roleManagerRequestListResponse = RoleManagerRequestListResponse.builder()
                    .data(page.getContent())
                    .paginationDTO(paginationDTO)
                    .build();
            roleManagerRequestRedisService.saveRoleManagerRequestListResponse(
                    roleManagerRequestListResponse,
                    page.getPageable().getPageNumber(),
                    page.getPageable().getPageSize(),
                    pageRequest.getSort().getOrderFor("createdDate").getDirection().isAscending() ? "asc" : "desc");
            redisScheduler.schedulerClearCacheRoleManagerRequest(LocalDateTime.now().plusHours(1));
            return roleManagerRequestListResponse;
        }
        return roleManagerRequestListRedis;
    }

    public RoleManagerRequest createRequest(RoleManagerRequestDTO roleManagerRequestDTO, Principal connectedUsername) throws BaseException {
        String username = (String) ((UsernamePasswordAuthenticationToken) connectedUsername).getPrincipal();
        Optional<RoleManagerRequest> requestPending = roleManagerRequestRepository
                .findByUserUsernameAndStatus(username, StatusRequest.PENDING);
        if (requestPending.isPresent())
            throw new BaseException(
                    ErrorCode.ROLE_MANAGER_REQUEST_IS_PENDING.getMessage(),
                    ErrorCode.ROLE_MANAGER_REQUEST_IS_PENDING.getErrorCode()
            );
        Optional<RoleManagerRequest> requestApproved = roleManagerRequestRepository
                .findByUserUsernameAndStatus(username, StatusRequest.APPROVED);
        if (requestApproved.isPresent())
            throw new BaseException(
                    ErrorCode.ROLE_MANAGER_REQUEST_IS_APPROVED.getMessage(),
                    ErrorCode.ROLE_MANAGER_REQUEST_IS_APPROVED.getErrorCode()
            );
        User userRequested = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.USER_NOT_FOUND.getMessage(),
                        ErrorCode.USER_NOT_FOUND.getErrorCode())
                );

        RoleManagerRequest nRoleManagerRequest = RoleManagerRequest.builder()
                .title(roleManagerRequestDTO.getTitle())
                .status(StatusRequest.PENDING)
                .description(roleManagerRequestDTO.getDescription())
                .user(userRequested)
                .build();
        return roleManagerRequestRepository.save(nRoleManagerRequest);
    }

    public RoleManagerRequest getDetailRoleManagerRequest(Long id) throws BaseException {
        return roleManagerRequestRepository.findById(id).orElseThrow(
                () -> new BaseException(
                        ErrorCode.ROLE_MANAGER_REQUEST_NOT_FOUND.getMessage(),
                        ErrorCode.ROLE_MANAGER_REQUEST_NOT_FOUND.getErrorCode()
                )
        );
    }

    @Transactional
    public void deleteRequest(Long id) throws BaseException {
        roleManagerRequestRepository.deleteById(id);
    }

    @Transactional
    public void approveRequest(Long id) throws BaseException {
        RoleManagerRequest roleManagerRequest = this.getDetailRoleManagerRequest(id);
        User user = userRepository
                .findByUsername(roleManagerRequest.getUser().getUsername())
                .orElseThrow(() -> new BaseException(
                        ErrorCode.USER_NOT_FOUND.getMessage(),
                        ErrorCode.USER_NOT_FOUND.getErrorCode())
                );
        user.setRole(Role.MANAGER);
        roleManagerRequest.setStatus(StatusRequest.APPROVED);
        userRepository.save(user);
        emailService.sendApproveRoleManagerRequestEmail(user);
        roleManagerRequestRepository.save(roleManagerRequest);
    }

    @Transactional
    public void rejectRequest(Long id) throws BaseException {
        RoleManagerRequest roleManagerRequest = this.getDetailRoleManagerRequest(id);
        User user = userRepository
                .findByUsername(roleManagerRequest.getUser().getUsername())
                .orElseThrow(() -> new BaseException(
                        ErrorCode.USER_NOT_FOUND.getMessage(),
                        ErrorCode.USER_NOT_FOUND.getErrorCode())
                );
        roleManagerRequest.setStatus(StatusRequest.REJECTED);
        emailService.sendRejectRoleManagerRequestEmail(user);
        roleManagerRequestRepository.save(roleManagerRequest);
    }
}


