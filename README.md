# GuildBoard

A Quest dashboard for adventurers that want to help the guild.

<img width="2877" height="1564" alt="image" src="https://github.com/user-attachments/assets/864c2fe4-9483-47c6-a697-5faea6898e93" />

## Presentation

GuildBoard is a full-stack school project consisting of a quest management web application for an adventurers' guild. It pairs a robust REST API with a modern web frontend.

### Key Features
- Adventurer Management: Track statistics (level, XP, gold), view assignment history, and monitor experience progression.
- Quest Board: Create, update, and filter quests by status and difficulty level.
- Assignment System: Assign adventurers to quests based on level requirements and track their progress.
- Business Rules:Level validation before allowing an adventurer to accept a quest.
- Restriction of one active quest at a time per adventurer.
- Gold and XP rewards upon quest completion with automated level-ups.

### Tech Stack
- Backend: Java 25, Spring Boot, Spring Data JPA.
- Database: PostgreSQL 18.
- Frontend: React, TypeScript, Vite.
- Documentation & Tooling: Swagger UI (Springdoc), Actuator.

### Repository Structure

```
GuildBoard/
├── .github/workflows   # Github actions
├── backend/            # Spring Boot application
├── frontend/           # React + TypeScript application
├── docs/               # Database, mock-ups & architectural diagrams
└── README.md           # Setup instructions & project documentation
```

### Authors

This project has been realized by [Nicolas](https://github.com/nicolas-riera/), the software referent, and [Gabriel](https://github.com/Gabriel-SEMPERE/), the web referent.

## Setup and run

### Requirements

- JDK 25 (bin folder in ```PATH``` environment variable)
- Maven (also in ```PATH```)
- PostGreSQL 18
- Node.JS
- React-router-dom (```npm install react-router-dom```)

Start by cloning the repository:

```batch
git clone https://github.com/nicolas-riera/GuildBoard.git
```

```batch
cd Guildboard
```

### Database Setup

In Postgres, create the database "guildboard":

```sql
CREATE DATABASE guildboard;
```

or 

```batch
createdb -U [USER] guildboard
```

*Replace [USER] with the actual user, like postgres.*

then, import the database file:

```batch
cd docs/database
```

```batch
psql -U [USER] -d guildboard -f guildboard.sql
```

### Backend Setup

#### Credidentials

In ```/backend/src/main/resources/```, open ```application.properties``` and you want to change these 2 lines by your database username and password:

```
spring.datasource.username=[username]
spring.datasource.password=[password]
```

*Default username and password for database are postgres and 1234, respectively.*

You can also change the login for accessing Spring Actuator data:

```
spring.security.user.name=[username]
spring.security.user.password=[password]
```

*Default username and password are admin and 1234, respectively.*

Or also change the IP address and port of the database:

```
spring.datasource.url=jdbc:postgresql://[IP_ADDRESS]:[PORT]/guildboard
````

*Default IP Address is localhost and port is 5432, the default PostgreSQL port.*

#### Run Springboot

While being at the root of the repository, run:

```batch
mvn spring-boot:run -f backend
```

#### Run Tests

You can also run the tests made, to check if the code works:

```batch
mvn clean test -f backend/pom.xml
```

#### Access SwaggerUI

You can access SwaggerUI on [http://localhost:8080/swagger-ui/index.html#/](http://localhost:8080/swagger-ui/index.html#/). This will tell all the endpoints and let you test them.

<img width="2713" height="1535" alt="image" src="https://github.com/user-attachments/assets/d7e3e090-1992-4feb-b26d-8d7e835ce796" />

#### Access Actuator

You can access Actuator on [http://localhost:8080/actuator/[endpoint]](http://localhost:8080/actuator/), with the possible endpoints being:
- health
- info
- metrics
- env
- loggers

*Note: the first time, Actuator will ask you for a login, which is what you previously setup (by default, it's admin and 1234).* 

### Frontend Setup

*Don't forget to install React-router-dom (```npm install react-router-dom```).*

While being at the root of the repository, run:

```batch
npm --prefix frontend run dev
```

The website should be accessible on [http://localhost:5173/](http://localhost:5173/).
