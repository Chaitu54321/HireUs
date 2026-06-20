import os

base_dir = r"c:\Users\CHAITANYA\Desktop\HireUS\hireus-api\src\main\java\com\hireus\api"

directories = [
    "entity", "repository", "service", "controller", "security", "config", "dto"
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = {}

# Entities
files[r"entity\Role.java"] = """package com.hireus.api.entity;
public enum Role { CANDIDATE, RECRUITER }
"""

files[r"entity\ApplicationStatus.java"] = """package com.hireus.api.entity;
public enum ApplicationStatus { APPLIED, INTERVIEW, REJECTED, ACCEPTED }
"""

files[r"entity\User.java"] = """package com.hireus.api.entity;
import jakarta.persistence.*;
import lombok.Data;
@Entity @Table(name="tb_user")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique=true) private String username;
    private String email;
    private String passwordHash;
    @Enumerated(EnumType.STRING) private Role role;
    
    // Getters and Setters
    public Long getId() { return id; } public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; } public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; } public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; } public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public Role getRole() { return role; } public void setRole(Role role) { this.role = role; }
}
"""

files[r"entity\Job.java"] = """package com.hireus.api.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="tb_job")
public class Job {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String title;
    private String description;
    private String location;
    private Double salary;
    private Long recruiterId;
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Getters Setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public String getTitle(){return title;} public void setTitle(String t){this.title=t;}
    public String getDescription(){return description;} public void setDescription(String d){this.description=d;}
    public String getLocation(){return location;} public void setLocation(String l){this.location=l;}
    public Double getSalary(){return salary;} public void setSalary(Double s){this.salary=s;}
    public Long getRecruiterId(){return recruiterId;} public void setRecruiterId(Long rid){this.recruiterId=rid;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime c){this.createdAt=c;}
}
"""

files[r"entity\Application.java"] = """package com.hireus.api.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity @Table(name="tb_application")
public class Application {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long jobId;
    private Long candidateId;
    @Enumerated(EnumType.STRING) private ApplicationStatus status = ApplicationStatus.APPLIED;
    private LocalDateTime appliedAt = LocalDateTime.now();
    
    // Getters Setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getJobId(){return jobId;} public void setJobId(Long jid){this.jobId=jid;}
    public Long getCandidateId(){return candidateId;} public void setCandidateId(Long cid){this.candidateId=cid;}
    public ApplicationStatus getStatus(){return status;} public void setStatus(ApplicationStatus s){this.status=s;}
    public LocalDateTime getAppliedAt(){return appliedAt;} public void setAppliedAt(LocalDateTime a){this.appliedAt=a;}
}
"""

# Repositories
files[r"repository\UserRepository.java"] = """package com.hireus.api.repository;
import com.hireus.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
"""

files[r"repository\JobRepository.java"] = """package com.hireus.api.repository;
import com.hireus.api.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);
}
"""

files[r"repository\ApplicationRepository.java"] = """package com.hireus.api.repository;
import com.hireus.api.entity.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByJobId(Long jobId);
}
"""

# Services
files[r"service\JobService.java"] = """package com.hireus.api.service;
import com.hireus.api.entity.Job;
import com.hireus.api.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import java.util.List;
@Service
public class JobService {
    private final JobRepository repository;
    public JobService(JobRepository repository) { this.repository = repository; }
    
    @Cacheable(value = "jobs")
    public List<Job> getAllJobs() { return repository.findAll(); }
    
    @Cacheable(value = "jobs", key = "#search")
    public List<Job> searchJobs(String search) {
        return repository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(search, search);
    }
    
    @CacheEvict(value = "jobs", allEntries = true)
    public Job createJob(Job job) { return repository.save(job); }
    
    @CacheEvict(value = "jobs", allEntries = true)
    public void deleteJob(Long id) { repository.deleteById(id); }
}
"""

files[r"service\ApplicationService.java"] = """package com.hireus.api.service;
import com.hireus.api.entity.Application;
import com.hireus.api.entity.ApplicationStatus;
import com.hireus.api.repository.ApplicationRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class ApplicationService {
    private final ApplicationRepository repository;
    public ApplicationService(ApplicationRepository repository) { this.repository = repository; }
    
    public Application apply(Application app) { return repository.save(app); }
    
    public List<Application> getForCandidate(Long cid) { return repository.findByCandidateId(cid); }
    
    public Application updateStatus(Long id, ApplicationStatus status) {
        Application app = repository.findById(id).orElseThrow();
        app.setStatus(status);
        Application saved = repository.save(app);
        sendAsyncNotification(saved);
        return saved;
    }
    
    @Async
    public void sendAsyncNotification(Application app) {
        System.out.println("Processing email notification asynchronously for app ID: " + app.getId() + " new status: " + app.getStatus());
    }
}
"""

# RestControllers
files[r"controller\JobController.java"] = """package com.hireus.api.controller;
import com.hireus.api.entity.Job;
import com.hireus.api.service.JobService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/jobs")
public class JobController {
    private final JobService service;
    public JobController(JobService service) { this.service = service; }
    
    @GetMapping
    public List<Job> getJobs(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty()) return service.searchJobs(search);
        return service.getAllJobs();
    }
    
    @PostMapping
    public Job createJob(@RequestBody Job job) { return service.createJob(job); }
    
    @DeleteMapping("/{id}")
    public void deleteJob(@PathVariable Long id) { service.deleteJob(id); }
}
"""

files[r"controller\ApplicationController.java"] = """package com.hireus.api.controller;
import com.hireus.api.entity.Application;
import com.hireus.api.entity.ApplicationStatus;
import com.hireus.api.service.ApplicationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/applications")
public class ApplicationController {
    private final ApplicationService service;
    public ApplicationController(ApplicationService service) { this.service = service; }
    
    @PostMapping
    public Application apply(@RequestBody Application application) {
        return service.apply(application);
    }
    
    @GetMapping("/candidate/{cid}")
    public List<Application> getCandidateApps(@PathVariable Long cid) {
        return service.getForCandidate(cid);
    }
    
    @PutMapping("/{id}/status")
    public Application updateStatus(@PathVariable Long id, @RequestParam ApplicationStatus status) {
        return service.updateStatus(id, status);
    }
}
"""

# Config
files[r"config\RedisConfig.java"] = """package com.hireus.api.config;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
@Configuration
@EnableCaching
public class RedisConfig {
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        return template;
    }
}
"""

files[r"config\AsyncConfig.java"] = """package com.hireus.api.config;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
@Configuration
@EnableAsync
public class AsyncConfig {}
"""

files[r"config\RateLimitFilter.java"] = """package com.hireus.api.config;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Bucket4j;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.time.Duration;

@Component
public class RateLimitFilter implements Filter {
    private final Bucket bucket;

    public RateLimitFilter() {
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        this.bucket = Bucket4j.builder().addLimit(limit).build();
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (bucket.tryConsume(1)) {
            chain.doFilter(request, response);
        } else {
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            httpResponse.setStatus(429);
            httpResponse.getWriter().write("Too Many Requests");
        }
    }
}
"""

files[r"controller\AnalyticsController.java"] = """package com.hireus.api.controller;
import com.hireus.api.repository.ApplicationRepository;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final ApplicationRepository appRepo;
    public AnalyticsController(ApplicationRepository appRepo) { this.appRepo = appRepo; }
    
    @GetMapping("/dashboard")
    public Map<String, Object> getDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalApplications", appRepo.count());
        // Simple mock of status distribution
        stats.put("distribution", "Calculated data...");
        return stats;
    }
}
"""

for path, content in files.items():
    with open(os.path.join(base_dir, path), "w", encoding="utf-8") as f:
        f.write(content)

print(f"Scaffolded {len(files)} files successfully.")
