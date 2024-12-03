package com.aircore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aircore.entity.User;
import com.aircore.exception.InvalidCredentialsException;
import com.aircore.response.AppResponse;
import com.aircore.response.TokenResponse;
import com.aircore.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/signup")
	public ResponseEntity<AppResponse<?>> signup(@RequestBody User user) {
	    try {
	        String response = authService.registerUser(user);
	        return ResponseEntity.ok(
	            new AppResponse<>(true, "User registered successfully", 200, response, null)
	        );
	    } catch (IllegalArgumentException e) {
	        return ResponseEntity.badRequest().body(
	            new AppResponse<>(false, "Invalid input", 400, null, e.getMessage())
	        );
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body(
	            new AppResponse<>(false, "Internal Server Error", 500, null, e.getMessage())
	        );
	    }
	}

	@PostMapping("/login")
	public ResponseEntity<AppResponse<?>> login(@RequestBody User user) {
		try {
			TokenResponse response = authService.authenticateUser(user);
			return new ResponseEntity<>(new AppResponse<>(true, "Login successful", response), HttpStatus.OK);
		} catch (InvalidCredentialsException e) {
			return new ResponseEntity<>(new AppResponse<>(false, e.getMessage()), HttpStatus.BAD_REQUEST);
		} catch (Exception e) {
			return new ResponseEntity<>(new AppResponse<>(false, "An unexpected error occurred"), HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

}
