"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Master, Category, Product
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
                'message': 'Credenciales no validas email'
            }), 400

        user_by_username = User.query.filter_by(username=username).first()

        if not user_by_username:
            return jsonify({
                'success': False,
                'message': 'Credenciales no validas username'
            }), 404

        if not user_by_email.check_password(password):
            return jsonify({
                'success': False,
                'message': 'Credencial no valida '
            }), 401

        # Creae identity

        user_identity = {
            'id': user_by_email.id,
            'rol': user_by_email.role
        }

        # Crear token JWT

        access_token = create_access_token(identity=str(user_identity))

        return jsonify({
            'success': True,
            'message': 'Login exitoso',
            'token': access_token,
            'user': user_by_email.serialize()
        }), 200

    except Exception as e:
        print(e)
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

    master_identity = {
        'id': master.id,
        'rol': 'master'
    }

    access_token = create_access_token(identity=str(master_identity))

    return jsonify({
        "success": True,
        "message": "Master login exitoso",
        "token": access_token,
        "user": master.serialize()
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
    master_identity = dict(get_jwt_identity())

    if master_identity.get('rol') != 'master':
        return jsonify({"msg": "Comuniquese con nosotros para obtener ingreso"}), 403

    query = db.select(Master).filter_by(id=master_identity.get('id'))
    result = db.session.execute(query).scalars().first()
    if result is None:
        return jsonify({"msg": "Comuniquese con nosotros para obtener ingreso"}), 400
    master = result
    return jsonify({
        "acceso": "Successfuly access",
        "master": master.serialize()
    }), 200

@api.route('/users', methods=['GET'])
# @jwt_required() 
def get_all_users():
    # 1. Verificar si la identidad actual es un 'Master' o 'Administrator' si es necesario.
    #    Por ahora, solo requerimos que esté logeado (jwt_required()).

    # 2. Consultar todos los registros de la tabla User
    users = db.session.execute(db.select(User)).scalars().all()

    # 3. Serializar la lista de objetos User
    #    La función 'serialize()' definida en el modelo User se encarga de convertir el objeto
    #    de la base de datos a un diccionario de Python.
    serialized_users = [user.serialize() for user in users]

    # 4. Devolver la respuesta en formato JSON
    return jsonify({
        "msg": "Users retrieved successfully",
        "users": serialized_users
    }), 200


@api.route('/user', methods=['POST'])
@jwt_required()  # 👈 ¡SEGURIDAD! Solo accesible con un token válido.
def create_user():
    # 1. OBTENER EL ID DEL MASTER LOGEADO
    # master_id = get_jwt_identity()

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
        password_hash=password_hash,
        role=role,
        # master_id=master_id  # 👈 ¡ESTO LIGA EL USUARIO AL MASTER!
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "msg": "User created successfully",
        "user": new_user.serialize()
    }), 201

# POST PRODUCT


@api.route('/product', methods=['POST'])
def create_product():
    try:
        data = request.get_json()

        product_name = data.get('product_name')
        category_id = data.get('category_id')
        price = data.get('price')
        product_SKU = data.get('product_SKU')
        stock = data.get('stock')

        # Valida sicampos vacíos
        if not all([product_name, category_id, price, product_SKU, stock]):
            return jsonify({'msg': 'Please fill all fields'}), 400

        # Verificar si hay un SKU repetido
        exists = db.session.execute(
            db.select(Product).filter_by(product_SKU=product_SKU)
        ).scalars().first()

        if exists:
            return jsonify({'msg': 'Product already exists'}), 400

        # Crear nuevo producto
        new_product = Product(  # manda a llamar al modelo product
            product_name=product_name,  # adding all of this
            product_SKU=product_SKU,
            stock=stock,
            price=price,
            category_id=category_id
        )

        db.session.add(new_product)  # agrega el nuevo producto a a la db
        db.session.commit()

        return jsonify({"message": "Product created successfully"}), 201

    except Exception as e:  # saving the errorinside e

        # printing the error to the console for debugging
        print("SERVER ERROR:", str(e))
        return jsonify({
            "error": "Internal Server Error",
            "msg": "Server not working"
        }), 500


@api.route('/category', methods=['POST'])
def create_category():
    try:
        data = request.get_json()

        category_code = data.get('category_code')
        category_name = data.get('category_name')
        category_state = data.get('category_state', True)
        creation_date = data.get('creation_date')

        # Validar campos requeridos
        if not all([category_code, category_name, creation_date]):
            return jsonify({'msg': 'Please fill all required fields'}), 400

        # Verificar si el código de categoría ya existe
        existing_code = db.session.execute(
            db.select(Category).filter_by(category_code=category_code)
        ).scalars().first()

        if existing_code:
            return jsonify({'msg': 'Category code already exists'}), 400

        # Verificar si el nombre de categoría ya existe
        existing_name = db.session.execute(
            db.select(Category).filter_by(category_name=category_name)
        ).scalars().first()

        if existing_name:
            return jsonify({'msg': 'Category name already exists'}), 400

        # Crear nueva categoría
        new_category = Category(
            category_code=category_code,
            category_name=category_name,
            category_state=category_state,
            creation_date=creation_date
        )

        db.session.add(new_category)
        db.session.commit()

        return jsonify({"msg": "Category created successfully"}), 201

    except Exception as e:
        print("SERVER ERROR:", str(e))
        return jsonify({
            "error": "Internal Server Error",
            "msg": "Server not working"
        }), 500


@api.route('/categories', methods=['GET'])
def get_all_categories():
    try:
        categories = db.session.execute(db.select(Category)).scalars().all()
        serialized_categories = [category.serialize()
                                 for category in categories]

        return jsonify({
            "msg": "Categories retrieved successfully",
            "categories": serialized_categories
        }), 200

    except Exception as e:
        print("SERVER ERROR:", str(e))
        return jsonify({
            "error": "Internal Server Error",
            "msg": "Server not working"
        }), 500

@api.route('/user', methods=['GET'])
@jwt_required()
def get_users():
    try:
        users = db.session.execute(db.select(User)).scalars().all()
        result = users
        if result is None:
            return jsonify({
                "msg": "there's no users to display"
            }), 400 
        serialized_users = [user.serialize() for user in users]
        return jsonify({
            "user": serialized_users
        }), 200
    except Exception as e:
        print("SERVER ERROR:", str(e))
        return jsonify({
            "msg": "Server not working",
            "error numero 2": str(e)
        }), 500

#Delete 
@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    try:

        data = request.get_json()

        user_id = data.get('user_id')
        user_name = data.get('user_name')

        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg" : "there's no users to display"}), 400 

        db.session.delete(user)
        db.session.commit()
        return jsonify({
            "msg": "User delete correctly",
            "user": user_name, 
            "id": user_id
                        }), 201
    except Exception as e:
        # print("SERVER ERROR:", str(e))
        return jsonify({
            "msg": "Server not working"
        }), 500





#     'user_id' : Int, para el frontend
#     'username' : Str



 



