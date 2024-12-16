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

		LeaveRequest leaveRequest = new LeaveRequest();
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

	@Transactional
	public LeaveRequest updateLeaveRequest(Long leaveRequestId, LeaveRequestDTO leaveRequestDTO, Long userId) {
	    LeaveRequest existingRequest = leaveRequestRepository.findById(leaveRequestId)
	            .orElseThrow(() -> new RuntimeException("Leave request not found"));

	    if (!existingRequest.getUserId().equals(userId)) {
	        throw new RuntimeException("Unauthorized action");
	    }

	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    long previousDaysRequested = ChronoUnit.DAYS.between(
	            existingRequest.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
	            existingRequest.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()) + 1;

	    long newDaysRequested = ChronoUnit.DAYS.between(
	            leaveRequestDTO.getFromDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
	            leaveRequestDTO.getToDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()) + 1;

	    double leaveBalanceAdjustment = 0;

	    if (LeaveType.PRIVILEGE_LEAVE.name().equals(leaveRequestDTO.getLeaveType())) {
	        if (leaveRequestDTO.getApplyFor() != null) {
	            if (AplyType.FULL_DAY.name().equals(leaveRequestDTO.getApplyFor())) {
	                if (AplyType.FIRST_HALF.equals(existingRequest.getApplyType()) || AplyType.SECOND_HALF.equals(existingRequest.getApplyType())) {
	                    leaveBalanceAdjustment = (newDaysRequested - previousDaysRequested) + 0.5;
	                } else {
	                    leaveBalanceAdjustment = newDaysRequested - previousDaysRequested;
	                }
	            } else if (AplyType.FIRST_HALF.name().equals(leaveRequestDTO.getApplyFor()) || AplyType.SECOND_HALF.name().equals(leaveRequestDTO.getApplyFor())) {
	                if (AplyType.FULL_DAY.equals(existingRequest.getApplyType())) {
	                    leaveBalanceAdjustment = (newDaysRequested - previousDaysRequested) - 0.5;
	                } else if (newDaysRequested < previousDaysRequested) {
	                    leaveBalanceAdjustment = -1 * (previousDaysRequested - newDaysRequested) - 0.5;
	                } else {
	                    leaveBalanceAdjustment = newDaysRequested - previousDaysRequested;
	                }
	            }

	            if (leaveBalanceAdjustment > 0 && user.getTotalLeave() < leaveBalanceAdjustment) {
	                throw new RuntimeException("Insufficient leave balance to update the request");
	            }

	            user.setTotalLeave(user.getTotalLeave() - leaveBalanceAdjustment);
	            userRepository.save(user);

	        } else {
	            leaveBalanceAdjustment = newDaysRequested - previousDaysRequested;

	            if (leaveBalanceAdjustment > 0 && user.getTotalLeave() < leaveBalanceAdjustment) {
	                throw new RuntimeException("Insufficient leave balance to update the request");
	            }

	            user.setTotalLeave(user.getTotalLeave() - leaveBalanceAdjustment);
	            userRepository.save(user);
	        }
	    }

	    // Update existing leave request details
	    existingRequest.setStartDate(leaveRequestDTO.getFromDate());
	    existingRequest.setEndDate(leaveRequestDTO.getToDate());
	    existingRequest.setLeaveType(LeaveType.valueOf(leaveRequestDTO.getLeaveType()));
	    existingRequest.setDescription(leaveRequestDTO.getNote());

	    if (leaveRequestDTO.getApplyFor() != null) {
	        existingRequest.setApplyType(AplyType.valueOf(leaveRequestDTO.getApplyFor()));
	    }

	    return leaveRequestRepository.save(existingRequest);
	}
	
	public Page<LeaveRequestResponse> getFilteredLeaveRequests(String keyword, LocalDate startDate, LocalDate endDate,
			LeaveType leaveType, LeaveStatus leaveStatus, Pageable pageable) {

		Date startDateFilter = (startDate != null) ? java.sql.Date.valueOf(startDate) : null;
		Date endDateFilter = (endDate != null) ? java.sql.Date.valueOf(endDate) : null;

		return leaveRequestRepository.findFilteredLeaveRequests(keyword != null ? "%" + keyword + "%" : null,
				startDateFilter, endDateFilter, leaveType, leaveStatus, pageable);
	}
	
	@Transactional
	public void cancelLeaveRequest(Long leaveRequestId, Long userId) {
	    LeaveRequest existingRequest = leaveRequestRepository.findById(leaveRequestId)
	            .orElseThrow(() -> new RuntimeException("Leave request not found"));

	    if (!existingRequest.getUserId().equals(userId)) {
	        throw new RuntimeException("Unauthorized action");
	    }

	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if (LeaveType.PRIVILEGE_LEAVE.equals(existingRequest.getLeaveType())) {
	        long daysRequested = ChronoUnit.DAYS.between(
	                existingRequest.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate(),
	                existingRequest.getEndDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate()) + 1;

	        if (AplyType.FIRST_HALF.equals(existingRequest.getApplyType()) || AplyType.SECOND_HALF.equals(existingRequest.getApplyType())) {
	            user.setTotalLeave(user.getTotalLeave() + 0.5);
	        } else {
	            user.setTotalLeave(user.getTotalLeave() + daysRequested);
	        }

	        userRepository.save(user);
	    }

	    leaveRequestRepository.delete(existingRequest);
	}

}
