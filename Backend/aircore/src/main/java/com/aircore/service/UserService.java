package com.aircore.service;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.aircore.configuration.JwtUtil;
import com.aircore.entity.Menu;
import com.aircore.entity.Permission;
import com.aircore.entity.Role;
import com.aircore.entity.RoleMenuPermission;
import com.aircore.entity.User;
import com.aircore.repository.MenuRepository;
import com.aircore.repository.PermissionRepository;
import com.aircore.repository.RoleMenuPermissionRepository;
import com.aircore.repository.RoleRepository;
import com.aircore.repository.UserRepository;
import com.aircore.request.MenuRequest;
import com.aircore.request.RoleMenuPermissionRequest;
import com.aircore.request.RoleRequest;
import com.aircore.response.RoleDetailsResponse;
import com.aircore.response.RoleResponse;
import com.aircore.utility.Enumeration.Status;

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
    
    @Autowired
    private UserRepository userRepository;
	
    @Autowired
    private JwtUtil jwtUtil;
    
    public Map<String, Object> getUserDetails(String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String username = jwtUtil.extractUsername(token);

        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("first_name", user.getFirst_name());
        response.put("last_name", user.getLast_name());
        response.put("email", user.getEmail());

        List<Map<String, Object>> rolesWithMenus = user.getRoles().stream().map(role -> {
            Map<String, Object> roleDetails = new HashMap<>();
            roleDetails.put("roleId", role.getId());
            roleDetails.put("roleName", role.getName());

            List<Map<String, Object>> menusWithPermissions = role.getRoleMenuPermissions().stream().map(rmp -> {
                Map<String, Object> menuDetails = new HashMap<>();
                menuDetails.put("menuId", rmp.getMenu().getId());
                menuDetails.put("menuName", rmp.getMenu().getName());
//                menuDetails.put("permission", rmp.getPermission().getName().name());
                return menuDetails;
            }).collect(Collectors.toList());

            roleDetails.put("menus", menusWithPermissions);

            return roleDetails;
        }).collect(Collectors.toList());

        response.put("roles", rolesWithMenus);

        return response;
    }

//    public Role createRole(RoleRequest roleDto) {
//        if (roleRepository.findByName(roleDto.getName()).isPresent()) {
//            throw new IllegalArgumentException("Role with this name already exists");
//        }
//
//        Role role = new Role();
//        role.setName(roleDto.getName());
////        role.setStatus(roleDto.getStatus());
//        role.setCreatedDate(new Date());
//        roleRepository.save(role);
//
//        for (RoleMenuPermissionRequest rmpDto : roleDto.getRoleMenuPermissions()) {
//            Menu menu = menuRepository.findById(rmpDto.getMenuId())
//                .orElseThrow(() -> new IllegalArgumentException("Menu not found with ID: " + rmpDto.getMenuId()));
//            Permission permission = permissionRepository.findById(rmpDto.getPermissionId())
//                .orElseThrow(() -> new IllegalArgumentException("Permission not found with ID: " + rmpDto.getPermissionId()));
//
//            RoleMenuPermission roleMenuPermission = new RoleMenuPermission();
//            roleMenuPermission.setRole(role);
//            roleMenuPermission.setMenu(menu);
//            roleMenuPermission.setPermission(permission);
//
//            roleMenuPermissionRepository.save(roleMenuPermission);
//        }
//
//        return role;
//    }

//    @Transactional
//    public Role updateRole(Long roleId, RoleRequest roleDto) {
//        Role role = roleRepository.findById(roleId)
//            .orElseThrow(() -> new IllegalArgumentException("Role not found with ID: " + roleId));
//
//        role.setName(roleDto.getName());
////        role.setStatus(roleDto.getStatus());
//        roleRepository.save(role);
//
//        roleMenuPermissionRepository.deleteByRoleId(roleId);
//        for (RoleMenuPermissionRequest rmpDto : roleDto.getRoleMenuPermissions()) {
//            Menu menu = menuRepository.findById(rmpDto.getMenuId())
//                .orElseThrow(() -> new IllegalArgumentException("Menu not found with ID: " + rmpDto.getMenuId()));
//            Permission permission = permissionRepository.findById(rmpDto.getPermissionId())
//                .orElseThrow(() -> new IllegalArgumentException("Permission not found with ID: " + rmpDto.getPermissionId()));
//
//            RoleMenuPermission roleMenuPermission = new RoleMenuPermission();
//            roleMenuPermission.setRole(role);
//            roleMenuPermission.setMenu(menu);
//            roleMenuPermission.setPermission(permission);
//
//            roleMenuPermissionRepository.save(roleMenuPermission);
//        }
//
//        return role;
//    }
    
    public Page<RoleResponse> getActiveRoles(Pageable pageable) {
        return roleRepository.findByStatus(Status.ACTIVE, pageable);
    }
	
    public RoleDetailsResponse getRoleDetails(Long roleId) {
        Role role = roleRepository.findByIdWithMenus(roleId);

        if (role == null) {
            throw new IllegalArgumentException("Role not found with ID: " + roleId);
        }

        RoleDetailsResponse response = new RoleDetailsResponse();
        response.setId(role.getId());
        response.setName(role.getName());
        response.setStatus(role.getStatus().name());
        response.setCreatedAt(role.getCreatedDate());
        response.setUpdatedAt(role.getCreatedDate()); // Assuming no separate updated field in Role

        List<RoleDetailsResponse.MenuDetails> menuDetails = role.getRoleMenuPermissions().stream().map(rmp -> {
            RoleDetailsResponse.MenuDetails menu = response.new MenuDetails(); // Instantiate non-static inner class
            menu.setId(rmp.getMenu().getId());
            menu.setName(rmp.getMenu().getName());
            menu.setIsCreate(rmp.getPermission().getIsCreate());
            menu.setIsRead(rmp.getPermission().getIsRead());
            menu.setIsUpdate(rmp.getPermission().getIsUpdate());
            menu.setIsDelete(rmp.getPermission().getIsDelete());
            menu.setIsAll(rmp.getPermission().getIsCreate() && rmp.getPermission().getIsRead() &&
                          rmp.getPermission().getIsUpdate() && rmp.getPermission().getIsDelete());
            menu.setStatus(rmp.getMenu().getStatus().name());
            menu.setCreatedAt(rmp.getMenu().getCreatedAt());
            menu.setUpdatedAt(rmp.getMenu().getUpdatedAt());
            return menu;
        }).collect(Collectors.toList());

        response.setMenus(menuDetails);

        return response;
    }


    public Role addRole(RoleRequest roleRequest) {
        // Step 1: Create and save the role
        Role role = new Role();
        role.setName(roleRequest.getName());
        role.setStatus(Status.ACTIVE); // Example status, adjust as needed
        role.setCreatedDate(new Date());
        Role savedRole = roleRepository.save(role);

        // Step 2: Process the menus and permissions
        Set<Menu> savedMenus = new HashSet<>();
        Set<RoleMenuPermission> roleMenuPermissions = new HashSet<>();
        
        for (MenuRequest menuRequest : roleRequest.getMenus()) {
            // Step 2a: Save the menu entity
            Menu menu = new Menu();
            menu.setName(menuRequest.getName());
            menu.setCreatedAt(new Date());
            menu.setUpdatedAt(new Date());
            menu.setStatus(Status.ACTIVE);  // Example status, adjust as needed
            Menu savedMenu = menuRepository.save(menu);

            // Step 2b: Save the permission entity
            Permission permission = new Permission();
            permission.setIsCreate(menuRequest.isCreate());
            permission.setIsRead(menuRequest.isRead());
            permission.setIsUpdate(menuRequest.isUpdate());
            permission.setIsDelete(menuRequest.isDelete());
            permission.setStatus(Status.ACTIVE);
            permission.setCreatedAt(new Date());
            permission.setUpdatedAt(new Date());
            Permission savedPermission = permissionRepository.save(permission);

            // Step 2c: Create RoleMenuPermission
            RoleMenuPermission roleMenuPermission = new RoleMenuPermission();
            roleMenuPermission.setRole(savedRole);
            roleMenuPermission.setMenu(savedMenu);
            roleMenuPermission.setPermission(savedPermission);
            roleMenuPermissionRepository.save(roleMenuPermission);

            // Step 2d: Add to the collections
            savedMenus.add(savedMenu);
            roleMenuPermissions.add(roleMenuPermission);
        }

        // Step 3: Set menus and permissions to the saved role
        savedRole.setMenus(savedMenus);
        savedRole.setRoleMenuPermissions(roleMenuPermissions);

        // Step 4: Save the role with the associated entities
        return roleRepository.save(savedRole); // Save the role again to persist the relationships
    }
    
}
