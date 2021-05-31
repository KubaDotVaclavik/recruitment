# Recruitment API

## About

Recruitment API is a sample project, that was created with regard to the principles of DDD. Most of it is described in an amazing blog [khalilstemmler.com](https://khalilstemmler.com/articles/categories/domain-driven-design/)

## How to run

The app can be easily run using Docker. The API runs on port 4000.

```
docker-compose up --build
```

# API v1 docs

- [Candidates](#candidates)
- [Job ads](#job-ads)
- [Job applications](#job-applications)

## #Candidates

```yml
GET /api/v1/candidates/{id}
```

```yml
GET /api/v1/candidates?limit={number}&offset={number}&fullName_contains={string}&skills_contains={string}
```

```yml
POST /api/v1/candidates
    requestBody:
        content:
            application/json
        schema:
            {
                "fullName": string,
                "skills": string[],
                "salary": number?
            }

```

```yml
PATCH /api/v1/candidates/{id}
    requestBody:
        content:
            application/json
        schema:
            {
                "fullName": string?,
                "skills": string[]?,
                "salary": number?
            }

```

```yml
DELETE /api/v1/candidates/{id}
```

## #Job ads

```yml
GET /api/v1/jobAds/{id}
```

```yml
GET /api/v1/jobAds?limit=5&offset=10
```

```yml
POST /api/v1/jobAds
    requestBody:
        content:
            application/json
        schema:
            {
                "text": string,
                "title": string,
                "salary": number?
            }

```

```yml
PATCH /api/v1/jobAds/{id}
    requestBody:
        content:
            application/json
        schema:
            {
                  "text": string?,
                "title": string?,
                "salary": number?
            }

```

```yml
DELETE /api/v1/jobAds/{id}
```

## #Job application

```yml
GET /api/v1/jobApplications/{id}
```

```yml
GET /api/v1/jobApplications?limit=5&offset=10
```

```yml
POST /api/v1/jobApplications
    requestBody:
        content:
            application/json
        schema:
            {
                "jobAdId": string,
                "candidateId": string,
            }

```

```yml
DELETE /api/v1/jobApplications/{id}
```
