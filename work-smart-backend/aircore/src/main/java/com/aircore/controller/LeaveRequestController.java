package com.aircore.controller;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aircore.entity.LeaveRequest;
import com.aircore.request.LeaveRequestDTO;
import com.aircore.response.AppResponse;
import com.aircore.response.LeaveRequestResponse;
import com.aircore.response.PageableResponse;
import com.aircore.service.LeaveRequestService;
import com.aircore.utility.Constant;
import com.aircore.utility.Enumeration.LeaveStatus;
import com.aircore.utility.Enumeration.LeaveType;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @PostMapping("/{userId}")
    public ResponseEntity<AppResponse<?>> createLeaveRequest(
            @PathVariable("userId") Long userId,
            @RequestBody LeaveRequestDTO leaveRequestDTO) {

    	try {
            LeaveRequest leaveRequest = leaveRequestService.createLeaveRequest(leaveRequestDTO, userId);
            AppResponse<?> response = new AppResponse<>(
                    true,
                    "Leave request created successfully",
                    leaveRequest.getId()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
		} catch (Exception e) {
	        AppResponse<?> response = new AppResponse<>(
	                false,
	                e.getMessage(),
	                ""
	        );
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
		}
    }

    @GetMapping("/requests/{page}")
    public ResponseEntity<PageableResponse<LeaveRequestResponse>> getFilteredLeaveRequests(
            @PathVariable int page,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date_from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date_to,
            @RequestParam(required = false) LeaveType leaveType,
            @RequestParam(required = false) LeaveStatus leaveStatus) {

        if (page > 0) {
            page = page - 1;
        }

        Page<LeaveRequestResponse> leaveRequestPage = leaveRequestService.getFilteredLeaveRequests(
                keyword,
                date_from,
                date_to,
                leaveType,
                leaveStatus,
                PageRequest.of(page, Constant.LIMIT_10)
        );

        PageableResponse<LeaveRequestResponse> response = new PageableResponse<>(
                (int) leaveRequestPage.getTotalElements(),
                leaveRequestPage.getContent()
        );

        return ResponseEntity.ok(response);
    }

    
}