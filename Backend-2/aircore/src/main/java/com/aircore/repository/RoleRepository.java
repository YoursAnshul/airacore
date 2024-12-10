package com.aircore.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aircore.entity.Role;
import com.aircore.entity.RoleMenuPermission;
import com.aircore.response.RoleResponse;
import com.aircore.utility.Enumeration.Status;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

	Optional<Role> findByName(String name);

	@Query("SELECT r FROM Role r WHERE r.status = :status AND (:keyword IS NULL OR LOWER(r.name) LIKE LOWER(:keyword))")
	Page<RoleResponse> findByStatusAndNameLike(@Param("status") Status status, @Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT r FROM Role r JOIN FETCH r.menus m WHERE r.id = :roleId")
    Role findByIdWithMenus(@Param("roleId") Long roleId);
    
    boolean existsByNameAndStatus(String name, Status status);
    
    List<Role> findByStatus(Status status);

    boolean existsByNameAndIdNot(String name, Long id);

    @Query("SELECT rmp FROM RoleMenuPermission rmp WHERE rmp.role.id = :roleId")
    Set<RoleMenuPermission> findByRoleId(@Param("roleId") Long roleId);

}
