package com.aircore.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.aircore.entity.Menu;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

}
