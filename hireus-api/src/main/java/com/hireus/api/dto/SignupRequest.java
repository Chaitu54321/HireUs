package com.hireus.api.dto;
import com.hireus.api.entity.Role;
public class SignupRequest {
    private String username;
    private String email;
    private String password;
    private Role role;
    public String getUsername() { return username; }
    public void setUsername(String u) { this.username = u; }
    public String getEmail() { return email; }
    public void setEmail(String e) { this.email = e; }
    public String getPassword() { return password; }
    public void setPassword(String p) { this.password = p; }
    public Role getRole() { return role; }
    public void setRole(Role r) { this.role = r; }
}
