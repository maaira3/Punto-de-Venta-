from flask import Flask,request, jsonify, send_from_directory #pip install Flask
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS #pip install flask-cors
import os
from random import SystemRandom
from werkzeug.utils import secure_filename
from Pos.Dashboard import dash_api
from Pos.Ventas import ventas_api
from Pos.Configuracion import config_api
from Pos.Contabilidad import conta_api
from Pos.Empleados import empleado_api
from Pos.Inventarios import inv_api

#JWT libraries
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app)

def conexion():
    return psycopg2.connect(
    host="localhost",
    database="puntodeventa",
    user="postgres",
    password="root")

def conexionRol(role):
    return psycopg2.connect(
    host="localhost",
    database="puntodeventa",
    user=role,
    password="root")


# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "dsankldqwp2310953nc812245" 
jwt = JWTManager(app)


os.makedirs(os.path.join(app.instance_path, 'uploads'), exist_ok=True)
IMAGE_FOLDER= os.path.join(app.instance_path, 'uploads')

ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

##------------------Blueprints------------------------##
app.register_blueprint(dash_api)
app.register_blueprint(ventas_api)
app.register_blueprint(config_api)
app.register_blueprint(conta_api)
app.register_blueprint(empleado_api)
app.register_blueprint(inv_api)


## ------------------------------------------------------------------------------ ##
## -----------------Verificacion del usuario en el login ------------------------ ##
## ------------------------------------------------------------------------------ ##

@app.route('/api/login', methods=['POST'])
def verifyLogin():
    conn = conexion()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    data=request.json
    print(data)
    sql1="SELECT b.nombreempresa as nombreempresa FROM usuariosgenerales a LEFT JOIN empresas b ON a.idempresa=b.idempresa WHERE a.usuariogeneral='{0}' AND a.contrasenausuariogeneral='{1}'".format(data['username'],data['password'])
    cur.execute(sql1)
    nombreempresa = cur.fetchone()
    conn.close()
    row=None
    if(nombreempresa!=None):
        rol=nombreempresa['nombreempresa']
        conn = conexionRol(rol)
        cur = conn.cursor(cursor_factory=RealDictCursor)
        sql="SELECT a.idempleado as idempleado, a.nombreempleado as nombreempleado, c.nombrecargo as nombrecargo FROM empleados a LEFT JOIN usuarios b ON a.idempleado=b.idempleado LEFT JOIN perfil c ON a.idcargo=c.idcargo WHERE b.usuario='{0}' AND b.contrasena='{1}'".format(data['username'],data['password'])
        cur.execute(sql)
        row = cur.fetchone()
        conn.close()
    if (row==None):
        return jsonify('0')
    access_token = create_access_token(identity=data['username'])
    row['access_token'] = access_token
    row['role'] = nombreempresa['nombreempresa']
    return jsonify(row)

## ------------------------------------------------------------------------------ ##
## ------------- Se rescata el email del usuario en el login -------------------- ##
## ------------------------------------------------------------------------------ ##

@app.route('/api/userEmail',  methods=['POST'])
def getEmailUser():
    conn = conexion()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    data=request.json
    print(data)
    sql1="SELECT b.nombreempresa as nombreempresa FROM usuariosgenerales a LEFT JOIN empresas b ON a.idempresa=b.idempresa WHERE a.usuariogeneral='{0}'".format(data['username'])
    cur.execute(sql1)
    nombreempresa = cur.fetchone()
    conn.close()
    if (nombreempresa==None):
        return jsonify('0')
    rol=nombreempresa['nombreempresa']
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sq2="SELECT a.emailempleado, a.nombreempleado,  b.contrasena FROM empleados a LEFT JOIN usuarios b ON b.idempleado=a.idempleado WHERE usuario= '{0}'".format(data['username'])
    cur.execute(sq2)
    row = cur.fetchone()
    conn.close()
    if (row==None):
        return jsonify(0)
    return jsonify(row)

    
@app.route('/api/inventario/bringImgs/<filename>/<rol>')
def uploaded_file(filename, rol):
    return send_from_directory(IMAGE_FOLDER, path=filename, as_attachment=False)

@app.route('/api/inventario/manejoImgs/<id>/<rol>', methods=['PUT'])
def uploadimage(id, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    if 'file' not in request.files:
        return jsonify(' not got it, file in not requested files')
    file=request.files['file']
    if file.filename== '':
        return jsonify('not got it, no name')
    if file and allowed_file(file.filename):
        filename=secure_filename(file.filename)
        file.save(os.path.join(app.instance_path, 'uploads', filename))
        cur.execute("UPDATE productos SET imagebproducto=(%s) WHERE idproducto= '{0}' ".format(id),(filename,))
        conn.commit()
        return jsonify('got it: '+filename)
    else:
        return jsonify('extensiones permitidas: jpg, jpeg, png')

@app.route('/api/cuentas/manejoImgs/<rol>', methods=['PUT'])
def uploadimagecuenta(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    if 'file' not in request.files:
        return jsonify(' not got it, file in not requested files')
    file=request.files['file']
    if file.filename== '':
        return jsonify('not got it, no name')
    if file and allowed_file(file.filename):
        filename=secure_filename(file.filename)
        file.save(os.path.join(app.instance_path, 'uploads', filename))
        cur.execute("UPDATE cuenta SET qrcuenta='{0}' WHERE idcuenta= 1 ".format(filename,))
        conn.commit()
        return jsonify('got it: '+filename)
    else:
        return jsonify('extensiones permitidas: jpg, jpeg, png')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)


#python3 -m venv venv
#activar entorno virtual
#venv\Scripts\activate