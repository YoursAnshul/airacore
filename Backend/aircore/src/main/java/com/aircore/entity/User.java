package com.aircore.entity;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.aircore.utility.Enumeration.Status;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

	@Column(name = "first_name", nullable = false, unique = false)
	private String firstName;

	@Column(name = "last_name", nullable = false, unique = false)
	private String lastName;

	@Column(name = "mobile_number", nullable = false, unique = true)
	private String mobileNumber;
    
    @Column(nullable = false, unique = true)
    private String email;
    

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "USER";
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    private Date createdDate;
    
    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
}

