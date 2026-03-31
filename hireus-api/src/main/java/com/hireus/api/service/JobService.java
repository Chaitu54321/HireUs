package com.hireus.api.service;
import com.hireus.api.entity.Job;
import com.hireus.api.repository.JobRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class JobService {
    private final JobRepository repository;
    public JobService(JobRepository repository) { this.repository = repository; }
    
    public List<Job> getAllJobs() { return repository.findAll(); }
    
    public List<Job> searchJobs(String search) {
        return repository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(search, search);
    }
    
    public Job createJob(Job job) { return repository.save(job); }
    
    public void deleteJob(Long id) { repository.deleteById(id); }
}
