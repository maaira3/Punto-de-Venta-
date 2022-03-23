from flask import Blueprint
from flask import Flask,request, jsonify, send_from_directory #pip install Flask
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS #pip install flask-cors
import os
from random import SystemRandom
from werkzeug.utils import secure_filename

dash_api = Blueprint('dash_api', __name__)

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

## --------------------------------------------------------- ##
## ----------------Gráfica de ventas anual ----------------- ##
## --------------------------------------------------------- ##

@dash_api.route('/api/dashboard/salesEnero/<year>/<rol>',  methods=['GET'])
def getSalesEnero(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-01-01' AND '{0}-01-31'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesFebrero/<year>/<rol>',  methods=['GET'])
def getSalesFebrero(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-02-01' AND '{0}-02-28'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesMarzo/<year>/<rol>',  methods=['GET'])
def getSalesMarzo(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-03-01' AND '{0}-03-31'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesAbril/<year>/<rol>',  methods=['GET'])
def getSalesAbril(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-04-01' AND '{0}-04-30'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesMayo/<year>/<rol>',  methods=['GET'])
def getSalesMayo(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-05-01' AND '{0}-05-31'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesJunio/<year>/<rol>',  methods=['GET'])
def getSalesJunio(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-06-01' AND '{0}-06-30'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesJulio/<year>/<rol>',  methods=['GET'])
def getSalesJulio(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-07-01' AND '{0}-07-31'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesAgosto/<year>/<rol>',  methods=['GET'])
def getSalesAgosto(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-08-01' AND '{0}-08-31'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesSeptiembre/<year>/<rol>',  methods=['GET'])
def getSalesSeptiembre(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-09-01' AND '{0}-09-30'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesOctubre/<year>/<rol>',  methods=['GET'])
def getSalesOctubre(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-10-01' AND '{0}-10-31'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesNoviembre/<year>/<rol>',  methods=['GET'])
def getSalesNoviembre(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-11-01' AND '{0}-11-30'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/salesDiciembre/<year>/<rol>',  methods=['GET'])
def getSalesDiciembre(year, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ventas WHERE fechaventa BETWEEN '{0}-12-01' AND '{0}-12-31'".format(year)
    cur.execute(sql, year) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)


## --------------------------------------------------------- ##
## --Gráficas de Productos, Ingredientes y Complementos----- ##
## --------------------------------------------------------- ##

@dash_api.route('/api/dashboard/graphdata/<rol>',  methods=['GET'])
def getGraphData(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT nombreproducto, count(nombreproducto) FROM ventasproducto GROUP BY nombreproducto LIMIT 5"
    cur.execute(sql) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/ingredientnot/<rol>',  methods=['GET'])
def getIngredientNot(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ingredientes WHERE cantidadingrediente <= cantidadnotificacioningrediente"
    cur.execute(sql) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/ingredient/<rol>',  methods=['GET'])
def getTotalIngredients(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM ingredientes"
    cur.execute(sql) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/complement/<rol>',  methods=['GET'])
def getSalesComplement(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT nombrecomplemento, COUNT(*)idcomplemento FROM ventascomplemento GROUP BY nombrecomplemento LIMIT 5"
    cur.execute(sql) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)
## --------------------------------------------------------- ##
## ----------Gráfica de Ventas de los empleados------------- ##
## --------------------------------------------------------- ##

@dash_api.route('/api/dashboard/doughnut/<rol>',  methods=['GET'])
def getProductsToday(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="""SELECT nombreempleado, count(*) from ventas AS a INNER JOIN empleados AS b
        ON a.idempleado = b.idempleado GROUP BY a.idempleado, nombreempleado"""
    cur.execute(sql) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)


## --------------------------------------------------------- ##
## ----------Tabla de transacciones del día ---------------- ##
## --------------------------------------------------------- ##

@dash_api.route('/api/dashboard/transactions/<fecha>/<rol>',  methods=['GET'])
def getTransactions(fecha, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = ('''SELECT empleados.idempleado, empleados.nombreempleado, to_char(fechaventa, 'YYYY-MM-DD') As fechaventa, totalventa, tipopago FROM ventas INNER JOIN empleados
                    ON ventas.idempleado = empleados.idempleado INNER JOIN pagos 
                    ON pagos.idpago = ventas.idpago AND ventas.fechaventa = '{0}' LIMIT 5'''.format(fecha))
    cur.execute(sql, fecha) 
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)


## --------------------------------------------------------- ##
## ---------------- Cards de Información ------------------- ##
## --------------------------------------------------------- ##

@dash_api.route('/api/dashboard/<fechaventa>/<rol>',  methods=['GET'])
def getSalesToday(fechaventa, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT SUM(totalventa) FROM ventas WHERE fechaventa = '{0}'".format(fechaventa)
    cur.execute(sql, fechaventa) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@dash_api.route('/api/dashboard/<rol>',  methods=['GET'])
def getProductNot(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT COUNT(*) FROM productos WHERE cantidadproducto <= cantidadnotificacionproducto"
    cur.execute(sql) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

