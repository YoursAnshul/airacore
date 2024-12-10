package com.aircore.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aircore.response.AppResponse;
import com.aircore.response.LoginStatusResponse;
import com.aircore.service.LoginLogoutLogsService;

@RestController
@RequestMapping("/api/login-logout-logs")
public class LoginLogoutLogsController {

	@Autowired
	private LoginLogoutLogsService loginLogoutLogsService;

	@PostMapping("/login/{userId}")
	public ResponseEntity<AppResponse<?>> login(@PathVariable Long userId, @RequestParam String loginType) {
		try {
			loginLogoutLogsService.login(userId, loginType);
			AppResponse<?> appResponse = new AppResponse<>(true, "Login successful", 201, null, null);
			return new ResponseEntity<>(appResponse, HttpStatus.CREATED);
		} catch (Exception e) {
			AppResponse<?> appResponse = new AppResponse<>(false, "Failed to login", 500, null, e.getMessage());
			return new ResponseEntity<>(appResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/logout/{logId}")
	public ResponseEntity<AppResponse<?>> logout(@PathVariable Long logId) {
		try {
			loginLogoutLogsService.logout(logId);
			AppResponse<?> appResponse = new AppResponse<>(true, "Logout successful", 200, null, null);
			return new ResponseEntity<>(appResponse, HttpStatus.OK);
		} catch (Exception e) {
			AppResponse<?> appResponse = new AppResponse<>(false, "Failed to logout", 500, null, e.getMessage());
			return new ResponseEntity<>(appResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/status/{userId}")
	public ResponseEntity<AppResponse<?>> getLoginStatus(@PathVariable Long userId) {
	    try {
	        LoginStatusResponse statusResponse = loginLogoutLogsService.getUserLoginStatus(userId);
	        String message = statusResponse.isLoggedIn() ? "User is logged in" : "User is logged out";
	        AppResponse<LoginStatusResponse> appResponse = new AppResponse<>(true, message, 200, statusResponse, null);
	        return new ResponseEntity<>(appResponse, HttpStatus.OK);
	    } catch (Exception e) {
	        AppResponse<LoginStatusResponse> appResponse = new AppResponse<>(false, "Failed to fetch login status", 500, null, e.getMessage());
	        return new ResponseEntity<>(appResponse, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}

}
