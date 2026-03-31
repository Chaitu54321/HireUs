package com.hireus.api.entity;
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
