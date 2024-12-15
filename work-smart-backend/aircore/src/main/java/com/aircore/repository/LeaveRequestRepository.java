package com.aircore.repository;

import java.util.Date;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aircore.entity.LeaveRequest;
import com.aircore.response.LeaveRequestResponse;
import com.aircore.utility.Enumeration.LeaveStatus;
import com.aircore.utility.Enumeration.LeaveType;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

	@Query("SELECT new com.aircore.response.LeaveRequestResponse(" +
	        "lr.id, " +
	        "CONCAT(u.firstName, ' ', u.lastName) AS username, " +
	        "lr.startDate, " +
	        "lr.endDate, " +
	        "lr.leaveType, " +
	        "lr.leaveStatus, " +
	        "CONCAT(a.firstName, ' ', a.lastName) AS approvedByName, " +
	        "lr.description) " +
	        "FROM LeaveRequest lr " +
	        "JOIN User u ON lr.userId = u.id " +
	        "LEFT JOIN User a ON lr.approvedBy = a.id " +
	        "WHERE (:keyword IS NULL OR LOWER(lr.description) LIKE LOWER(:keyword)) " +
	        "AND (:startDate IS NULL OR lr.startDate >= :startDate) " +
	        "AND (:endDate IS NULL OR lr.endDate <= :endDate) " +
	        "AND (:leaveType IS NULL OR lr.leaveType = :leaveType) " +
	        "AND (:leaveStatus IS NULL OR lr.leaveStatus = :leaveStatus) " +
	        "ORDER BY lr.id DESC")
	Page<LeaveRequestResponse> findFilteredLeaveRequests(
	        @Param("keyword") String keyword,
	        @Param("startDate") Date startDate,
	        @Param("endDate") Date endDate,
	        @Param("leaveType") LeaveType leaveType,
	        @Param("leaveStatus") LeaveStatus leaveStatus,
	        Pageable pageable);


	
}

