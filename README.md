### Description 
Quiz Master is an exam preparation platform featuring multi-user support with distinct 
admin and user roles. The app enables administrators to manage subjects, chapters, 
quizzes, and questions, while users register, take quizzes, and view performance. 


### Technologies Used 
- VueJS & Bootstrap: Frontend frameworks for a responsive and unified UI. 
- Redis: In memory database for faster loading
- Celery: For caching and managing asynchronous batch jobs (CSV export). 
- Flask: Lightweight backend framework for REST APIs and role-based authentication. 
- SQLite: Relational database for data storage. 
- Chart.js: For creating charts for user and administrator.

### Screenshot

`Home Page`

![Home Page](sceenshots/vlcsnap-2025-10-09-04h49m53s022.png)

`Login Page`

![Login Page](sceenshots/vlcsnap-2025-10-09-04h50m05s568.png)

`Subject Page`

![Subject Page](sceenshots/vlcsnap-2025-10-09-04h50m17s266.png)

`Admin Quizzes Page`

![Admin Quizzes Page](sceenshots/vlcsnap-2025-10-09-04h50m42s408.png)

`Search Functionality`

![Search Functionality](sceenshots/vlcsnap-2025-10-09-04h50m54s149.png)

`Questions Page`

![Questions Page](sceenshots/vlcsnap-2025-10-09-04h51m01s070.png)

`User Page`

![User Page](sceenshots/vlcsnap-2025-10-09-04h51m06s882.png)

`Admin Dashboard`

![Admin Dashboard](sceenshots/vlcsnap-2025-10-09-04h51m12s263.png)

`Quizzes`

![Quizzes](sceenshots/vlcsnap-2025-10-09-04h51m22s268.png)

`Correct Answer Quiz`

![Correct Answer Quiz](sceenshots/vlcsnap-2025-10-09-04h51m45s944.png)

`Wrong Answer Quiz`

![Wrong Answer Quiz](sceenshots/vlcsnap-2025-10-09-04h51m57s097.png)

`Quiz Result Page`

![Quiz Result Page](sceenshots/vlcsnap-2025-10-09-04h52m04s211.png)

`Score Page`

![Score Page](sceenshots/vlcsnap-2025-10-09-04h52m14s489.png)

`Export Result`

![Export Result](sceenshots/vlcsnap-2025-10-09-04h52m22s942.png)

`User Dashboard`

![User Dashboard](sceenshots/vlcsnap-2025-10-09-04h52m30s114.png)

### API Design 
The project implements flask api endpoints for: 
- Authentication: User registration and login (with role management). 
- Content Management: Admin endpoints for creating, editing, and deleting subjects, 
chapters, quizzes, and questions. 
- Quiz Execution & Scoring: User endpoints to start quizzes, view questions (with 
timers), and record scores. 
- Batch Jobs: Endpoints to trigger CSV export jobs. 
 

### Architecture and Features 
The project follows a modular design: 
- Controllers/Routes: Encapsulated in dedicated Flask blueprints for authentication, 
admin functions, and quiz functionalities. 
- Templates: Bootstrap Templates serve the landing page; the main UI is driven by 
VueJS with Bootstrap styling. 
- Background Jobs: Managed using Celery and Redis, ensuring non-blocking 
processing for reminders and reports. 

### Features: 
- Role-based access control and session. 
- User and administrator summary dashboard. 
- Asynchronous CSV export and activity reporting. 
- Responsive UI with client- and server-side validations. 
  


## How to run project
#### Go to terminal
#### Run `pip install requirements.txt`
#### Run `python app.py`



## How to run celery
#### Go to Bash
#### Run `source .venv/Scripts/activate`
#### Run `celery --app=app.celery_app worker --pool=solo -l INFO`

