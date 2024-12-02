package com.aircore.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.aircore.configuration.JwtUtil;
import com.aircore.entity.Role;
import com.aircore.entity.User;
import com.aircore.repository.MenuRepository;
import com.aircore.repository.PermissionRepository;
import com.aircore.repository.RoleMenuPermissionRepository;
import com.aircore.repository.RoleRepository;
import com.aircore.repository.UserRepository;
import com.aircore.request.RoleRequest;
import com.aircore.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private UserService userSerivce;
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private RoleMenuPermissionRepository roleMenuPermissionRepository;
    
    @Autowired
    private MenuRepository menuRepository;
    
    @Autowired
    private PermissionRepository permissionRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String username = jwtUtil.extractUsername(token);

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());

            List<Map<String, Object>> rolesWithMenus = user.getRoles().stream().map(role -> {
                Map<String, Object> roleDetails = new HashMap<>();
                roleDetails.put("roleId", role.getId());
                roleDetails.put("roleName", role.getName());

                List<Map<String, Object>> menusWithPermissions = role.getRoleMenuPermissions().stream().map(rmp -> {
                    Map<String, Object> menuDetails = new HashMap<>();
                    menuDetails.put("menuId", rmp.getMenu().getId());
                    menuDetails.put("menuName", rmp.getMenu().getName());
                    menuDetails.put("permission", rmp.getPermission().getName().name());
                    return menuDetails;
                }).collect(Collectors.toList());

                roleDetails.put("menus", menusWithPermissions);

                return roleDetails;
            }).collect(Collectors.toList());

            response.put("roles", rolesWithMenus);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/add/role")
    public ResponseEntity<?> addRole(@RequestBody RoleRequest roleDto) {
        try {
            Role role = userSerivce.createRole(roleDto);
            return ResponseEntity.ok("Role created successfully with ID: " + role.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    @PutMapping("/update/role/{id}")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody RoleRequest roleDto) {
        try {
            Role role = userSerivce.updateRole(id, roleDto);
            return ResponseEntity.ok("Role updated successfully with ID: " + role.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }


}

