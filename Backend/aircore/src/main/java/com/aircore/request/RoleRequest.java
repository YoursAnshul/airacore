package com.aircore.request;

import java.util.List;

import com.aircore.utility.Enumeration.Status;

import lombok.Data;

@Data
public class RoleRequest {

	private String name;
	private Status status;
	private List<RoleMenuPermissionRequest> roleMenuPermissions;

}
