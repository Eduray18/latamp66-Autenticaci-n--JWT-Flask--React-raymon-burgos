import os
from flask import request, jsonify, Blueprint
from api.models import db, User, Expense
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

api = Blueprint('api', __name__)
CORS(api)

# --- 1. AUTENTICACIÓN ---

@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    if not body or "email" not in body or "password" not in body:
        return jsonify({"msg": "Email y contraseña requeridos"}), 400

    # Encriptación con scrypt
    password_hash = generate_password_hash(body["password"], method='scrypt')
    new_user = User(
        email=body["email"], 
        password=password_hash, 
        name=body.get("name", "Usuario"),
        is_active=True
    )
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario creado con éxito"}), 201
    except Exception as e:
        return jsonify({"msg": "El email ya está registrado"}), 400

@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    user = User.query.filter_by(email=body.get("email")).first()

    if user and check_password_hash(user.password, body.get("password")):
        # Creamos el token usando el ID del usuario
        token = create_access_token(identity=str(user.id))
        return jsonify({
            "token": token, 
            "user": user.serialize()
        }), 200
    
    return jsonify({"msg": "Email o contraseña incorrectos"}), 401

# --- 2. GESTIÓN DE GASTOS HORMIGA ---

@api.route('/expense', methods=['POST'])
@jwt_required()
def add_expense():
    user_id = get_jwt_identity()
    body = request.get_json()
    
    if not body or "item" not in body or "amount" not in body:
        return jsonify({"msg": "Faltan datos del gasto"}), 400

    new_expense = Expense(
        user_id=user_id,
        item=body["item"],
        amount=float(body["amount"])
    )
    
    db.session.add(new_expense)
    db.session.commit()
    return jsonify({"msg": "Gasto registrado", "expense": new_expense.serialize()}), 201

@api.route('/expenses/today', methods=['GET'])
@jwt_required()
def get_today_expenses():
    user_id = get_jwt_identity()
    today = datetime.utcnow().date()
    
    expenses = Expense.query.filter_by(user_id=user_id, date=today).all()
    total = sum(e.amount for e in expenses)
    
    return jsonify({
        "total_today": total,
        "expenses": [e.serialize() for e in expenses]
    }), 200