package com.aircore.repository;

import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aircore.entity.Menu;
import com.aircore.entity.Role;
import com.aircore.entity.RoleMenuPermission;

public interface RoleMenuPermissionRepository extends JpaRepository<RoleMenuPermission, Long>{

	void deleteAllByRole(Role role);

	void deleteByRoleId(Long roleId);

	Set<RoleMenuPermission> findByRoleId(Long roleId);

	void deleteByRoleAndMenu(Role role, Menu menu);

}
