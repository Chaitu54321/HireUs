# HireUS Implementation Guide

## Backend Adjustments
1. **Database Selection**: The backend was originally attempting to connect to PostgreSQL without the correct dependencies or configurations. The `pom.xml` was updated to restore the `postgresql` dependency, and `application.properties` was modified to read its configuration variables from a `.env` file (or environmental variables in general).
2. **Setup Instructions**: To run the backend locally using PostgreSQL, copy the included `.env` template file, fill in your own PostgreSQL database credentials (username and password), and place it in the same directory as the root (or adapt the `application.properties` file `optional:file:../.env[.properties]`). The default template looks like this:
   ```env
   # Database Credentials
   SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/hireus
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=yourpassword

   # Redis Credentials
   SPRING_REDIS_HOST=localhost
   SPRING_REDIS_PORT=6379
   SPRING_REDIS_PASSWORD=

   # Security
   JWT_SECRET_KEY=bXktc3VwZXItc2VjcmV0LWtleS10aGF0LWlzLWF0LWxlYXN0LTI1Ni1iaXRzLWxvbmctYW5kLXNlY3VyZQ==
   JWT_EXPIRATION_MS=86400000

   # Server
   SERVER_PORT=8080
   ```
3. **New Features Added**:
   - `JobRepository` was updated with a new query method `findByRecruiterId`.
   - `JobService` was updated with a new service method `getJobsByRecruiter(Long recruiterId)`.
   - `JobController` now features a new REST endpoint `@GetMapping("/recruiter/{recruiterId}")` which retrieves jobs tailored to the current recruiter.

## Frontend Adjustments
1. **Dashboard Fix**: In the frontend, the Recruiter dashboard previously polled the general `/api/jobs` endpoint, inadvertently fetching all jobs across the platform. It was corrected to target `/api/jobs/recruiter/${user.userId}`, strictly querying for jobs created by the logged-in recruiter.
