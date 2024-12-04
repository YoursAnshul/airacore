package com.aircore.response;

import java.util.Date;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleDetailsResponse {

    private Long id;
    private String name;
    private String status;
    private Date createdAt;
    private Date updatedAt;
    private List<MenuDetails> menus;


    @Getter
    @Setter
    public class MenuDetails {
        private Long id;
        private String name;
        private Boolean isCreate;
        private Boolean isRead;
        private Boolean isUpdate;
        private Boolean isDelete;
        private Boolean isAll;
        private String status;
        private Date createdAt;
        private Date updatedAt;
		
    }
}



