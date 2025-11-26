"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from api.models import db, User, Master, Category, Product, Order, OrderItem
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.exc import SQLAlchemyError

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
                        password=password_hash)

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

    users = db.session.execute(db.select(User)).scalars().all()
    serialized_users = [user.serialize() for user in users]

    return jsonify({
        "msg": "Users retrieved successfully",
        "users": serialized_users
    }), 200


@api.route('/user', methods=['POST'])
@jwt_required()
def create_user():

    # 1. OBTENER EL ID DEL MASTER LOGEADO
    # master_id = get_jwt_identity()

    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if email is None or password is None or username is None or role is None:
        return jsonify({
            'msg': 'Email, username, password y role son campos requeridos.'
        }), 400

    if role not in ['Administrator', 'Seller']:
        return jsonify({
            'msg': 'El rol debe ser "Administrator" o "Seller".'
        }), 400

    query = db.select(User).filter_by(email=email)
    result = db.session.execute(query).scalars().first()

    if result:
        return jsonify({"msg": "Ya existe un usuario con este email."}), 400

    password_hash = generate_password_hash(password)

    new_user = User(
        email=email,
        username=username,
        password_hash=password_hash,
        role=role,
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

        if not all([product_name, category_id, price, product_SKU, stock]):
            return jsonify({'msg': 'Please fill all fields'}), 400

        exists = db.session.execute(
            db.select(Product).filter_by(product_SKU=product_SKU)
        ).scalars().first()

        if exists:
            return jsonify({'msg': 'Product already exists'}), 400

        new_product = Product(
            product_name=product_name,
            product_SKU=product_SKU,
            stock=stock,
            price=price,
            category_id=category_id
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product created successfully"}), 201

    except Exception as e:

        print("SERVER ERROR:", str(e))
        return jsonify({
            "error": "Internal Server Error ON PRODUCTS",
            "msg": "Server not working"
        }), 500


@api.route('/products', methods=['GET'])
def get_all_products():
    try:
        products = db.session.execute(db.select(Product)).scalars().all()
        serialized_products = [product.serialize() for product in products]

        return jsonify({
            "msg": "Products retrieved successfully",
            "products": serialized_products
        }), 200

    except Exception as e:
        print("SERVER ERROR (get_all_products):", str(e))
        return jsonify({
            "error": "Internal Server Error",
            "msg": "Server not working or database error"
        }), 500


@api.route('/category', methods=['POST'])
def create_category():
    try:
        data = request.get_json()

        category_code = data.get('category_code')
        category_name = data.get('category_name')
        category_state = data.get('category_state', True)
        creation_date = data.get('creation_date')

        if not all([category_code, category_name, creation_date]):
            return jsonify({'msg': 'Please fill all required fields'}), 400

        existing_code = db.session.execute(
            db.select(Category).filter_by(category_code=category_code)
        ).scalars().first()

        if existing_code:
            return jsonify({'msg': 'Category code already exists'}), 400

        existing_name = db.session.execute(
            db.select(Category).filter_by(category_name=category_name)
        ).scalars().first()

        if existing_name:
            return jsonify({'msg': 'Category name already exists'}), 400

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

# Delete


@api.route('/user', methods=['DELETE'])
@jwt_required()
def delete_user():
    try:

        data = request.get_json()

        user_id = data.get('user_id')
        user_name = data.get('user_name')

        user = User.query.get(user_id)
        if not user:
            return jsonify({"msg": "there's no users to display"}), 400

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


@api.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()

    # 1. Validación de campos obligatorios
    if not data or not all(k in data for k in ['client_name', 'delivery_address', 'order_items']):
        return jsonify({"msg": "Faltan datos obligatorios del pedido."}), 400

    if not isinstance(data.get('order_items'), list) or not data['order_items']:
        return jsonify({"msg": "La lista de productos (order_items) es inválida o está vacía."}), 400

    # 2. INICIO DE LA TRANSACCIÓN
    try:
        # A. Recalcular el total y verificar el stock
        calculated_total = 0

        # B. Consultar los productos para VALIDAR PRECIOS y EXISTENCIA (No Stock)
        product_ids = [item['product_id'] for item in data['order_items']]
        products_query = db.session.execute(
            select(Product).where(Product.id.in_(product_ids))
        ).scalars().all()
        products_map = {p.id: p for p in products_query}

        for item in data['order_items']:
            product_id = item.get('product_id')
            quantity_sold = item.get('quantity_sold')

            product = products_map.get(product_id)

            # C. Validación y Cálculo
            if not product:
                return jsonify({"msg": f"Producto con ID {product_id} no encontrado."}), 404

            price = float(product.price)
            calculated_total += quantity_sold * price

        new_order = Order(
            client_name=data['client_name'],
            delivery_address=data['delivery_address'],
            total_amount=calculated_total,
            status='Pending'  # El estado inicial es Pendiente
        )

        db.session.add(new_order)
        db.session.flush()

        # E. Crear los Detalles de la Orden y Actualizar el Stock
        for item in data['order_items']:
            product_id = item['product_id']
            quantity_sold = item['quantity_sold']
            # Usamos el mapa para obtener el objeto
            product_info = products_map[product_id]
            price_at_sale = float(product_info.price)

            new_order_item = OrderItem(
                order_id=new_order.id,
                product_id=product_id,
                quantity_sold=quantity_sold,
                price_at_sale=price_at_sale
            )
            db.session.add(new_order_item)

        db.session.commit()

        return jsonify({
            "msg": "Orden creada exitosamente y está Pendiente de Aprobación.",
            "order": new_order.serialize()
        }), 201

    except Exception as e:
        # G. ROLLBACK: Si algo falla, deshacer todo
        db.session.rollback()
        print(f"Error al crear la orden: {e}")
        return jsonify({"msg": "Error interno del servidor al procesar la orden.", "error": str(e)}), 500


@api.route('/orders/<int:order_id>/approve', methods=['PUT'])
def approve_order(order_id):
    # Asumimos que solo usuarios autorizados (ej. Administradores o Vendedores) pueden hacer esto
    # Puedes añadir @jwt_required() aquí.

    # INICIO DE LA TRANSACCIÓN
    try:
        # 1. Cargar la Orden y sus Ítems relacionados
        order = db.session.execute(
            select(Order)
            .where(Order.id == order_id)
            .options(joinedload(Order.items).joinedload(OrderItem.product))
        ).scalars().first()

        if not order:
            return jsonify({"msg": "Orden no encontrada."}), 404

        if order.status != 'Pending':
            return jsonify({"msg": f"La orden ya fue {order.status}."}), 400

        products_to_update = {}

        # 2. VALIDACIÓN DE STOCK (CRÍTICO)
        for item in order.items:
            product = item.product
            quantity_sold = item.quantity_sold

            # 2.1. Validación de existencia
            if not product:
                return jsonify({"msg": f"Producto ID {item.product_id} no existe en inventario."}), 404

            # 2.2. Validación de Stock
            if product.stock < quantity_sold:
                # Si falla el stock para un ítem, abortamos toda la operación
                return jsonify({
                    "msg": f"ERROR: Stock insuficiente para aprobar la orden.",
                    "product_name": product.product_name,
                    "available_stock": product.stock,
                    "required": quantity_sold
                }), 400

            # Almacenamos la referencia para la actualización
            products_to_update[product.id] = product

        # 3. ACTUALIZACIÓN DEL STOCK Y EL ESTADO
        for item in order.items:
            product = products_to_update[item.product_id]

            # Reducir el stock
            product.stock -= item.quantity_sold
            db.session.add(product)

        # 4. Actualizar el estado de la Orden a 'Completed'
        order.status = 'Completed'
        db.session.add(order)

        # 5. COMMIT: Guardar la aprobación de la orden y la reducción de stock
        db.session.commit()

        return jsonify({
            "msg": "Orden aprobada exitosamente y stock actualizado.",
            "order": order.serialize()
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Error de base de datos al aprobar la orden: {e}")
        return jsonify({"msg": "Error de base de datos al procesar la aprobación."}), 500
    except Exception as e:
        db.session.rollback()
        print(f"Error al aprobar la orden: {e}")
        return jsonify({"msg": "Error interno del servidor."}), 500
