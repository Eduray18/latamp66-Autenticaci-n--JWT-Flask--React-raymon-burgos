"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

# 1. IMPORTACIONES DE SEGURIDAD (JWT y Hashing)
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend"
    }
    return jsonify(response_body), 200

# -----------------------------------------------------------
# 2. RUTA DE REGISTRO (SIGNUP) - Tarea: No guardar clave real
# -----------------------------------------------------------
@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()

    # Validar que lleguen los datos
    if body is None:
        return jsonify({"msg": "Body is empty"}), 400
    if "email" not in body or "password" not in body:
        return jsonify({"msg": "Email and password required"}), 400

    # Tarea: Aplicar HASH a la contraseña antes de guardar
    password_hash = generate_password_hash(body["password"])

    # Crear el nuevo usuario
    new_user = User(email=body["email"], password=password_hash, is_active=True)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg": "Usuario creado con éxito"}), 201
    except Exception as e:
        return jsonify({"msg": "Error al crear usuario, quizás el email ya existe"}), 400

# -----------------------------------------------------------
# 3. RUTA DE LOGIN - Tarea: Autenticación JWT
# -----------------------------------------------------------
@api.route('/login', methods=['POST'])
def handle_login():
    body = request.get_json()
    email = body.get("email", None)
    password = body.get("password", None)

    # Buscar al usuario por email
    user = User.query.filter_by(email=email).first()

    if user is None:
        return jsonify({"msg": "Usuario no encontrado"}), 404
    
    # Tarea: Comparar la clave escrita con el HASH guardado
    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Contraseña incorrecta"}), 401

    # Si todo está bien, creamos el Token (Ticket de entrada)
    access_token = create_access_token(identity=str(user.id))
    return jsonify({"token": access_token, "user_id": user.id}), 200