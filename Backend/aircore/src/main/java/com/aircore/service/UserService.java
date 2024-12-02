package com.aircore.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aircore.entity.Menu;
import com.aircore.entity.Permission;
import com.aircore.entity.Role;
import com.aircore.entity.RoleMenuPermission;
import com.aircore.repository.MenuRepository;
import com.aircore.repository.PermissionRepository;
import com.aircore.repository.RoleMenuPermissionRepository;
import com.aircore.repository.RoleRepository;
import com.aircore.request.RoleMenuPermissionRequest;
import com.aircore.request.RoleRequest;

import jakarta.transaction.Transactional;

@Service
public class UserService {

	@Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RoleMenuPermissionRepository roleMenuPermissionRepository;
    
    @Autowired
    private MenuRepository menuRepository;
    
    @Autowired
    private PermissionRepository permissionRepository;
	

    public Role createRole(RoleRequest roleDto) {
        // Check if the role already exists
        if (roleRepository.findByName(roleDto.getName()).isPresent()) {
            throw new IllegalArgumentException("Role with this name already exists");
        }

        // Create the Role
        Role role = new Role();
        role.setName(roleDto.getName());
        role.setStatus(roleDto.getStatus());
        role.setCreatedDate(new Date());
        roleRepository.save(role);

        // Assign menus and permissions
        for (RoleMenuPermissionRequest rmpDto : roleDto.getRoleMenuPermissions()) {
            Menu menu = menuRepository.findById(rmpDto.getMenuId())
                .orElseThrow(() -> new IllegalArgumentException("Menu not found with ID: " + rmpDto.getMenuId()));
            Permission permission = permissionRepository.findById(rmpDto.getPermissionId())
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with ID: " + rmpDto.getPermissionId()));

            RoleMenuPermission roleMenuPermission = new RoleMenuPermission();
            roleMenuPermission.setRole(role);
            roleMenuPermission.setMenu(menu);
            roleMenuPermission.setPermission(permission);

            roleMenuPermissionRepository.save(roleMenuPermission);
        }

        return role;
    }

    @Transactional
    public Role updateRole(Long roleId, RoleRequest roleDto) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + roleId));

        // Update role details
        role.setName(roleDto.getName());
        role.setStatus(roleDto.getStatus());
        roleRepository.save(role);

        // Clear existing RoleMenuPermissions and add new ones
        roleMenuPermissionRepository.deleteByRoleId(roleId);

        for (RoleMenuPermissionRequest rmpDto : roleDto.getRoleMenuPermissions()) {
            Menu menu = menuRepository.findById(rmpDto.getMenuId())
                .orElseThrow(() -> new IllegalArgumentException("Menu not found with ID: " + rmpDto.getMenuId()));
            Permission permission = permissionRepository.findById(rmpDto.getPermissionId())
                .orElseThrow(() -> new IllegalArgumentException("Permission not found with ID: " + rmpDto.getPermissionId()));

            RoleMenuPermission roleMenuPermission = new RoleMenuPermission();
            roleMenuPermission.setRole(role);
            roleMenuPermission.setMenu(menu);
            roleMenuPermission.setPermission(permission);

            roleMenuPermissionRepository.save(roleMenuPermission);
        }

        return role;
    }
	
}
