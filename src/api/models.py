from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column
from bcrypt import hashpw, gensalt, checkpw
import re
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from sqlalchemy import Numeric
from werkzeug.security import generate_password_hash, check_password_hash
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
    # Precio con decimales exactos
    category_id: Mapped[int] = mapped_column(
        ForeignKey("category.id"), nullable=False)
    # Descomentar cuando se tenga la tabla de categoría, por favor
    category = relationship("Category")
    # image_url: Mapped[str] = mapped_column(String(1000), nullable=True) duda para el maestro, si hay que poner tabla la image
    # es correcto poner category_id en vez de category_name_id

    def serialize(self):
        return {
            "id": self.id,
            "product_name": self.product_name,
            "product_SKU": self.product_SKU,
            "stock": self.stock,
            "price": self.price,
            # "category_id": self.category_id,
            # "category": self.category  # Descomentar cuando se tenga la tabla de categoría, por favor
            "category": self.category.serialize()
        }


def validate_email_format(email):
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(email_regex, email))


if __name__ == '__main__':
    with db.app_context():
        db.create_all()
    db.run(debug=True, port=3000)
