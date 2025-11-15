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


# Post


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
    new_master = Master(email=email, username=username,
                        password=password_hash)  # hash de la contraseña

    db.session.add(new_master)
    db.session.commit()

    return jsonify({"msg": "Master created successfully"}), 200

# Post token


@api.route('/token', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data.get('email') or not data.get('username') or not data.get('password'):
            return jsonify({
                'success': False,
                'message': 'Todos los campos son obligatorios'
            }), 400

        email = data['email'].strip().lower()
        username = data['username'].strip()
        password = data['password']

        user_by_email = User.query.filter_by(email=email).first()
        if not user_by_email:
            return jsonify({
                'success': False,
                'message': 'Credenciales no validas'
            }), 400

        user_by_username = User.query.filter_by(username=username).first()

        if not user_by_username:
            return jsonify({
                'success': False,
                'message': 'Credenciales no validas'
            }), 404

        if not user_by_email.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Credencial no valida '
            }), 401

        # Crear token JWT
        access_token = create_access_token(identity=user_by_email.id)

        return jsonify({
            'success': True,
            'message': 'Login exitoso',
            'token': access_token,
            'user': user_by_email.serialize()
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error del servidor: {str(e)}'
        }), 500


@api.route('/token/master', methods=['POST'])
def login_master():
    data = request.get_json()  # body sent
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


@api.route('/user/<int:current_user_id>', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({
        'message': f'Acceso concedido para {user.username}',
        'user': user.serialize()
    })

# Get master


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


@api.route('/user', methods=['POST'])
@jwt_required()  # 👈 ¡SEGURIDAD! Solo accesible con un token válido.
def create_user():
    # 1. OBTENER EL ID DEL MASTER LOGEADO
    master_id = get_jwt_identity()

    # 2. OBTENER DATOS DEL FORMULARIO DE REACT
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')  # 👈 Campo añadido: 'Administrador' o 'Vendedor'

    # 3. VALIDACIÓN DE DATOS REQUERIDOS
    if email is None or password is None or username is None or role is None:
        return jsonify({
            'msg': 'Email, username, password y role son campos requeridos.'
        }), 400

    # 4. VERIFICAR ROL VÁLIDO (opcional, pero recomendado)
    if role not in ['Administrator', 'Seller']:
        return jsonify({
            'msg': 'El rol debe ser "Administrator" o "Seller".'
        }), 400

    # 5. VERIFICAR QUE EL EMAIL NO EXISTA YA (para el modelo User)
    query = db.select(User).filter_by(email=email)
    result = db.session.execute(query).scalars().first()

    if result:
        return jsonify({"msg": "Ya existe un usuario con este email."}), 400

    # 6. CREACIÓN DEL NUEVO USUARIO
    password_hash = generate_password_hash(password)

    new_user = User(
        email=email,
        username=username,
        password=password_hash,
        role=role,
        master_id=master_id  # 👈 ¡ESTO LIGA EL USUARIO AL MASTER!
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "msg": "User created successfully",
        "user": new_user.serialize()
    }), 201
