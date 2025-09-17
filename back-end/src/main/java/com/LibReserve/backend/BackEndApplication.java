package com.LibReserve.backend;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import javax.sql.DataSource;

@SpringBootApplication
public class BackEndApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackEndApplication.class, args);
    }


    @Bean
    CommandLineRunner showDs(DataSource ds) {
        return args -> {
            if (ds instanceof HikariDataSource hds) {
                System.out.println("[DB] JDBC URL   = " + hds.getJdbcUrl());
                System.out.println("[DB] Username   = " + hds.getUsername());
            } else {
                System.out.println("[DB] DataSource = " + ds);
            }
        };
    }
}
