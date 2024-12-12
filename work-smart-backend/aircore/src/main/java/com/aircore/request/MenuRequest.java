package com.aircore.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MenuRequest {
	private String name;
	private Boolean isCreate;
	private Boolean isRead;
	private Boolean isUpdate;
	private Boolean isDelete;
}
