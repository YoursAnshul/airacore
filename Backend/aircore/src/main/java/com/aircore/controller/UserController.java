package com.aircore.controller;

import java.util.Map;

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

import com.aircore.entity.Role;
import com.aircore.request.RoleRequest;
import com.aircore.response.AppResponse;
import com.aircore.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    
    @Autowired
    private UserService userSerivce;

    @GetMapping("/me")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String authHeader) {
        try {
            Map<String, Object> response = userSerivce.getUserDetails(authHeader);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/add/role")
    public ResponseEntity<AppResponse<?>> addRole(@RequestBody RoleRequest roleDto) {
        try {
            Role role = userSerivce.createRole(roleDto);
            return ResponseEntity.ok(
                new AppResponse<>(true, "Role created successfully", 200, role, null)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                new AppResponse<>(false, "Invalid input", 400, null, e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                new AppResponse<>(false, "Internal Server Error", 500, null, e.getMessage())
            );
        }
    }

    @PutMapping("/update/role/{id}")
    public ResponseEntity<AppResponse<?>> updateRole(@PathVariable Long id, @RequestBody RoleRequest roleDto) {
        try {
            userSerivce.updateRole(id, roleDto);
            return ResponseEntity.ok(
                new AppResponse<>(true, "Role updated successfully", 200, null, null)
            );
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                new AppResponse<>(false, "Invalid input", 400, null, e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                new AppResponse<>(false, "Internal Server Error", 500, null, e.getMessage())
            );
        }
    }
   


}

