## Description 
Quiz Master is an exam preparation platform featuring multi-user support with distinct 
admin and user roles. The app enables administrators to manage subjects, chapters, 
quizzes, and questions, while users register, take quizzes, and view performance. 

---

## Technologies Used 
- VueJS & Bootstrap: Frontend frameworks for a responsive and unified UI. 
- Redis: In memory database for faster loading
- Celery: For caching and managing asynchronous batch jobs (CSV export). 
- Flask: Lightweight backend framework for REST APIs and role-based authentication. 
- SQLite: Relational database for data storage. 
- Chart.js: For creating charts for user and administrator.

---

## Platform Wireframe

![Wireframe](https://github.com/shrigulhane100/winterton/blob/main/sceenshots/Quiz_master%20wired%20frame.png)

---

## Database Design

![db1](https://github.com/shrigulhane100/winterton/blob/main/sceenshots/Screenshot%202026-01-12%20112935.png)

![db2](https://github.com/shrigulhane100/winterton/blob/main/sceenshots/Screenshot%202026-01-12%20112955.png)

--

## API Design 
The project implements flask api endpoints for: 
- Authentication: User registration and login (with role management). 
- Content Management: Admin endpoints for creating, editing, and deleting subjects, 
chapters, quizzes, and questions. 
- Quiz Execution & Scoring: User endpoints to start quizzes, view questions (with 
timers), and record scores. 
- Batch Jobs: Endpoints to trigger CSV export jobs. 

 ---

## Architecture and Features 
The project follows a modular design: 
- Controllers/Routes: Encapsulated in dedicated Flask blueprints for authentication, 
admin functions, and quiz functionalities. 
- Templates: Bootstrap Templates serve the landing page; the main UI is driven by 
VueJS with Bootstrap styling. 
- Background Jobs: Managed using Celery and Redis, ensuring non-blocking 
processing for reminders and reports. 

---

## Features: 
- Role-based access control and session. 
- User and administrator summary dashboard. 
- Asynchronous CSV export and activity reporting. 
- Responsive UI with client- and server-side validations. 

---

## 1. Core Functionalities
### Admin & User Authentication
* **Login/Register Form:** A login/register form with fields like username, password, etc., for both user and admin login.
* **Single Admin:** The application should have only one admin identified by its role.
* **Authentication Methods:** Use either **Flask security (session or token)** or **JWT-based Token** based authentication to implement role-based access control.
* **User Model:** The app must have a suitable model to store and differentiate all types of users.

---

## 2. Admin Dashboard
* **Initialization:** The admin should be added whenever a new database is created.
* **Subject Management:** Create, edit, and delete subjects.
* **Chapter Management:** Create, edit, and delete chapters under a subject.
* **Quiz Management:** Create a new quiz under a chapter.
* **MCQ Format:** Each quiz contains a set of questions (MCQ - only one option correct).
* **Search:** The admin can search users, subjects, and quizzes.
* **Analytics:** Shows summary charts.

---

## 3. Quiz Management (Admin Only)
* **CRUD Operations:** Edit or delete a quiz.
* **Scheduling:** The admin specifies the date and duration (**HH:MM**) of the quiz.
* **Question Control:** The admin creates, edits, or deletes the MCQ questions inside a specific quiz.

---

## 4. User Dashboard
* **Participation:** The user can attempt any quiz of his/her interest.
* **Timer:** Every quiz has a functional timer.
* **Records:** Each quiz score is recorded and earlier quiz attempts are displayed.
* **Analytics:** Ability to see personal summary charts.

> **Note:** The database must be created **programmatically** (via table creation or model code). Manual database creation, such as using DB Browser for SQLite, is **NOT** allowed.

---

## 5. Backend Jobs

### A. Scheduled Job - Daily Reminders
* **Goal:** Send daily reminders to users on g-chat (Google Chat Webhooks), SMS, or mail.
* **Trigger:** Check if a user has not visited or if a new quiz is created by the admin.
* **Timing:** Alerts can be sent every day in the evening (students can choose the time).

### B. Scheduled Job - Monthly Activity Report
* **Goal:** Devise a monthly report for the user created using HTML and sent via mail.
* **Contents:** Quiz details, quizzes taken in a month, scores, average score, and ranking.
* **Timing:** Start a job on the first day of every month to generate and send the report.

### C. User Triggered Async Job - Export as CSV
**You must implement one of the following:**
* **Option 1 (User Export):** Download personal quiz details (quiz_id, chapter_id, date, score, remarks).
* **Option 2 (Admin Export):** Download all user details (user_id, quizzes_taken, performance/avg score).
* **Workflow:** Triggered via dashboard $\rightarrow$ Batch job execution $\rightarrow$ Alert sent once completed.

---

## 6. Performance and Caching
* **Caching:** Add caching where required to increase performance.
* **Cache Expiry:** Implement cache expiry logic.
* **API Performance:** Ensure efficient API response times.

---

## How to run project
#### Go to terminal
#### Run `pip install -r requirements.txt`
#### Run `python app.py`
#### Download Redis for Linux even on Windows via WSL (Link)[https://redis.io/docs/latest/operate/oss_and_stack/install/archive/install-redis/install-redis-on-linux/]


## How to run celery
#### Go to Bash
#### Run `source .venv/Scripts/activate`
#### Run `celery --app=app.celery_app worker --pool=solo -l INFO`

