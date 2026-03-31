package com.hireus.api.controller;
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
