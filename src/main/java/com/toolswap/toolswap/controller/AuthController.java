package com.toolswap.toolswap.controller;

import com.toolswap.toolswap.config.AppUserDetails;
import com.toolswap.toolswap.dto.AuthResponse;
import com.toolswap.toolswap.dto.ErrorResponse;
import com.toolswap.toolswap.dto.LoginRequest;
import com.toolswap.toolswap.dto.RegisterRequest;
import com.toolswap.toolswap.model.User;
import com.toolswap.toolswap.service.AuthService;
import com.toolswap.toolswap.service.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

//    private final JwtService jwtService;

    //    response entity (wrapper for http res)- three main things --> body,status code, headers
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User registeredUser = authService.registerUser(request);
            String jwtToken = jwtService.generateToken(new AppUserDetails(registeredUser));
            AuthResponse authResponse = new AuthResponse(jwtToken, registeredUser.getId(), registeredUser.getEmail(), registeredUser.getName());

            return ResponseEntity.ok(authResponse);

        } catch (IllegalStateException ex) {
            ErrorResponse errorResponse = new ErrorResponse(ex.getMessage());
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }
//        User registeredUser = authService.registerUser(request);
//        String jwtToken = jwtService.generateToken(new AppUserDetails(registeredUser));
//
//        return ResponseEntity.ok(new AuthResponse(jwtToken, registeredUser.getId(), registeredUser.getEmail(), registeredUser.getName()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var userDetails = (AppUserDetails) authentication.getPrincipal();
        var user = authService.getUserByEmail(userDetails.getUsername());

        String jwtToken = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwtToken, user.getId(), user.getEmail(), user.getName()));
    }
}
