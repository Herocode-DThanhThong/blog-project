package com.blogroot.blogroot.service;

import com.blogroot.blogroot.constants.ErrorCode;
import com.blogroot.blogroot.constants.Role;
import com.blogroot.blogroot.dtos.LoginUserDTO;
import com.blogroot.blogroot.dtos.RefreshTokenDTO;
import com.blogroot.blogroot.dtos.RegisterUserDTO;
import com.blogroot.blogroot.exception.BaseException;
import com.blogroot.blogroot.model.User;
import com.blogroot.blogroot.model.VerificationToken;
import com.blogroot.blogroot.repositories.UserRepository;
import com.blogroot.blogroot.repositories.VerificationTokenRepository;
import com.blogroot.blogroot.response.LoginResponse;
import com.blogroot.blogroot.response.RefreshTokenResponse;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final EmailService emailService;

    @Transactional
    public User register(@Valid RegisterUserDTO registerUserDTO) throws BaseException {
        Boolean isExistingUsername = userRepository
                .findByUsernameIgnoreCase(registerUserDTO.getUsername()).isPresent();
        if (isExistingUsername) throw new BaseException(
                ErrorCode.USERNAME_ALREADY_IN_USE.getMessage(),
                ErrorCode.USERNAME_ALREADY_IN_USE.getErrorCode()
        );
        Boolean isExistingEmail = userRepository
                .findByEmailIgnoreCase(registerUserDTO.getEmail()).isPresent();
        if (isExistingEmail) throw new BaseException(
                ErrorCode.EMAIL_ALREADY_IN_USE.getMessage(),
                ErrorCode.EMAIL_ALREADY_IN_USE.getErrorCode()
        );

        User nUser = User.builder()
                .username(registerUserDTO.getUsername())
                .password(passwordEncoder.encode(registerUserDTO.getPassword()))
                .email(registerUserDTO.getEmail())
                .firstName(registerUserDTO.getFirstName())
                .lastName(registerUserDTO.getLastName())
                .address(registerUserDTO.getAddress())
                .avatar(registerUserDTO.getAvatar())
                .role(Role.USER)
                .activatedAccount(false)
                .build();
        userRepository.save(nUser);
        // Send verification email
        VerificationToken verificationToken = VerificationToken.builder()
                .token(jwtService.generateVerificationToken(nUser))
                .user(nUser)
                .build();
        verificationTokenRepository.save(verificationToken);
        emailService.sendVerificationEmail(verificationToken);
        return nUser;
    }

    public LoginResponse login(LoginUserDTO loginUserDTO) throws BaseException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginUserDTO.getUsername(),
                loginUserDTO.getPassword()
        ));
        User user = userRepository.findByUsername(loginUserDTO.getUsername()).get();
        if (!user.getActivatedAccount())
            throw new BaseException(
                    ErrorCode.ACCOUNT_NOT_VERIFIED.getMessage(),
                    ErrorCode.ACCOUNT_NOT_VERIFIED.getErrorCode()
            );
        String accessToken = jwtService.generateAccessToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);
        return LoginResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public void resendEmailVerifyUser(String username) throws BaseException {
        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.USER_NOT_FOUND.getMessage(),
                        ErrorCode.USER_NOT_FOUND.getErrorCode()
                ));
        if (user.getActivatedAccount()) {
            throw new BaseException(
                    ErrorCode.ACCOUNT_ALREADY_ACTIVATED.getMessage(),
                    ErrorCode.ACCOUNT_ALREADY_ACTIVATED.getErrorCode()
            );
        }
        VerificationToken verificationToken = VerificationToken.builder()
                .token(jwtService.generateVerificationToken(user))
                .user(user)
                .build();
        verificationTokenRepository.save(verificationToken);
        emailService.sendVerificationEmail(verificationToken);
    }

    @Transactional
    public void verifyUser(String token) throws BaseException {
        Optional<VerificationToken> opToken = verificationTokenRepository.findByToken(token);
        if (!opToken.isPresent()) throw new BaseException(
                ErrorCode.VERIFICATION_TOKEN_NOT_FOUND.getMessage(),
                ErrorCode.VERIFICATION_TOKEN_NOT_FOUND.getErrorCode()
        );
        if (jwtService.isTokenExpired(token)) throw new BaseException(
                ErrorCode.EMAIL_VERIFY_ACCOUNT_WAS_EXPIRED.getMessage(),
                ErrorCode.EMAIL_VERIFY_ACCOUNT_WAS_EXPIRED.getErrorCode()
        );
        User user = userRepository.findByUsername(opToken.get().getUser().getUsername()).get();
        user.setActivatedAccount(true);
        userRepository.save(user);
        verificationTokenRepository.deleteByUserId(user.getId());
    }

    public RefreshTokenResponse refreshToken(RefreshTokenDTO refreshTokenDTO) throws BaseException {
        String refreshToken = refreshTokenDTO.getToken();
        String username = jwtService.extractUsername(refreshToken);
        User user = userRepository.findByUsername(username).orElseThrow(
                () -> new BaseException(
                        ErrorCode.USER_NOT_FOUND.getMessage(),
                        ErrorCode.USER_NOT_FOUND.getErrorCode()
                )
        );
        if (!jwtService.isTokenExpired(refreshToken)) {
            String nAccessToken = jwtService.generateAccessToken(user);
            return RefreshTokenResponse.builder()
                    .accessToken(nAccessToken)
                    .refreshToken(refreshToken)
                    .build();
        }
        return null;
    }
}
