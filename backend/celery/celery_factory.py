
from celery import Celery, Task
from flask import Flask

class CeleryConfig():
    broker_url = 'redis://localhost:6379/0'
    result_backend = 'redis://localhost:6379/1'
    timezone = 'Asia/Kolkata'

def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(CeleryConfig)
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app



































# # celery_factory.py
# from celery import Celery, Task
# from flask import Flask

# class CeleryConfig():
#     broker_url = 'redis://localhost:6379/0'
#     result_backend = 'redis://localhost:6379/1'
#     timezone = 'Asia/Kolkata'

# # Move FlaskTask out of celery_init_app to be a top-level class
# class FlaskTask(Task):
#     def __call__(self, *args: object, **kwargs: object) -> object:
#         with kwargs["app"].app_context():  # Access app context from kwargs
#             return self.run(*args, **kwargs)

# def celery_init_app(app: Flask) -> Celery:
#     celery_app = Celery(app.name, task_cls=FlaskTask)
#     celery_app.config_from_object(CeleryConfig)
#     celery_app.set_default()
#     app.extensions["celery"] = celery_app
#     return celery_app

































# from celery import Celery, Task
# from flask import Flask

# class CeleryConfig():
#     broker_url = 'redis://localhost:6379/0'
#     result_backend = 'redis://localhost:6379/1'
#     timezone = 'Asia/Kolkata'

# def celery_init_app(app: Flask) -> Celery:
#     class FlaskTask(Task):
#         def __call__(self, *args:object, **kwargs:object) -> object:
#             with app.app_context():
#                 return self.run(*args, **kwargs)
            
#     celery_app = Celery(app.name, task_cls=FlaskTask)
#     celery_app.config_from_object(CeleryConfig)
#     celery_app.set_default()
#     app.extensions['celery'] = celery_app
#     return celery_app



