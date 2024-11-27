package com.aircore.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

//	@Bean
//	public CorsFilter corsFilter() {
//		CorsConfiguration corsConfig = new CorsConfiguration();
//		corsConfig.addAllowedOriginPattern("*");
//		corsConfig.addAllowedMethod("*");
//		corsConfig.addAllowedHeader("*");
//		corsConfig.setAllowCredentials(true);
//
//		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//		source.registerCorsConfiguration("/**", corsConfig);
//
//		return new CorsFilter(source);
//	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOrigins("http://localhost:3000")
				.allowedMethods("GET", "POST", "PUT", "DELETE").allowedHeaders("*").allowCredentials(true);
	}

}
