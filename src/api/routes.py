"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Master
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity  
from werkzeug.security import generate_password_hash, check_password_hash 

api = Blueprint('api', __name__)


CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


#Post

@api.route('/master', methods=['POST'])

def create_master():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    if email is None or username is None or password is None:
        return jsonify({
            'msg': 'Password, username and email required'
        }), 400
    
    query = db.select(Master).filter_by(email=email)  
    result = db.session.execute(query).scalars().first()

    if result:
        return jsonify({"msg": "Comuniquese con nosotros para obtener ingreso"}), 400
    
    password_hash = generate_password_hash(password)
    new_master = Master(email=email, username=username, password=password_hash)  # hash de la contraseña

    db.session.add(new_master)
    db.session.commit() 

    return jsonify({"msg": "Master created successfully"}), 200

#Post token

@api.route('/tokens', methods=['POST'])
def login():
    data = request.get_json()  #body sent
    email = data.get('email')
    
    password = data.get('password')

    if email is None or password is None:
        return jsonify({
            'msg': 'Comuniquese con nosotros para obtener ingreso'
        }), 400

    query = db.select(Master).filter_by(email=email)   
    result = db.session.execute(query).scalars().first()

    if result is None:
        return jsonify({"msg": "Comuniquese con nosotros para obtener ingreso"}), 400

    master = result
    password_is_valid = check_password_hash(master.password, password)
    if not password_is_valid:
        return jsonify({"msg": "CREDENCIALES NO VALIDAS"}), 400

    access_token = create_access_token(identity=str(master.id))

    return jsonify({
    "token": access_token
}), 201 

#Get master
@api.route('/master')
@jwt_required()
def private():
    master_id = get_jwt_identity()

    query = db.select(Master).filter_by(id=master_id)
    result = db.session.execute(query).scalars().first()
    if result is None:
        return jsonify({"msg": "Comuniquese con nosotros para obtener ingreso"}), 400
    master = result
    return jsonify({
        "acceso": "Successfuly access",
        "master": master.serialize()
    }), 201




