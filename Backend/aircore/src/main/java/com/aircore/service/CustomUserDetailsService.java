package com.aircore.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.aircore.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	@Autowired
	private UserRepository adminRepository;

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Optional<com.aircore.entity.User> opt = adminRepository.findByUsername(username);
		System.out.println(username);
		if (!opt.isPresent()) {
			com.aircore.entity.User user = opt.get();
			System.out.println(user.getEmail());
			return new User(user.getEmail(), user.getPassword(), List.of(new SimpleGrantedAuthority("USER")));
		}
		throw new UsernameNotFoundException("User not found");
	}

}
