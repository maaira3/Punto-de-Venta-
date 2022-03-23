from flask import Blueprint
from flask import Flask,request, jsonify, send_from_directory #pip install Flask
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS #pip install flask-cors
import os
from random import SystemRandom
from werkzeug.utils import secure_filename

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

config_api = Blueprint('config_api', __name__)

## ------------------------------------------------------------------------------ ##
## ---------------Configuración del Tema, Logo y Colores------------------------- ##
## ------------------------------------------------------------------------------ ##

@config_api.route('/api/configuracion/editTema/<rol>', methods=['PUT'])
def editionTema(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE temas SET modo=%(estiloactivo1)s, color=%(temaescogido)s,logo=%(nombreempresa)s WHERE idtema=1"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='tema editado de manera satisfactoria!');

@config_api.route('/api/configuracion/getTemasEs/<rol>',  methods=['GET'])
def getTema(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT * FROM temas WHERE idtema=1"
    cur.execute(sql) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)


## ------------------------------------------------------------------------------ ##
## -------------Configuración de los permisos de los empleados------------------- ##
## ------------------------------------------------------------------------------ ##

@config_api.route('/api/configuracion/editPermisoEmpleados/<rol>', methods=['PUT'])
def editPermisoEmp(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE permisosusuarios SET acceso=%(permisoempleados)s WHERE idusuario=%(idusuario)s AND idpermiso=1"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='bien');

@config_api.route('/api/configuracion/editPermisoInventarios/<rol>', methods=['PUT'])
def editPermisoInv(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE permisosusuarios SET acceso=%(permisoinventarios)s WHERE idusuario=%(idusuario)s AND idpermiso=2"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='bien');

@config_api.route('/api/configuracion/editPermisoConfiguracion/<rol>', methods=['PUT'])
def editPermisoCon(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE permisosusuarios SET acceso=%(permisoconfiguracion)s WHERE idusuario=%(idusuario)s AND idpermiso=3"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='bien');

@config_api.route('/api/configuracion/editPermisoGestor/<rol>', methods=['PUT'])
def editPermisoGes(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE permisosusuarios SET acceso=%(permisogestor)s WHERE idusuario=%(idusuario)s AND idpermiso=4"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='bien');

@config_api.route('/api/configuracion/editPermisoProductos/<rol>', methods=['PUT'])
def editPermisoPro(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE permisosusuarios SET acceso=%(permisoproductos)s WHERE idusuario=%(idusuario)s AND idpermiso=5"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='bien');

@config_api.route('/api/configuracion/editPermisoVentas/<rol>', methods=['PUT'])
def editPermisoVen(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE permisosusuarios SET acceso=%(permisoventas)s WHERE idusuario=%(idusuario)s AND idpermiso=6"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='bien');

@config_api.route('/api/configuracion/editPermisoContabilidad/<rol>', methods=['PUT'])
def editPermisoConta(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE permisosusuarios SET acceso=%(permisocontabilidad)s WHERE idusuario=%(idusuario)s AND idpermiso=7"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='bien');

## ------------------------------------------------------------------------------ ##
## --------------Obtención de los datos de los empleados------------------------- ##
## ------------------------------------------------------------------------------ ##

@config_api.route('/api/configuracion/getEmpleados/<rol>',  methods=['GET'])
def getTEmpleados(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idempleado,nombreempleado FROM empleados"
    cur.execute(sql) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)

@config_api.route('/api/configuracion/getIdusuario/<idempleado>/<rol>',  methods=['GET'])
def getTUsuario(idempleado, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idusuario FROM usuarios WHERE idempleado={0}".format(idempleado)
    cur.execute(sql) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@config_api.route('/api/configuracion/getPermisos/<userid>/<rol>',  methods=['GET'])
def getTPermisos(userid, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idpermiso, acceso FROM permisosusuarios WHERE idusuario={0}".format(userid)
    cur.execute(sql) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)

## ------------------------------------------------------------------------------ ##
## --------------Obtención de los permisos de los empleados---------------------- ##
## ------------------------------------------------------------------------------ ##

@config_api.route('/api/permisos/<id>/<rol>',  methods=['GET'])
def getPermisos(id, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = "SELECT idpermiso, acceso FROM permisosusuarios WHERE idusuario = {0}".format(id)
    cur.execute(sql)
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@config_api.route('/api/usuario/<id>/<rol>',  methods=['GET'])
def getUsuario(id, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = "SELECT idusuario FROM usuarios WHERE idempleado = {0}".format(id)
    cur.execute(sql)
    rows = cur.fetchone()
    conn.close()
    return jsonify(rows)