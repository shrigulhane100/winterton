from flask import Flask
# from flask_login import login_required
from backend.config import LocalDevelopmentConfig
from backend.models import db, User, Role
from flask_security.core import Security
# from flask_sqlalchemy import SQLAlchemy
from flask_security.datastore import SQLAlchemyUserDatastore 
from flask_caching import Cache
from backend.celery.celery_factory import celery_init_app
import flask_excel as excel

def createApp():
    app = Flask(__name__, template_folder="frontend", static_folder="frontend", static_url_path="/static")
    app.config.from_object(LocalDevelopmentConfig)
    db.init_app(app)
    
    from flask_security.datastore import SQLAlchemyUserDatastore
    excel.init_excel(app)
    
    datastore = SQLAlchemyUserDatastore(db, User, Role)
    
    cache = Cache(app)
    cache.init_app(app)
    # app.cache = cache

    # app.security = Security(app, datastore=datastore, register_blueprint=False)
    security = Security()
    security.init_app(app, datastore=datastore, register_blueprint=False)
    app.app_context().push()


    from backend.resources import api
    api.init_app(app)
    return app



app = createApp()
celery_app = celery_init_app(app)
import backend.create_users
import backend.routes
from backend.models import Quiz

if (__name__ == "__main__"):
    app.run(debug=True)
