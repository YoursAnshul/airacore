package com.aircore.entity;

import java.util.Date;

import com.aircore.utility.Enumeration.LeaveStatus;
import com.aircore.utility.Enumeration.LeaveType;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class LeaveRequest {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private Long userId;
	private Date startDate;
	private Date endDate;
	@Enumerated(EnumType.STRING)
	private LeaveType leaveType;
	@Enumerated(EnumType.STRING)
	private LeaveStatus leaveStatus;
	private Long approvedBy;
	private String description;
	private String rejectReason;
	
	
}
