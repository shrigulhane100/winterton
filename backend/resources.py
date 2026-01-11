from flask import jsonify, request, current_app as app, abort
from datetime import datetime
from flask_restful import Resource, Api, fields, marshal_with
from backend.models import db, User, Role, Subject, Chapter, Quiz, Question, Score
from flask_security.decorators import auth_required
from sqlalchemy import func
# from flask_security.utils import current_user
# from flask_caching import Cache
# from flask_login import current_user
# cache = app.cache
api = Api(prefix="/api")

subject_field = {
    "id": fields.Integer,
    "name": fields.String,
    "description": fields.String
}

class SubjectAPI(Resource):
    @marshal_with(subject_field)
    @auth_required('token')
    def get(self, id):
        subject = Subject.query.get(id)
        if not subject:
            return {"message": "Subject not found"}
        return subject

    @marshal_with(subject_field)
    @auth_required('token')
    def post(self, id):
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")

        subject = Subject.query.get(id)
        if not subject:
            return {"message": "Subject not found"}
        if name:
            subject.name = name
        if description:
            subject.description = description

        try:
            # Commit the changes to the database
            db.session.commit()
            # cache.delete('all_subject')
            return {"message": "Subject updated successfully"}
        except Exception as e:
            db.session.rollback()
    
    @marshal_with(subject_field)
    @auth_required('token')
    def delete(self, id):
        subject = Subject.query.get(id)
        if not subject:
            return {"message": "Subject not found"}
        try:
            for chapter in subject.chapters:
                for quiz in chapter.quizzes:
                    db.session.delete(quiz)
            
            # Delete all chapters associated with the subject
            for chapter in subject.chapters:
                db.session.delete(chapter)
            db.session.delete(subject)
            db.session.commit()
            # cache.delete('all_subject')
            return {"message": "Subject deleted successfully"}
        except Exception as e:
            return {"message": "Error deleting subject"}
        
api.add_resource(SubjectAPI, "/subject/<int:id>")


class SubjectListAPI(Resource):
    @marshal_with(subject_field)
    @auth_required('token')
    # @cache.cached(timeout=600, key_prefix='all_subject')
    def get(self):
        subjects = Subject.query.all()
        return subjects
    
    @marshal_with(subject_field)
    @auth_required('token')
    def post(self):
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")

        subject = Subject()
        subject.name = name
        subject.description = description

        try:
            db.session.add(subject)
            db.session.commit()
            # cache.delete('all_subject')
            return {"message": "Subject added successfully"}
        except Exception as e:
            return {"message": "Error adding subject"}

api.add_resource(SubjectListAPI, "/subjects")


chapter_field = {
    'id': fields.Integer,
    'name': fields.String,
    'description': fields.String,
    'subject_id': fields.Integer
}


class ChapterOnly(Resource):
    @marshal_with(chapter_field)
    @auth_required('token')
    def get(self, id):
        chapter = Chapter.query.get(id)
        if not chapter:
            abort(404, message="Chapter not found")
            # return {"message": "Chapter not found"}
        return chapter

api.add_resource(ChapterOnly, "/chapter/<int:id>")


class ChapterAPI(Resource):
    @marshal_with(chapter_field)
    @auth_required('token')
    def post(self, id, subject_id):
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")

        chapter = Chapter.query.get(id)
        if not chapter:
            return {"message": "chapter not found"}
        if name:
            chapter.name = name
        if description:
            chapter.description = description

        try:
            # Commit the changes to the database
            db.session.commit()
            return {"message": "Chapter updated successfully"}
        except Exception as e:
            db.session.rollback()  # Rollback the session in case of an error
            return {"message": f"Error updating chapter: {str(e)}"}

    @marshal_with(chapter_field)
    @auth_required('token')
    def delete(self, id, subject_id):
        chapter = Chapter.query.get(id)
        quizzes = Quiz.query.filter_by(chapter_id=id).all()
        if not chapter:
            return {"message": "chapter not found"}
        try:
            for quiz in quizzes:
                db.session.delete(quiz)
            db.session.delete(chapter)
            db.session.commit()
            return {"message": "Chapter deleted successfully"}
        except Exception as e:
            return {"message": "Error deleting chapter"}
        
api.add_resource(ChapterAPI, "/subject/<int:subject_id>/chapter/<int:id>")


class ChapterListAPI(Resource):
    @marshal_with(chapter_field)
    @auth_required('token')
    def get(self, id):
        chapters = Chapter.query.filter_by(subject_id=id).all()
        if not chapters:
            return {"message": "Chapters not found"}
        return chapters

    @marshal_with(chapter_field)
    @auth_required('token')
    def post(self, id):
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")

        chapter = Chapter()
        chapter.name = name
        chapter.description = description
        chapter.subject_id = id

        try:
            db.session.add(chapter)
            db.session.commit()
            return {"message": "Chapter added successfully"}
        except Exception as e:
            return {"message": "Error adding chapter"}


api.add_resource(ChapterListAPI, "/subject/<int:id>/chapter")


quiz_field = {
    'id': fields.Integer,
    'name': fields.String,
    'chapter_id': fields.Integer,
    'date_of_quiz': fields.DateTime,
    'time_duration': fields.String,
    'remarks': fields.String
}

class AllQuiz(Resource):
    @marshal_with(quiz_field)
    @auth_required('token')
    def get(self):
        quiz = Quiz.query.all()
        if not quiz:
            return {"message": "Quiz not found"}
        return quiz

api.add_resource(AllQuiz, '/quizzes')


class QuizAPI(Resource):
    @marshal_with(quiz_field)
    @auth_required('token')
    def get(self, id, chapter_id):
        quiz = Quiz.query.get(id)
        if not quiz:
            return {"message": "Quiz not found"}
        return quiz

    @marshal_with(quiz_field)
    @auth_required('token')
    def post(self, id, chapter_id):
        data = request.get_json()
        name = data.get("name")
        date_of_quiz = datetime.strptime(data.get("date_of_quiz"), "%Y-%m-%dT%H:%M")
        time_duration = data.get("time_duration")
        remarks = data.get("remarks")

        quiz = Quiz.query.get(id)
        if not quiz:
            return {"message": "Quiz not found"}
        if name:
            quiz.name = name
        if date_of_quiz:
            quiz.date_of_quiz = date_of_quiz
        if time_duration:
            quiz.time_duration = time_duration
        if remarks:
            quiz.remarks = remarks

        try:
            db.session.commit()
            return {"message": "Quiz updated successfully"}
        except Exception as e:
            db.session.rollback()
            return {"message": "Error updating quiz"}

    @marshal_with(quiz_field)
    @auth_required('token')
    def delete(self, id, chapter_id):
        quiz = Quiz.query.get(id)
        if not quiz:
            return {"message": "Quiz not found"}
        try:
            db.session.delete(quiz)
            db.session.commit()
            return {"message": "Quiz deleted successfully"}
        except Exception as e:
            return {"message": "Error deleting quiz"}
        

api.add_resource(QuizAPI, "/chapter/<int:chapter_id>/quiz/<int:id>")




class QuizListAPI(Resource):
    @marshal_with(quiz_field)
    @auth_required('token')
    def get(self, chapter_id):
        quizzes = Quiz.query.filter_by(chapter_id=chapter_id).all()
        # quizzes = Quiz.query.get(chapter_id)
        if not quizzes:
            return {"message": "No quizzes found"}
        return quizzes


    @marshal_with(quiz_field)
    @auth_required('token')
    def post(self, chapter_id):
        data = request.get_json()
        name = data.get("name")
        date_of_quiz = datetime.strptime(data.get("date_of_quiz"), "%Y-%m-%dT%H:%M")
        # date_of_quiz = data.get("date_of_quiz")
        time_duration = data.get("time_duration")
        remarks = data.get("remarks")

        quiz = Quiz()
        quiz.name = name
        quiz.chapter_id=chapter_id
        quiz.date_of_quiz = date_of_quiz
        quiz.time_duration = time_duration
        quiz.remarks = remarks

        try:
            db.session.add(quiz)
            db.session.commit()
            return {"message": "Quiz added successfully"}
        except Exception as e:
            return {"message": "Error adding quiz "+ str(e)}
        

api.add_resource(QuizListAPI, "/chapter/<int:chapter_id>/quiz")






question_field = {
    'id': fields.Integer,
    'quiz_id': fields.Integer,
    'question_statement': fields.String,
    'option1': fields.String,
    'option2': fields.String,
    'option3': fields.String,
    'option4': fields.String,
    'correct_option': fields.String
}

class QuestionListAPI(Resource):
    @marshal_with(question_field)
    @auth_required('token')
    # @cache.cached(timeout=600, key_prefix='all_questions')
    def get(self):
        questions = Question.query.all()
        return questions

api.add_resource(QuestionListAPI, '/questions')



class QuestionAPI(Resource):
    @marshal_with(question_field)
    @auth_required('token')
    def get(self, quiz_id):
        questions = Question.query.filter_by(quiz_id=quiz_id).all()
        return questions
    
    @marshal_with(question_field)
    @auth_required('token')
    def post(self, quiz_id):
        data = request.get_json()
        question_statement = data.get("question_statement")
        option1 = data.get("option1")
        option2 = data.get("option2")
        option3 = data.get("option3")
        option4 = data.get("option4")
        correct_option = data.get("correct_option")

        question = Question()
        question.quiz_id = quiz_id
        question.question_statement = question_statement
        question.option1 = option1
        question.option2 = option2
        question.option3 = option3
        question.option4 = option4
        question.correct_option = correct_option

        try:
            db.session.add(question)
            db.session.commit()
            # cache.delete("all_questions")
            return {"message": "Question added successfully"}
        except Exception as e:
            return {"message": "Error adding question "+ str(e)}

api.add_resource(QuestionAPI, '/quiz/<int:quiz_id>/question')



class QuestionUpdateAPI(Resource):
    @marshal_with(question_field)
    @auth_required('token')
    def get(self, id, quiz_id):
        questions = Question.query.get(id)
        return questions
    
    @marshal_with(question_field)
    @auth_required('token')
    def post(self, id, quiz_id):
        data = request.get_json()
        question_statement = data.get("question_statement")
        option1 = data.get("option1")
        option2 = data.get("option2")
        option3 = data.get("option3")
        option4 = data.get("option4")
        correct_option = data.get("correct_option")

        question = Question.query.get(id)
        if not question:
            return {"message": "Question not found"}

        if question_statement:
            question.question_statement = question_statement
        if option1:
            question.option1 = option1
        if option2:
            question.option1 = option2
        if option3:
            question.option1 = option3
        if option4:
            question.option1 = option4           
        if correct_option:
            question.correct_option = correct_option

        try:
            db.session.add(question)
            db.session.commit()
            # cache.delete("all_questions")
            return {"message": "Question added successfully"}
        except Exception as e:
            return {"message": "Error adding question "+ str(e)}
        

    @marshal_with(question_field)
    @auth_required('token')
    def delete(self, id, quiz_id):
        question = Question.query.get(id)
        if not question:
            return {"message": "Questions not found"}
        try:
            db.session.delete(question)
            db.session.commit()
            # cache.delete("all_questions")
            return {"message": "Questions deleted successfully"}
        except Exception as e:
            return {"message": "Error deleting Questions"}


api.add_resource(QuestionUpdateAPI, '/quiz/<int:quiz_id>/question/<int:id>')



# Define the marshalling schema for the Score model
score_fields = {
    'id': fields.Integer,
    'quiz_id': fields.Integer,
    'quiz_name': fields.String(attribute=lambda x: x.quiz.name),  
    'user_id': fields.Integer,
    'time_stamp_of_attempt': fields.DateTime(dt_format='rfc822'),
    'total_scored': fields.Integer
}

class ScoreAPI(Resource):
    @marshal_with(score_fields)
    @auth_required('token')
    # @cache.memoize(timeout=600)
    def get(self, user_id):
        scores = Score.query.filter_by(user_id=user_id).all()
        # scores = Score.query.filter_by(user_id=user_id).order_by(Score.total_scored.desc()).first()
        return scores

api.add_resource(ScoreAPI, '/user/<int:user_id>/score')

# class ScorePostAPI(Resource):
#     @marshal_with(score_fields)
#     @auth_required('token')
#     def post(self, user_id, quiz_id):
#         data = request.get_json()

#         # Retrieve the necessary fields from the payload.
#         total_scored = data.get("total_scored")
        
#         # Create a new Score record.
#         score = Score(
#             quiz_id=quiz_id,
#             user_id=user_id,
#             total_scored=total_scored
#             # time_stamp_of_attempt will be set automatically by the default.
#         )

#         try:
#             db.session.add(score)
#             db.session.commit()
#             return score
#         except Exception as e:
#             # Optionally, log the error and return a proper error message:
#             return {"message": "Error adding score: " + str(e)}


class ScorePostAPI(Resource):
    @marshal_with(score_fields)
    @auth_required('token')
    def post(self, user_id, quiz_id):
        data = request.get_json()

        # Retrieve the necessary total_scored field from the payload.
        total_scored = data.get("total_scored")
        if total_scored is None:
            abort(400, message="total_scored is required in the payload.")
        
        # Check if a score already exists for this user and quiz.
        # score = Score.query.filter_by(quiz_id=quiz_id, user_id=user_id).first()
        # if score:
        #     # Update the existing score.
        #     score.total_scored = total_scored
        #     score.time_stamp_of_attempt = datetime.now()
        # else:
            # Create a new Score record.
        score = Score()
        score.quiz_id=quiz_id
        score.user_id=user_id
        score.total_scored=total_scored
        db.session.add(score)

        try:
            db.session.commit()
            # cache.delete_memoized(ScoreAPI.get, user_id)
            return score
        except Exception as e:
            db.session.rollback()
            abort(500, message="Error adding/updating score: " + str(e))

# Add the Score API resource to your API endpoints.
api.add_resource(ScorePostAPI, '/user/<int:user_id>/quiz/<int:quiz_id>/score')


user_fields = {
    'id': fields.Integer,
    'email': fields.String,
    'full_name': fields.String,
    'qualification': fields.String,
    'dob': fields.String,      # Convert date to string (e.g., ISO format)
    'active': fields.Boolean,
    'average_marks': fields.Float,
    'total_attempts': fields.Integer,
    # Optionally include roles if needed:
    'roles': fields.List(fields.String(attribute='name'))
}

class UserListAPI(Resource):
    @marshal_with(user_fields)
    @auth_required('token')
    def get(self):
        # 1. Fetch only users who have the 'student' role
        # This ensures admins/staff are not listed in the student table
        users = User.query.join(User.roles).filter(Role.name == 'user').all()

        # 2. Calculate average score for each student
        for user in users:
            # Query the Score table specifically for this user_id
            avg_score = db.session.query(func.avg(Score.total_scored))\
                .filter(Score.user_id == user.id).scalar()
            
            
            # If avg_score is None (no attempts yet), default to 0
            user.average_marks = round(float(avg_score), 2) if avg_score else 0.0

            attempts_count = db.session.query(func.count(Score.id))\
                .filter(Score.user_id == user.id).scalar()
            user.total_attempts = attempts_count if attempts_count else 0
        
        return users
    
    # def get(self):
    #     # users = User.query.filter(Role.name == 'user').all()
    #     users = User.query.join(User.roles).filter(Role.name == 'user').all()
    #     return users

api.add_resource(UserListAPI, '/admin/all_users')

