package com.blogroot.blogroot.model;

import com.blogroot.blogroot.constants.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
@Table(name = "_user")
@Entity
public class User extends BaseEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(name = "username", unique = true)
    private String username;
    @Column(name = "password")
    @JsonIgnore
    private String password;
    @Column(name = "email")
    private String email;
    @Column(name = "first_name")
    private String firstName;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "address")
    private String address;
    @Column(name = "avatar")
    private String avatar;
    @Column(name = "activated_account")
    private Boolean activatedAccount;
    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = role
                .getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
        return authorities;
    }

    public String getUsername() {
        return this.username;
    }

    @JsonIgnore
    public String getPassword() {
        return this.password;
    }

    @JsonIgnore
    public boolean isAccountNonExpired() {
        return true;
    }

    @JsonIgnore
    public boolean isAccountNonLocked() {
        return true;
    }

    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @JsonIgnore
    public boolean isEnabled() {
        return true;
    }
}
