package com.hireus.api.entity;
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
