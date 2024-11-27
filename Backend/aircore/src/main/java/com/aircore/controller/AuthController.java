package com.aircore.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aircore.configuration.JwtUtil;
import com.aircore.entity.User;
import com.aircore.repository.UserRepository;
import com.aircore.response.TokenResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@RequestBody User user) throws Exception {
        try {
            Optional<User> foundUser = userRepository.findByUsername(user.getUsername());
            if (foundUser.isEmpty() || !passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
                throw new Exception("Usre Name Not found");
            }

            String token = jwtUtil.generateToken(user.getUsername(), "USER");
    	    TokenResponse response = new TokenResponse();
	        response.setToken(token);
	        response.setStatus("Success");
	        response.setRole("USER");
		    return new ResponseEntity<TokenResponse>(response, HttpStatus.OK);
        } catch (Exception e) {
            throw new Exception("Usre Name Not found");
        }
    }

}

