package com.hireus.api.config;

import com.hireus.api.entity.Job;
import com.hireus.api.repository.JobRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;

@Configuration
public class DBSeeder {

    @Bean
    public CommandLineRunner initDatabase(JobRepository jobRepository) {
        return args -> {
            if (jobRepository.count() == 0) {
                Job job1 = new Job();
                job1.setTitle("Senior Frontend Engineer");
                job1.setLocation("Remote");
                job1.setDescription("Build amazing UIs with React and Vite.");
                job1.setSalary(120000.0);
                job1.setCreatedAt(LocalDateTime.now());
                jobRepository.save(job1);

                Job job2 = new Job();
                job2.setTitle("Backend Developer");
                job2.setLocation("New York, NY");
                job2.setDescription("Write scalable APIs using Spring Boot and Java.");
                job2.setSalary(135000.0);
                job2.setCreatedAt(LocalDateTime.now());
                jobRepository.save(job2);
                
                System.out.println("Database seeded with sample jobs.");
            }
        };
    }
}
