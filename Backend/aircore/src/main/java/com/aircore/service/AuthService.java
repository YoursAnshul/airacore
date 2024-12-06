package com.aircore.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.aircore.configuration.JwtUtil;
import com.aircore.entity.Role;
import com.aircore.entity.User;
import com.aircore.exception.InvalidCredentialsException;
import com.aircore.repository.RoleRepository;
import com.aircore.repository.UserRepository;
import com.aircore.response.TokenResponse;
import com.aircore.utility.Enumeration.Status;

@Service
public class AuthService {


    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;

    public String registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        if (userRepository.existsByMobileNumber(user.getMobileNumber())) {
            throw new IllegalArgumentException("Mobile Number already exists");
        }
        user.setStatus(Status.ACTIVE);
        user.setCreatedDate(new Date());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRoles() == null || user.getRoles().isEmpty()) {
            Role defaultRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("Default role 'USER' not found"));
            user.getRoles().add(defaultRole);
        }

        userRepository.save(user);
        return "User registered successfully";
    }
    
    public TokenResponse authenticateUser(User user) throws InvalidCredentialsException {
        User foundUser = userRepository.findByEmail(user.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials"));

        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            throw new InvalidCredentialsException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(foundUser.getEmail(), "USER");

        TokenResponse response = new TokenResponse();
        response.setToken(token);
        response.setStatus("Success");
        response.setRole("USER");
        return response;
    }

	
}
