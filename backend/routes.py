from flask import (
    current_app as app,
    jsonify,
    render_template,
    request,
    send_file,
    Flask,
)

from flask_security.datastore import SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from flask_security.core import Security
from flask_security.decorators import auth_required, auth_token_required
from flask_security.utils import verify_password
# from flask_security import (
#     current_user,
# )
from backend.models import User, db, Role, Subject, Chapter, Quiz, Chapter, Score
from datetime import datetime
from backend.celery.tasks import add
from backend.celery.tasks import create_csv
from celery.result import AsyncResult
# cache = app.cache


datastore = SQLAlchemyUserDatastore(db, User, Role)
# datastore = app.security.datastore


@app.get("/")
def home():
    return render_template("index.html")


@app.get("/admin")
def admin():
    return "Hello"


# @cache.memoize(timeout=5)


# @app.get("/cache")
# @cache.cached(timeout=5)
# def cache():
#     return {"time": str(datetime.now())}


# @app.get("/celery")
# def celery():
#     task = add.delay(10, 20)
#     return {"task_id": task.id}


@app.get("/celery-data/<id>")
def getData(id):
    result = AsyncResult(id)
    if result.ready():
        return {"result": result.result}
    else:
        return {"message": "Task not ready"}


@app.get("/create_csv")
def createCSV():
    task = create_csv.delay()
    return {"result": task.id}


@app.get("/get_celery_data/<id>")
def getCSV(id):
    result = AsyncResult(id)
    if result.ready():
        return send_file(f"./backend/celery/user_download/{result.result}")
    else:
        return {"message": "Task not ready"}


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return {"message": "Missing email or password"}

    user = datastore.find_user(email=email)

    if not user:
        return {"message": "User not found"}

    if not user.password or not verify_password(password, user.password):
        return jsonify({"message": "Invalid password"})

    if True:
        return jsonify(
            {
                "token": user.get_auth_token(),
                "email": user.email,
                "role": user.roles[0].name,
                "id": user.id,
            }
        )

    return jsonify({"message": "Invalid password"})


@app.route("/register", methods=["POST"])
def register():
    # Get data from the request
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    full_name = data.get("full_name")
    qualification = data.get("qualification")
    dob = data.get("dob")
    role = data.get("role", "user")  # Default role is 'user' if not provided

    # Validation checks
    if not email or not password or not full_name or not dob:
        return jsonify({"error": "Missing email, password, full name or date of birth"})

    if role not in ["admin", "user"]:
        return jsonify({"error": "Invalid role. Must be either 'admin' or 'user'"})

    # Check if the user already exists
    user = datastore.find_user(email=email)
    if user:
        return jsonify({"error": "User already exists"})

    try:
        dob = datetime.strptime(dob, "%Y-%m-%d").date()
    except ValueError:
        return jsonify(
            {"error": "Invalid date format for date of birth. Use YYYY-MM-DD."}
        )

    # Hash the password
    hashed_password = hash_password(password)

    # Create the user in the database
    try:
        with app.app_context():
            # Using SQLAlchemyUserDatastore to create a user with the required fields
            new_user = datastore.create_user(
                email=email,
                password=hashed_password,
                full_name=full_name,
                qualification=qualification,
                dob=dob,
                roles=[role],  # Assign role dynamically
                active=True,
            )
            db.session.commit()
            return jsonify({"message": "User created successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error creating user: {str(e)}"}), 500


# @app.route("/quiz_per_subject", methods=["GET"])
# @auth_required('token')
# def quiz_per_subject():
#     subjects = Subject.query.all()
#     subject_quiz_count = []

#     for subject in subjects:
#         chapters = Chapter.query.filter_by(subject_id=subject.id).all()
#         quiz_count = sum([len(Quiz.query.filter_by(chapter_id=chapter.id).all()) for chapter in chapters])
#         subject_quiz_count.append({
#             "subject_name": subject.name,
#             "quiz_count": quiz_count
#         })

#     return jsonify(subject_quiz_count)


@app.route("/admin/quiz_per_subject", methods=["GET"])
def quiz_per_subject():
    subjects = Subject.query.all()
    subject_quiz_count = []

    # Loop through each subject and count its quizzes.
    for subject in subjects:
        # Get chapters for the subject
        chapters = Chapter.query.filter_by(subject_id=subject.id).all()
        quiz_count = 0
        for chapter in chapters:
            # Count quizzes for each chapter
            quizzes = Quiz.query.filter_by(chapter_id=chapter.id).all()
            quiz_count += len(quizzes)
        subject_quiz_count.append(
            {"subject_name": subject.name, "quiz_count": quiz_count}
        )

    # Return the data as JSON
    return jsonify(subject_quiz_count)


@app.route("/admin/average_scores_per_quiz", methods=["GET"])
def average_scores_per_quiz():
    quizzes = Quiz.query.all()
    quiz_scores = []

    # Loop through each quiz to calculate the average score.
    for quiz in quizzes:
        scores = Score.query.filter_by(quiz_id=quiz.id).all()
        if scores:
            avg_score = sum(score.total_scored for score in scores) / len(scores)
            quiz_scores.append({"quiz_name": quiz.name, "average_score": avg_score})

    # Return the JSON response.
    return jsonify(quiz_scores)




@app.route("/user/<int:user_id>/subject_scores", methods=["GET"])
@auth_required('token')
def subject_scores(user_id):
    # Query all scores for this user.
    scores = Score.query.filter_by(user_id=user_id).all()
    subject_map = {}  # key: subject_id, value: dict with subject name and list of scores
    for score in scores:
        quiz = Quiz.query.get(score.quiz_id)
        if not quiz:
            continue
        chapter = Chapter.query.get(quiz.chapter_id)
        if not chapter:
            continue
        subject = Subject.query.get(chapter.subject_id)
        if not subject:
            continue
        if subject.id not in subject_map:
            subject_map[subject.id] = {"subject_name": subject.name, "scores": []}
        subject_map[subject.id]["scores"].append(score.total_scored)

    result = []
    for subject_id, data in subject_map.items():
        avg_score = sum(data["scores"]) / len(data["scores"])
        result.append({
            "subject_name": data["subject_name"],
            "average_score": avg_score
        })
    return jsonify(result)


@app.route("/user/<int:user_id>/avg_highest_score", methods=["GET"])
@auth_required('token')
def avg_highest_score(user_id):
    # Query all scores for this user.
    scores = Score.query.filter_by(user_id=user_id).all()
    quiz_map = {}
    for score in scores:
        if score.quiz_id not in quiz_map:
            quiz_map[score.quiz_id] = []
        quiz_map[score.quiz_id].append(score.total_scored)
    result = []
    for quiz_id, score_list in quiz_map.items():
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            continue
        avg_score = sum(score_list) / len(score_list)
        highest_score = max(score_list)
        result.append({
            "quiz_name": quiz.name,
            "average_score": avg_score,
            "highest_score": highest_score
        })
    return jsonify(result)
