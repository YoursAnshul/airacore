package com.aircore.repository;

import java.util.Date;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aircore.entity.LoginLogoutLogs;
import com.aircore.response.LoginLogoutLogsResponse;
import com.aircore.utility.Enumeration.LoginType;

@Repository
public interface LoginLogoutLogsRepository extends JpaRepository<LoginLogoutLogs, Long> {

	Optional<LoginLogoutLogs> findByUserIdAndDate(Long userId, Date date);

	LoginLogoutLogs findTopByUserIdOrderByCreatedAtDesc(Long userId);

	@Query("SELECT new com.aircore.response.LoginLogoutLogsResponse ("
			+ "l.id, concat(u.firstName, ' ', u.lastName), l.currentStatus, l.loginTime, l.logoutTime, l.date, l.loginType, l.description ) "
			+ "FROM LoginLogoutLogs l " + "JOIN User u ON l.userId = u.id "
			+ "WHERE (:userId IS NULL OR l.userId = :userId) " + "AND (:loginType IS NULL OR l.loginType = :loginType) "
			+ "AND (:dateFrom IS NULL OR l.date >= :dateFrom) " + "AND (:dateTo IS NULL OR l.date <= :dateTo) "
			+ "AND (:combinationOfFirstNameAndLastName IS NULL OR CONCAT(u.firstName, ' ', u.lastName) LIKE %:combinationOfFirstNameAndLastName%) "
			+ "ORDER BY l.date DESC")
	Page<LoginLogoutLogsResponse> findFilteredLogs(@Param("userId") Long userId,
			@Param("loginType") LoginType loginType, @Param("dateFrom") Date dateFrom, @Param("dateTo") Date dateTo,
			@Param("combinationOfFirstNameAndLastName") String combinationOfFirstNameAndLastName, Pageable pageable);

}
