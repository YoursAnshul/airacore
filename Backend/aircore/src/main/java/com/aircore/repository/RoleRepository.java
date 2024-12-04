package com.aircore.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.aircore.entity.Role;
import com.aircore.response.RoleResponse;
import com.aircore.utility.Enumeration.Status;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

	Optional<Role> findByName(String name);

    Page<RoleResponse> findByStatus(Status status, Pageable pageable);

    @Query("SELECT r FROM Role r JOIN FETCH r.menus m WHERE r.id = :roleId")
    Role findByIdWithMenus(@Param("roleId") Long roleId);
    
}
