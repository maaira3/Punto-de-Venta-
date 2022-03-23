from flask import Blueprint
from flask import Flask,request, jsonify, send_from_directory #pip install Flask
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS #pip install flask-cors
import os
from random import SystemRandom
from werkzeug.utils import secure_filename

conta_api = Blueprint('conta_api', __name__)

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


## ------------------------------------------------------------------------------ ##
## --------------------------Operaciones de contabilidad------------------------- ##
## ------------------------------------------------------------------------------ ##

@conta_api.route('/api/contabilidad/sumaParciales/<rol>/<fecha>',  methods=['GET'])
def getSumaParciales(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(total) FROM movimientos WHERE fechamovimiento>='{0}' AND razon='parcial'".format(fecha)
    cur.execute(sql) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/ultimosMovimientos/<rol>/<fecha>',  methods=['GET'])
def getultimosMovimientos(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT to_char(fechamovimiento, 'YYYY-MM-DD HH24:MI:SS') As fechamovimiento,razon,descripcion,total,usuarios.usuario FROM movimientos JOIN usuarios ON movimientos.idusuario=usuarios.idusuario WHERE fechamovimiento>='{0}' AND (razon='parcial' OR razon='observacion') ORDER BY fechamovimiento DESC".format(fecha)
    cur.execute(sql) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/inversionPeriodoPasado/<rol>/<fecha>',  methods=['GET'])
def getInversionPeriodoPasado(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(total) FROM movimientos WHERE fechamovimiento>='{0}' AND razon='carga'".format(fecha)
    cur.execute(sql, fecha) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/ultimosAperturas/<rol>',  methods=['GET'])
def getultimosAperturas(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT to_char(fechaapertura, 'YYYY-MM-DD HH24:MI:SS') As fechaapertura,idcortecaja,saldoapertura FROM cortescaja ORDER BY fechaapertura DESC"
    cur.execute(sql) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/editApertura/<rol>', methods=['PUT'])
def editionApertura(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE cortescaja SET fechaapertura=NOW(), saldoapertura=%(montoapertura)s WHERE idcortecaja=%(idcorte)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited succesfully');

@conta_api.route('/api/contabilidad/ultimoApertura/<rol>',  methods=['GET'])
def getultimoApertura(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT to_char(fechaapertura, 'YYYY-MM-DD HH24:MI:SS') As fechaapertura,idcortecaja,saldoapertura FROM cortescaja ORDER BY fechaapertura DESC"
    cur.execute(sql) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/insertContabilidadMovimiento/<rol>', methods=['POST'])
def insercionMoveCont(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO movimientos (tipo,razon,descripcion,total,idusuario,fechamovimiento) values(%(tipo)s,%(razon)s,%(descripcionmov)s,%(totalretiro)s,%(idusuario)s,NOW())"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='movimiento registrado');

@conta_api.route('/api/contabilidad/insertPrimerApertura/<rol>', methods=['POST'])
def insercionPrimerApertura(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO cortescaja (subtotalcorte,totalcorte,saldoapertura, idusuario,fechaapertura,fechacorte,cuenta) values(0,0,%(montoapertura)s, %(idusuario)s,NOW(),'2021-01-01 00:00:00', %(cuenta)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='movimiento registrado');

@conta_api.route('/api/contabilidad/insertCierre/<rol>', methods=['POST'])
def insercionCierreCaja(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO cortescaja (totalcorte, subtotalcorte,saldoapertura,idusuario,fechaapertura,fechacorte,cuenta) values(%(totalrecaudado)s,%(recuento)s, %(fondodecambio)s, %(idusuario)s, NOW(), NOW(),%(cuenta)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='cierre registrado');

@conta_api.route('/api/contabilidad/DatosUltimoCierre/<rol>',  methods=['GET'])
def getUltimoCierre(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT usuarios.idusuario,usuario,totalcorte,saldoapertura,to_char(fechacorte, 'DD/MM/YYYY HH24:MI:SS') As fechacorte, to_char(fechaapertura, 'DD/MM/YYYY HH24:MI:SS') As fechaapertura FROM usuarios JOIN cortescaja ON usuarios.idusuario=cortescaja.idusuario ORDER BY fechacorte DESC "
    cur.execute(sql) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/VentasHastaAhora/<rol>/<fecha>',  methods=['GET'])
def getVentasDesdeApertura(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(totalventa) FROM ventas WHERE fechaventa>='{0}' AND idpago=1".format(fecha)
    cur.execute(sql, fecha) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/VentasHastaAhoraTarjetas/<rol>/<fecha>',  methods=['GET'])
def getVentasHoyT(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(totalventa) FROM ventas WHERE fechaventa>='{0}' AND idpago=2".format(fecha)
    cur.execute(sql, fecha) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/VentasHastaAhoraVales/<rol>/<fecha>',  methods=['GET'])
def getVentasHoyV(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(totalventa) FROM ventas WHERE fechaventa>='{0}' AND idpago=3".format(fecha)
    cur.execute(sql, fecha) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/CajaHastaAhora/<rol>/<fecha>',  methods=['GET'])
def getCajaHoy(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT totalcorte,saldoapertura FROM cortescaja ORDER BY fechacorte DESC"
    cur.execute(sql, fecha) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/GastosCaja/<rol>/<fecha>',  methods=['GET'])
def getRetirosHoy(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(total) FROM movimientos WHERE fechamovimiento>='{0}' AND razon = 'retiro' ".format(fecha)
    cur.execute(sql, fecha) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@conta_api.route('/api/contabilidad/CambiosCaja/<rol>/<fecha>',  methods=['GET'])
def getCambiosHoy(rol,fecha):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(total) FROM movimientos WHERE fechamovimiento>='{0}' AND razon = 'cambio' ".format(fecha)
    cur.execute(sql, fecha) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

    conn = conexion()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(total) FROM movimientos WHERE fechamovimiento>='{0}' AND razon = 'cambio' ".format(fecha)
    cur.execute(sql, fecha) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)