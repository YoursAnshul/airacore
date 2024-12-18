package com.aircore.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.aircore.entity.LeaveRequest;
import com.aircore.entity.Role;
import com.aircore.entity.User;
import com.aircore.repository.LeaveRequestRepository;
import com.aircore.repository.RoleRepository;
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

	@Autowired
	private RoleRepository roleRepository;
	
	@Transactional
	public LeaveRequest createLeaveRequest(LeaveRequestDTO leaveRequestDTO, Long userId) {
		User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		long daysRequested = leaveRequestDTO.getAppliedDays();

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
		leaveRequest.setAppliedDays(leaveRequestDTO.getAppliedDays());
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
	    
	    if(existingRequest.getLeaveStatus().equals(LeaveStatus.CANCELLED)) {
	    	throw new RuntimeException("Leave Already cancelled can not update");
	    }
	    
	    LocalDate today = LocalDate.now(); 
	    LocalDate leaveStartDate = existingRequest.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	    if (leaveStartDate.isBefore(today)) {
	        throw new RuntimeException("Cannot Update leave for past dates");
	    }
	    
	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    long previousDaysRequested = existingRequest.getAppliedDays();
	    long newDaysRequested = leaveRequestDTO.getAppliedDays();

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
        existingRequest.setAppliedDays(leaveRequestDTO.getAppliedDays());
	    if (leaveRequestDTO.getApplyFor() != null) {
	        existingRequest.setApplyType(AplyType.valueOf(leaveRequestDTO.getApplyFor()));
	    }
	    
	    if(existingRequest.getLeaveStatus().equals(LeaveStatus.APPROVED)) {
	    	existingRequest.setLeaveStatus(LeaveStatus.PENDING);
	    }

	    return leaveRequestRepository.save(existingRequest);
	}
	
	public Page<LeaveRequestResponse> getFilteredLeaveRequests(String keyword, LocalDate startDate, LocalDate endDate,
			LeaveType leaveType, LeaveStatus leaveStatus, Long userId, Pageable pageable) {

		Date startDateFilter = (startDate != null) ? java.sql.Date.valueOf(startDate) : null;
		Date endDateFilter = (endDate != null) ? java.sql.Date.valueOf(endDate) : null;

		User user = userRepository.findById(userId)
		            .orElseThrow(() -> new RuntimeException("User not found"));
		 
		Optional<Role> roleOPT = roleRepository.findById(user.getRole());
		if(roleOPT.isPresent()) {
			Role role = roleOPT.get();
			if(role.getName().equals("MANAGER")) {
				return leaveRequestRepository.findFilteredLeaveRequests(keyword != null ? "%" + keyword + "%" : null,
						startDateFilter, endDateFilter, leaveType, leaveStatus, userId, pageable);
			}
		}
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

	    LocalDate today = LocalDate.now(); 
	    LocalDate leaveStartDate = existingRequest.getStartDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
	    if (leaveStartDate.isBefore(today)) {
	        throw new RuntimeException("Cannot cancel leave for past dates");
	    }
	    
	    User user = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if (LeaveType.PRIVILEGE_LEAVE.equals(existingRequest.getLeaveType())) {
	        long daysRequested = existingRequest.getAppliedDays();

	        if (AplyType.FIRST_HALF.equals(existingRequest.getApplyType()) || AplyType.SECOND_HALF.equals(existingRequest.getApplyType())) {
	            user.setTotalLeave(user.getTotalLeave() + 0.5);
	        } else {
	            user.setTotalLeave(user.getTotalLeave() + daysRequested);
	        }

	        userRepository.save(user);
	    }

	    existingRequest.setLeaveStatus(LeaveStatus.CANCELLED);
	    leaveRequestRepository.save(existingRequest);
	}
	

    @Transactional
    public void rejectLeaveRequest(Long leaveId, Long userId, String rejectReason) {
    	LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
    	
    	leaveRequest.setLeaveStatus(LeaveStatus.REJECTED);
        leaveRequest.setRejectReason(rejectReason);
        leaveRequest.setUpdatedDate(new Date());
        leaveRequest.setApprovedBy(userId);
        
        User user = userRepository.findById(leaveRequest.getUserId())
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if (LeaveType.PRIVILEGE_LEAVE.equals(leaveRequest.getLeaveType())) {
	        long daysRequested = leaveRequest.getAppliedDays();

	        if (AplyType.FIRST_HALF.equals(leaveRequest.getApplyType()) || AplyType.SECOND_HALF.equals(leaveRequest.getApplyType())) {
	            user.setTotalLeave(user.getTotalLeave() + 0.5);
	        } else {
	            user.setTotalLeave(user.getTotalLeave() + daysRequested);
	        }

	        userRepository.save(user);
	    }
    
        leaveRequestRepository.save(leaveRequest);
    }

	public void approveLeaveRequest(Long leaveRequestId, Long userId) {
		LeaveRequest leaveRequest = leaveRequestRepository.findById(leaveRequestId)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
		
		User approver = userRepository.findById(userId)
	            .orElseThrow(() -> new RuntimeException("Approver User not found"));
		
		User requestedBy = userRepository.findById(leaveRequest.getUserId())
	            .orElseThrow(() -> new RuntimeException("Requested User not found"));
		
		leaveRequest.setApprovedBy(userId);
		Optional<Role> roleOPT = roleRepository.findById(approver.getRole());
		if(roleOPT.isPresent()) {
			if(requestedBy.getTwoLevelLeaveApprove() != null && requestedBy.getTwoLevelLeaveApprove().equalsIgnoreCase("YES")) {
				if(approver.getId() != requestedBy.getReporting_manager() && leaveRequest.getLeaveStatus().equals(LeaveStatus.PARTIALLY_APPROVED)) {
					leaveRequest.setLeaveStatus(LeaveStatus.APPROVED);
					leaveRequestRepository.save(leaveRequest);
				} else if (approver.getId() == requestedBy.getReporting_manager()) {
					leaveRequest.setLeaveStatus(LeaveStatus.PARTIALLY_APPROVED);
					leaveRequestRepository.save(leaveRequest);
				} else {
					throw new RuntimeException("Leave Request is not partially approved");
				}
			} else {
				leaveRequest.setLeaveStatus(LeaveStatus.APPROVED);
			}
		}
	}

	public Page<LeaveRequestResponse> getFilteredLeaveRequestsUser(String keyword, LocalDate startDate,
			LocalDate endDate, LeaveType leaveType, LeaveStatus leaveStatus, Long userId, PageRequest pageable) {
		
		Date startDateFilter = (startDate != null) ? java.sql.Date.valueOf(startDate) : null;
		Date endDateFilter = (endDate != null) ? java.sql.Date.valueOf(endDate) : null;

		return leaveRequestRepository.findFilteredLeaveRequestsUsers(keyword != null ? "%" + keyword + "%" : null,
				startDateFilter, endDateFilter, leaveType, leaveStatus, userId, pageable);
	}
	

}
