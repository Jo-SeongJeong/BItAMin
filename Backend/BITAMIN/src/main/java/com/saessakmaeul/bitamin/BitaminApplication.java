package com.saessakmaeul.bitamin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BitaminApplication {

    public static void main(String[] args) {
        SpringApplication.run(BitaminApplication.class, args);
    }

}
