# from flask import Flask, jsonify, request, current_app as app
# from flask_security import Security, SQLAlchemyUserDatastore, auth_required, hash_password, verify_password
# from backend.config import LocalDevelopmentConfig

from datetime import date
from flask import current_app as app
from backend.models import db, User, Role
from flask_security.datastore import SQLAlchemyUserDatastore
from flask_security.utils import hash_password
from flask_security.core import Security
from backend.config import LocalDevelopmentConfig

with app.app_context():
    db.create_all()
    userdatastore = SQLAlchemyUserDatastore(db, User, Role)
    # security = Security(app, userdatastore)
    userdatastore.find_or_create_role(name="admin", description="Primary Admin")
    userdatastore.find_or_create_role(name="user", description="Primary user")

    if not userdatastore.find_user(email="user@admin.com"):
        userdatastore.create_user(email="user@admin.com", qualification="Phd", dob=date(1990, 1, 1), password=hash_password("1234"), roles=["admin"], full_name="Thomus Shawn")

    if not userdatastore.find_user(email="user@user.com"):
        userdatastore.create_user(email="user@user.com", qualification="UG", dob=date(1990, 1, 1), password=hash_password("1234"), roles=["user"], full_name="John Robert")

    db.session.commit()
    

