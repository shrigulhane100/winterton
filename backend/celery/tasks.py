from celery import shared_task
from backend.models import Chapter, Score
import flask_excel

@shared_task(ignore_result = False)
def add(x, y):
    return x+y

@shared_task(ignore_results= False)
def create_csv():
    resources = Score.query.all()
    column_names = [column.name for column in Score.__table__.columns]
    csv_output = flask_excel.make_response_from_query_sets(resources, column_names=column_names, file_type='csv')


    with open('./backend/celery/user_download/UserScore.csv', 'wb') as file:
        file.write(csv_output.data)

    return 'UserScore.csv'