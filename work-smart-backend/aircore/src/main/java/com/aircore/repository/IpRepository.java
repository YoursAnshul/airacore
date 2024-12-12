package com.aircore.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.aircore.entity.ValidateIP;
import com.aircore.utility.Enumeration.Status;

public interface IpRepository extends JpaRepository<ValidateIP, Integer>{

	ValidateIP findByIpAddressAndStatus(String trim, Status active);

}
