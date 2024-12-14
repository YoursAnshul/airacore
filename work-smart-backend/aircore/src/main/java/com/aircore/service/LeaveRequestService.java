package com.aircore.service;

import java.time.LocalDate;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.aircore.entity.LeaveRequest;
import com.aircore.repository.LeaveRequestRepository;
import com.aircore.request.LeaveRequestDTO;
import com.aircore.response.LeaveRequestResponse;
import com.aircore.utility.Enumeration.LeaveStatus;
import com.aircore.utility.Enumeration.LeaveType;

@Service
public class LeaveRequestService {

	@Autowired
	private LeaveRequestRepository leaveRequestRepository;

	public LeaveRequest createLeaveRequest(LeaveRequestDTO leaveRequestDTO, Long userId) {
		LeaveRequest leaveRequest = new LeaveRequest();

		// Map fields from DTO
		leaveRequest.setUserId(userId);
		leaveRequest.setStartDate(leaveRequestDTO.getFromDate());
		leaveRequest.setEndDate(leaveRequestDTO.getToDate());
		leaveRequest.setLeaveType(LeaveType.valueOf(leaveRequestDTO.getLeaveType()));
		leaveRequest.setDescription(leaveRequestDTO.getNote());

		// Default status
		leaveRequest.setLeaveStatus(LeaveStatus.PENDING);

		// Save to database
		return leaveRequestRepository.save(leaveRequest);
	}
	
	public Page<LeaveRequestResponse> getFilteredLeaveRequests(
	        String keyword,
	        LocalDate startDate,
	        LocalDate endDate,
	        LeaveType leaveType,
	        LeaveStatus leaveStatus,
	        Pageable pageable) {

	    Date startDateFilter = (startDate != null) ? java.sql.Date.valueOf(startDate) : null;
	    Date endDateFilter = (endDate != null) ? java.sql.Date.valueOf(endDate) : null;

	    return leaveRequestRepository.findFilteredLeaveRequests(
	            keyword != null ? "%" + keyword + "%" : null,
	            startDateFilter,
	            endDateFilter,
	            leaveType,
	            leaveStatus,
	            pageable
	    );
	}


}
