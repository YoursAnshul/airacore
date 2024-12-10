package com.aircore.request;

import java.util.List;

import lombok.Data;

@Data
public class RoleRequest {
	
    private String name;
    private List<MenuRequest> menus;

}
