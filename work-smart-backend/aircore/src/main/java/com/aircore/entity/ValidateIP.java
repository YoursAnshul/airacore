package com.aircore.entity;

import com.aircore.utility.Enumeration.Status;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ValidateIP {

	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Integer id;
	 private String ipAddress;
	 private String name;
	 private Long organizationId;
	 private Status status;
}
