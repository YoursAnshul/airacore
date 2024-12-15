package com.aircore.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.aircore.entity.LeaveRequest;
import com.aircore.entity.User;
import com.aircore.repository.LeaveRequestRepository;
import com.aircore.repository.UserRepository;
import com.aircore.request.LeaveRequestDTO;
import com.aircore.response.LeaveRequestResponse;
import com.aircore.utility.Enumeration.AplyType;
import com.aircore.utility.Enumeration.LeaveStatus;
import com.aircore.utility.Enumeration.LeaveType;

import jakarta.transaction.Transactional;

@Service
public class LeaveRequestService {

	@Autowired
	private LeaveRequestRepository leaveRequestRepository;

	@Autowired
	private UserRepository userRepository;

	@Transactional
	public LeaveRequest createLeaveRequest(LeaveRequestDTO leaveRequestDTO, Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		long daysRequested = ChronoUnit.DAYS.between(
				leaveRequestDTO.getFromDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
				leaveRequestDTO.getToDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()) + 1;

		System.out.println(leaveRequestDTO.getApplyFor());
		LeaveRequest leaveRequest = new LeaveRequest();
		System.out.println(LeaveType.UNPAID_LEAVE.name().equals(leaveRequestDTO.getLeaveType()));
		System.out.println(leaveRequestDTO.getLeaveType());
		if (LeaveType.PRIVILEGE_LEAVE.name().equals(leaveRequestDTO.getLeaveType())) {
			if (user.getTotalLeave() < daysRequested) {
				throw new RuntimeException("Insufficient leave balance");
			}

			if (leaveRequestDTO.getApplyFor() != null) {
				if (AplyType.FULL_DAY.name().equals(leaveRequestDTO.getApplyFor())) {
					user.setTotalLeave(user.getTotalLeave() - daysRequested);
					userRepository.save(user);
				} else {
					user.setTotalLeave(user.getTotalLeave() - 0.5);
					userRepository.save(user);
				}
				leaveRequest.setApplyType(AplyType.valueOf(leaveRequestDTO.getApplyFor()));
			} else {
				user.setTotalLeave(user.getTotalLeave() - daysRequested);
				userRepository.save(user);
			}

		}

		leaveRequest.setUserId(userId);
		leaveRequest.setStartDate(leaveRequestDTO.getFromDate());
		leaveRequest.setEndDate(leaveRequestDTO.getToDate());
		leaveRequest.setLeaveType(LeaveType.valueOf(leaveRequestDTO.getLeaveType()));
		leaveRequest.setDescription(leaveRequestDTO.getNote());

		leaveRequest.setLeaveStatus(LeaveStatus.PENDING);

		return leaveRequestRepository.save(leaveRequest);
	}

	public Page<LeaveRequestResponse> getFilteredLeaveRequests(String keyword, LocalDate startDate, LocalDate endDate,
			LeaveType leaveType, LeaveStatus leaveStatus, Pageable pageable) {

		Date startDateFilter = (startDate != null) ? java.sql.Date.valueOf(startDate) : null;
		Date endDateFilter = (endDate != null) ? java.sql.Date.valueOf(endDate) : null;

		System.out.println(startDateFilter + " " + endDateFilter);

		return leaveRequestRepository.findFilteredLeaveRequests(keyword != null ? "%" + keyword + "%" : null,
				startDateFilter, endDateFilter, leaveType, leaveStatus, pageable);
	}

}
