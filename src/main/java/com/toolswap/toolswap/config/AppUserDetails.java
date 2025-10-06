package com.toolswap.toolswap.config;

import com.toolswap.toolswap.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

// translating the User into a Spring Security-compatible object.
public class AppUserDetails implements UserDetails {
    private final String username;
    private final String password;


    public AppUserDetails(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public AppUserDetails(User user) {
        this.username = user.getEmail();
        this.password = user.getPassword();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities(){ // for user roles and authorities
        return Collections.emptyList();
    }

    @Override
    public String getPassword(){
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
