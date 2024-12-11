package com.aircore.repository;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aircore.entity.LoginLogoutLogsDetails;
import com.aircore.response.LoginLogoutLogsDetailsResponse;

@Repository
public interface LoginLogoutLogsDetailsRepository extends JpaRepository<LoginLogoutLogsDetails, Long> {

	Optional<LoginLogoutLogsDetails> findTopByLoginLogoutLogsIdOrderByCreatedAtDesc(Long loginLogoutLogsId);

	@Query("SELECT new com.aircore.response.LoginLogoutLogsDetailsResponse("
			+ "lld.loginTime, lld.logoutTime, lld.description) " + "FROM LoginLogoutLogsDetails lld "
			+ "JOIN lld.loginLogoutLogs ll " + "WHERE ll.id = :loginLogoutLogsId "
			+ "AND (:dateFrom IS NULL OR lld.loginTime >= :dateFrom) "
			+ "AND (:dateTo IS NULL OR lld.logoutTime <= :dateTo) " + "ORDER BY lld.loginTime DESC")
	Page<LoginLogoutLogsDetailsResponse> findLoginLogoutDetailsByLogsId(
			@Param("loginLogoutLogsId") Long loginLogoutLogsId, @Param("dateFrom") LocalDate dateFrom,
			@Param("dateTo") LocalDate dateTo, Pageable pageable);

}
