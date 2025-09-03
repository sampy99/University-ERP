package com.erp.modern_erp.controller;

import com.erp.modern_erp.dto.request.LoginRequest;
import com.erp.modern_erp.dto.request.SignupRequest;
import com.erp.modern_erp.dto.response.LoginResponse;
import com.erp.modern_erp.dto.response.SignupResponse;
import com.erp.modern_erp.entity.User;
import com.erp.modern_erp.service.AuthService;
import com.erp.modern_erp.service.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager; // ✅ works now


    @PostMapping("/signup")
    public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest req) {
        return ResponseEntity.ok(authService.signup(req));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        // Authenticate with Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Principal returned by authentication manager
        User user = (User) authentication.getPrincipal();

        // Generate JWT token with username
        String token = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(
                new LoginResponse(token, user.getRole().name(), user.getFullName())
        );
    }



}