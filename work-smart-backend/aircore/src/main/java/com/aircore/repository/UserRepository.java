package com.aircore.repository;

import java.util.Date;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aircore.entity.User;
import com.aircore.response.UserResponse;
import com.aircore.utility.Enumeration.Status;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

	@Query("SELECT CASE WHEN COUNT(u) > 0 THEN TRUE ELSE FALSE END FROM User u WHERE u.email = :email AND u.status = :status")
	boolean existsByEmailAndStatus(@Param("email") String email, @Param("status") Status status);

	@Query("SELECT u FROM User u WHERE u.status = 'ACTIVE'")
	Page<UserResponse> findByStatus(Pageable pageable);

	@Query("SELECT u.id AS id, u.firstName AS firstName, u.lastName AS lastName, u.email AS email, "
			+ "u.mobileNumber AS mobileNumber, u.role AS role, r.name AS roleName, "
			+ "u.createdDate AS createdDate, u.status AS status " + "FROM User u " + "JOIN Role r ON u.role = r.id "
			+ "WHERE u.status = 'ACTIVE' "
			+ "AND (:keyword IS NULL OR LOWER(u.firstName) LIKE LOWER(:keyword) OR LOWER(u.lastName) LIKE LOWER(:keyword)) "
			+ "AND (:dateFrom IS NULL OR u.createdDate >= :dateFrom) "
			+ "AND (:dateTo IS NULL OR u.createdDate <= :dateTo)")
	Page<UserResponse> findFilteredUsers(@Param("keyword") String keyword, @Param("dateFrom") Date dateFrom,
			@Param("dateTo") Date dateTo, Pageable pageable);

	boolean existsByMobileNumber(String mobileNumber);

	@Query("SELECT COUNT(u) FROM User u WHERE u.createdDate >= :dateFrom AND u.createdDate <= :dateTo")
	Long countByCreatedDateBetween(@Param("dateFrom") Date dateFrom, @Param("dateTo") Date dateTo);

	@Query("SELECT COUNT(u) FROM User u WHERE u.status = :status AND u.createdDate >= :dateFrom AND u.createdDate <= :dateTo")
	Long countByStatusAndCreatedDateBetween(@Param("status") Status status, @Param("dateFrom") Date dateFrom,
			@Param("dateTo") Date dateTo);

	Optional<User> findByEmailAndStatus(String email, Status active);

}
