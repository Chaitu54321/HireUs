package com.hireus.api.controller;
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
