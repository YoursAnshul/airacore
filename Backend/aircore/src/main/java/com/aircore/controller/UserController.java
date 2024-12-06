package com.aircore.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aircore.entity.Role;
import com.aircore.entity.User;
import com.aircore.request.RoleRequest;
import com.aircore.request.UpdatePasswordRequest;
import com.aircore.response.AppResponse;
import com.aircore.response.PageableResponse;
import com.aircore.response.RoleDetailsResponse;
import com.aircore.response.RoleResponse;
import com.aircore.response.RoleResponseDropdown;
import com.aircore.response.UserResponse;
import com.aircore.service.UserService;
import com.aircore.utility.Constant;

import jakarta.persistence.EntityNotFoundException;

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

//	@PostMapping("/add/role")
//	public ResponseEntity<AppResponse<?>> addRole(@RequestBody RoleRequest roleDto) {
//		try {
//			Role role = userSerivce.createRole(roleDto);
//			return ResponseEntity.ok(new AppResponse<>(true, "Role created successfully", 200, role, null));
//		} catch (IllegalArgumentException e) {
//			return ResponseEntity.badRequest()
//					.body(new AppResponse<>(false, "Invalid input", 400, null, e.getMessage()));
//		} catch (Exception e) {
//			return ResponseEntity.status(500)
//					.body(new AppResponse<>(false, "Internal Server Error", 500, null, e.getMessage()));
//		}
//	}

	@PutMapping("/update/role/{id}")
	public ResponseEntity<AppResponse<?>> updateRole(@PathVariable Long id, @RequestBody RoleRequest roleDto) {
		try {
//			userSerivce.updateRole(id, roleDto);
			return ResponseEntity.ok(new AppResponse<>(true, "Role updated successfully", 200, null, null));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest()
					.body(new AppResponse<>(false, "Invalid input", 400, null, e.getMessage()));
		} catch (Exception e) {
			return ResponseEntity.status(500)
					.body(new AppResponse<>(false, "Internal Server Error", 500, null, e.getMessage()));
		}
	}

	@GetMapping("/roles/{page}")
	public ResponseEntity<PageableResponse<RoleResponse>> getRoles(@PathVariable int page,
	        @RequestParam(required = false) String keyword) {

	    if (page > 0) {
	        page = page - 1;
	    }
	    Page<RoleResponse> rolePage = userSerivce.getActiveRoles(keyword, PageRequest.of(page, Constant.LIMIT_10));
	    PageableResponse<RoleResponse> response = new PageableResponse<>(
	            (int) rolePage.getTotalElements(),
	            rolePage.getContent()
	    );

	    return ResponseEntity.ok(response);
	}

	@GetMapping("/roles/{roleId}/details")
	public ResponseEntity<RoleDetailsResponse> getRoleDetails(@PathVariable Long roleId) {
		RoleDetailsResponse response = userSerivce.getRoleDetails(roleId);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/role/add")
	public ResponseEntity<AppResponse<?>> addNewRole(@RequestBody RoleRequest roleRequest) {
		try {
			Role savedRole = userSerivce.addRole(roleRequest);
			AppResponse<?> appResponse = new AppResponse<>(true, "Role added successfully", 201, savedRole.getId(), null);
			return new ResponseEntity<>(appResponse, HttpStatus.CREATED);
		} catch (Exception e) {
			AppResponse<?> appResponse = new AppResponse<>(false, "Failed to add role", 500, null, e.getMessage());
			return new ResponseEntity<>(appResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@GetMapping("/users/{page}")
	public ResponseEntity<PageableResponse<UserResponse>> getActiveUsers(
	        @PathVariable int page,
	        @RequestParam(required = false) String keyword,
	        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date_from,
	        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date_to
	) {
	    if (page > 0) {
	        page = page - 1;
	    }
	    Page<UserResponse> userPage = userSerivce.getActiveUsers(keyword, date_from, date_to, PageRequest.of(page, Constant.LIMIT_10));
	    PageableResponse<UserResponse> response = new PageableResponse<>((int) userPage.getTotalElements(), userPage.getContent());

	    return ResponseEntity.ok(response);
	}

	@GetMapping("/roles")
	public ResponseEntity<List<RoleResponseDropdown>> getRoleDropdown() {
		List<RoleResponseDropdown> roles = userSerivce.getActiveRolesForDropdown();
		return ResponseEntity.ok(roles);
	}

	@PutMapping("/update/user/{id}")
	public ResponseEntity<AppResponse<?>> updateUser(@PathVariable Long id, @RequestBody User userRequest) {
		try {
			userSerivce.updateUser(id, userRequest);
			return ResponseEntity.ok(new AppResponse<>(true, "User updated successfully", 201, "", null));
		} catch (EntityNotFoundException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new AppResponse<>(false, e.getMessage(), null));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(new AppResponse<>(false, "An unexpected error occurred.", null));
		}
	}
	
	@DeleteMapping("/delete/user/{id}")
    public ResponseEntity<AppResponse<?>> deleteUser(@PathVariable Long id) {
        try {
        	userSerivce.deleteUser(id);
            return ResponseEntity.ok(new AppResponse<>(true, "User Deleted successfully.", null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AppResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AppResponse<>(false, "An unexpected error occurred.", null));
        }
    }
	
	@PostMapping("/update/password")
    public ResponseEntity<AppResponse<?>> updatePassword(@RequestBody UpdatePasswordRequest request) {
        try {
        	userSerivce.updatePassword(request.getUser_id(), request.getPassword());
            return ResponseEntity.ok(new AppResponse<>(true, "Password updated successfully.", null));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new AppResponse<>(false, e.getMessage(), null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AppResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new AppResponse<>(false, "An unexpected error occurred.", 500, null, e.getLocalizedMessage()));
        }
    }

}
