package com.nicolasgabriel.guildboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration;

// @SpringBootApplication
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class}) // Remove when database is set up
public class GuildboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(GuildboardApplication.class, args);
	}

}
