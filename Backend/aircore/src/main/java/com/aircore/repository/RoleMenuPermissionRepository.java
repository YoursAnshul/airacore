package com.aircore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aircore.entity.Role;
import com.aircore.entity.RoleMenuPermission;

public interface RoleMenuPermissionRepository extends JpaRepository<RoleMenuPermission, Long>{

	void deleteAllByRole(Role role);

	void deleteByRoleId(Long roleId);

}
