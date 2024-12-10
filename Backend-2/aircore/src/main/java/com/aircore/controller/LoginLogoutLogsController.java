package com.aircore.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aircore.response.AppResponse;
import com.aircore.response.LoginLogoutLogsDetailsResponse;
import com.aircore.response.LoginLogoutLogsResponse;
import com.aircore.response.LoginStatusResponse;
import com.aircore.response.PageableResponse;
import com.aircore.service.LoginLogoutLogsService;
import com.aircore.utility.Constant;
import com.aircore.utility.Enumeration.LoginType;

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
	
	@GetMapping("/logs/{page}")
    public ResponseEntity<PageableResponse<LoginLogoutLogsResponse>> getFilteredLogs(
            @PathVariable int page,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) LoginType loginType,
            @RequestParam(required = false) LocalDate dateFrom,
            @RequestParam(required = false) LocalDate dateTo) {

        if (page > 0) {
            page = page - 1;
        }

        Page<LoginLogoutLogsResponse> logsPage = loginLogoutLogsService.getFilteredLogs(
                userId, loginType, dateFrom, dateTo, PageRequest.of(page, Constant.LIMIT_10));

        PageableResponse<LoginLogoutLogsResponse> response = new PageableResponse<>(
                (int) logsPage.getTotalElements(), logsPage.getContent());

        return ResponseEntity.ok(response);
    }
	
	
	@GetMapping("/logs-details/{loginLogoutLogsId}/{userId}/{page}")
	public ResponseEntity<PageableResponse<LoginLogoutLogsDetailsResponse>> getLoginLogoutDetails(
	        @PathVariable Long loginLogoutLogsId,
	        @PathVariable Long userId,
	        @PathVariable int page,
	        @RequestParam(required = false) LocalDate dateFrom,
	        @RequestParam(required = false) LocalDate dateTo) {

	    if (page > 0) {
	        page = page - 1; 
	    }

	    Page<LoginLogoutLogsDetailsResponse> detailsPage = loginLogoutLogsService.getLoginLogoutDetails(
	            loginLogoutLogsId, userId, dateFrom, dateTo, PageRequest.of(page, Constant.LIMIT_10));

	    PageableResponse<LoginLogoutLogsDetailsResponse> response = new PageableResponse<>(
	            (int) detailsPage.getTotalElements(), detailsPage.getContent());

	    return ResponseEntity.ok(response);
	}



}
