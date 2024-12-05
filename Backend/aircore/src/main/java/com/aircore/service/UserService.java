package com.aircore.service;

import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
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
import com.aircore.request.RoleRequest;
import com.aircore.response.RoleDetailsResponse;
import com.aircore.response.RoleResponse;
import com.aircore.response.UserResponse;
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
        response.put("first_name", user.getFirstName());
        response.put("last_name", user.getLastName());
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
	
    public Page<UserResponse> getActiveUsers(Pageable pageable) {
        return userRepository.findByStatus(pageable);
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
        response.setUpdatedAt(role.getCreatedDate());

        List<RoleDetailsResponse.MenuDetails> menuDetails = role.getRoleMenuPermissions().stream().map(rmp -> {
            RoleDetailsResponse.MenuDetails menu = response.new MenuDetails();
            menu.setId(rmp.getMenu().getId());
            menu.setName(rmp.getMenu().getName());
            menu.setIsCreate(rmp.getPermission().getIsCreate());
            menu.setIsRead(rmp.getPermission().getIsRead());
            menu.setIsUpdate(rmp.getPermission().getIsUpdate());
            menu.setIsDelete(rmp.getPermission().getIsDelete());
            menu.setStatus(rmp.getMenu().getStatus().name());
            menu.setCreatedAt(rmp.getMenu().getCreatedAt());
            menu.setUpdatedAt(rmp.getMenu().getUpdatedAt());
            return menu;
        }).collect(Collectors.toList());

        response.setMenus(menuDetails);

        return response;
    }


    @Transactional
    public Role addRole(RoleRequest roleRequest) {
        Role role = new Role();
        role.setName(roleRequest.getName());
        role.setStatus(Status.ACTIVE);
        role.setCreatedDate(new Date());

        if (roleRepository.existsByName(roleRequest.getName())) {
            throw new RuntimeException("Role name '" + roleRequest.getName() + "' already exists");
        }
        
        Role savedRole = roleRepository.save(role);

        HashSet<Menu> menus = new HashSet<>();
        for (MenuRequest menuRequest : roleRequest.getMenus()) {
            Menu menu = menuRepository.findByName(menuRequest.getName())
                    .orElseThrow(() -> new RuntimeException("Menu not found: " + menuRequest.getName()));

            menus.add(menu);
            Permission permission = new Permission();
            permission.setIsCreate(menuRequest.getIsCreate());
            permission.setIsRead(menuRequest.getIsRead());
            permission.setIsUpdate(menuRequest.getIsUpdate());
            permission.setIsDelete(menuRequest.getIsDelete());
            permission.setStatus(Status.ACTIVE);
            permission.setCreatedAt(new Date());
            permission.setUpdatedAt(new Date());
            Permission savedPermission = permissionRepository.save(permission);

            RoleMenuPermission roleMenuPermission = new RoleMenuPermission();
            roleMenuPermission.setRole(savedRole);
            roleMenuPermission.setMenu(menu);
            roleMenuPermission.setPermission(savedPermission);

            roleMenuPermissionRepository.save(roleMenuPermission);
        }

        savedRole.setMenus(menus);
        roleRepository.save(savedRole);
        return savedRole;
    }

    
}
