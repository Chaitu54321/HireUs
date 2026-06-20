package com.hireus.api.controller;
import com.hireus.api.entity.Application;
import com.hireus.api.entity.ApplicationStatus;
import com.hireus.api.service.ApplicationService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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
    public List<Map<String, Object>> getCandidateApps(@PathVariable Long cid) {
        return service.getForCandidateWithDetails(cid);
    }
    
    @GetMapping("/job/{jobId}")
    public List<Map<String, Object>> getJobApps(@PathVariable Long jobId) {
        return service.getForJobWithDetails(jobId);
    }
    
    @PutMapping("/{id}/status")
    public Application updateStatus(@PathVariable Long id, @RequestParam ApplicationStatus status) {
        return service.updateStatus(id, status);
    }
}
