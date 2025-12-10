from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from bcrypt import hashpw, gensalt, checkpw
import re
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import Numeric
from werkzeug.security import generate_password_hash, check_password_hash
from typing import List
# este servirá cuando se haga la relación con categoría
from sqlalchemy.orm import relationship
db = SQLAlchemy()


class Master(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    username: Mapped[str] = mapped_column(String(120), nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "rol": 'master'
            # do not serialize the password, its a security breach
        }


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    username: Mapped[str] = mapped_column(String(120), nullable=False)
    role: Mapped[str] = mapped_column(String(50), nullable=False)
    orders_created: Mapped[List["Order"]] = relationship(back_populates="user")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(pwhash=self.password_hash, password=password)
        # try:
        #     return checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
        # except Exception as e:
        #     print(e)
        #     return False

    @staticmethod
    def is_valid_password(password):
        return bool(re.match(r'^[a-zA-Z0-9]+$', password))

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role
        }


class Category(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    category_code: Mapped[int] = mapped_column(
        Integer, unique=True, nullable=False)
    category_name: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    category_state: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False)
    creation_date: Mapped[int] = mapped_column(Integer, nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "category_code": self.category_code,
            "category_name": self.category_name,
            "category_state": self.category_state,
            "creation_date": self.creation_date
        }


class Product(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    product_name: Mapped[str] = mapped_column(String(120), nullable=False)
    product_SKU: Mapped[str] = mapped_column(String(120), nullable=False)
    stock: Mapped[int] = mapped_column(Integer, nullable=False)
    price: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False)
    # Precio con decimales exactos
    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.id"), nullable=False)
    
    category = relationship("Category")
    # image_url: Mapped[str] = mapped_column(String(1000), nullable=True) 
    

    def serialize(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "product_SKU": self.product_SKU,
            "stock": self.stock,
            "price": float(self.price),
            "is_active": self.is_active,
            # "category_id": self.category_id,
            # "category": self.category  
            "category": self.category.serialize()
        }


def validate_email_format(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(email_regex, email))


class Order(db.Model):
    __tablename__ = 'order'
    id: Mapped[int] = mapped_column(primary_key=True)

    # Datos del Cliente
    client_name: Mapped[str] = mapped_column(String(100), nullable=False)
    delivery_address: Mapped[str] = mapped_column(String(250), nullable=False)

    # Datos Financieros
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    # Estado y Fechas
    # 'Pending', 'Completed', 'Cancelled'
    status: Mapped[str] = mapped_column(String(50), default='Pending')
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now)

    # Relación con OrderItem (para obtener los detalles del pedido)
    items: Mapped[List["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan")

    created_by_user_id: Mapped[int] = mapped_column(
        ForeignKey('user.id'), nullable=False)
    user: Mapped["User"] = relationship(back_populates="orders_created")

    def serialize(self):
        return {
            "id": self.id,
            "client_name": self.client_name,
            "delivery_address": self.delivery_address,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "created_by_user_id": self.created_by_user_id,
            "total_amount": float(self.total_amount),
            "status": self.status,
            "items": [item.serialize() for item in self.items]
        }


class OrderItem(db.Model):
    __tablename__ = 'order_item'
    id: Mapped[int] = mapped_column(primary_key=True)

    # Relación con la Cabecera (Order)
    order_id: Mapped[int] = mapped_column(
        ForeignKey('order.id'), nullable=False)
    order: Mapped["Order"] = relationship(back_populates="items")

    # Relación con el Producto
    product_id: Mapped[int] = mapped_column(
        ForeignKey('product.id'), nullable=False)
    product: Mapped["Product"] = relationship()

    # Datos de la Venta (Cruciales)
    quantity_sold: Mapped[int] = mapped_column(Integer, nullable=False)

    # Precio de venta en el momento exacto (inmutable)
    price_at_sale: Mapped[float] = mapped_column(
        Numeric(10, 2), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "product_name": self.product.product_name,  # Opcional: para serialización
            "quantity_sold": self.quantity_sold,
            "price_at_sale": float(self.price_at_sale)
        }


if __name__ == '__main__':
    with db.app_context():
        db.create_all()
    db.run(debug=True, port=3000)
