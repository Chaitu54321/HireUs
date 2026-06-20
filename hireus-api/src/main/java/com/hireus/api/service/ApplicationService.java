package com.hireus.api.service;

import com.hireus.api.entity.Application;
import com.hireus.api.entity.ApplicationStatus;
import com.hireus.api.entity.Job;
import com.hireus.api.entity.User;
import com.hireus.api.repository.ApplicationRepository;
import com.hireus.api.repository.JobRepository;
import com.hireus.api.repository.UserRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ApplicationService {
    private final ApplicationRepository repository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public ApplicationService(ApplicationRepository repository, JobRepository jobRepository, UserRepository userRepository) {
        this.repository = repository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
    }

    public Application apply(Application app) { return repository.save(app); }

    public List<Application> getForCandidate(Long cid) { return repository.findByCandidateId(cid); }

    /** Returns candidate applications enriched with job title & location */
    public List<Map<String, Object>> getForCandidateWithDetails(Long cid) {
        List<Application> apps = repository.findByCandidateId(cid);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Application app : apps) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", app.getId());
            map.put("jobId", app.getJobId());
            map.put("status", app.getStatus().name());
            map.put("appliedAt", app.getAppliedAt());
            jobRepository.findById(app.getJobId()).ifPresent(job -> {
                map.put("jobTitle", job.getTitle());
                map.put("jobLocation", job.getLocation());
                map.put("jobSalary", job.getSalary());
            });
            result.add(map);
        }
        return result;
    }

    /** Returns applications for a job enriched with candidate username & email */
    public List<Map<String, Object>> getForJobWithDetails(Long jobId) {
        List<Application> apps = repository.findByJobId(jobId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Application app : apps) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", app.getId());
            map.put("candidateId", app.getCandidateId());
            map.put("status", app.getStatus().name());
            map.put("appliedAt", app.getAppliedAt());
            userRepository.findById(app.getCandidateId()).ifPresent(user -> {
                map.put("candidateUsername", user.getUsername());
                map.put("candidateEmail", user.getEmail());
            });
            result.add(map);
        }
        return result;
    }

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
