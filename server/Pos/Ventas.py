from flask import Blueprint
from flask import Flask,request, jsonify, send_from_directory #pip install Flask
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS #pip install flask-cors
import os
from random import SystemRandom
from werkzeug.utils import secure_filename

ventas_api = Blueprint('ventas_api', __name__)

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
## -----------------------Catalogo de productos y filtros------------------------ ##
## ------------------------------------------------------------------------------ ##

@ventas_api.route('/api/sales/cuenta/<rol>',  methods=['GET'])
def getImageCuenta(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT qrcuenta FROM cuenta WHERE idcuenta = 1")
    rows = cur.fetchone()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/products/<rol>',  methods=['GET'])
def getAllProducts(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT idproducto, nombreproducto, precioproducto, descripcionproducto, imagebproducto FROM productos")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/products/price1/<rol>',  methods=['GET'])
def getProductsByPrice1(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT idproducto, nombreproducto, precioproducto, descripcionproducto FROM productos WHERE precioproducto <= 50")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/products/price2/<rol>',  methods=['GET'])
def getProductsByPrice2(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT idproducto, nombreproducto, precioproducto, descripcionproducto FROM productos WHERE precioproducto > 50 AND precioproducto <= 500")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/products/price3/<rol>',  methods=['GET'])
def getProductsByPrice3(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT idproducto, nombreproducto, precioproducto, descripcionproducto FROM productos WHERE precioproducto > 500")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/products/category/<idcategoria>/<rol>',  methods=['GET'])
def getProductsByCategory(idcategoria, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = ('''SELECT idproducto, nombreproducto, precioproducto, descripcionproducto, nombrecategoria FROM productos 
            INNER JOIN categorias ON productos.idcategoria = {0} AND categorias.idcategoria = productos.idcategoria'''.format(idcategoria))
    cur.execute(sql, idcategoria)
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/products/name/<search>/<rol>',  methods=['GET'])
def getProductByName(search, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = ("SELECT idproducto, nombreproducto, precioproducto, descripcionproducto FROM productos WHERE nombreproducto = '{0}'".format(search))
    cur.execute(sql, search)
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/products/id/<search>/<rol>',  methods=['GET'])
def getProductById(search, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = ("SELECT idproducto, nombreproducto, precioproducto, descripcionproducto FROM productos WHERE idproducto = '{0}'".format(search))
    cur.execute(sql, search)
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/getproducts/<id>/<rol>',  methods=['GET'])
def getProduct(id, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = ("SELECT idproducto, nombreproducto, precioproducto, descripcionproducto, imagebproducto FROM productos WHERE idproducto = '{0}'".format(id))
    cur.execute(sql, id)
    rows = cur.fetchone()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/categories/<rol>',  methods=['GET'])
def getCategories(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT idcategoria, nombrecategoria FROM categorias ORDER BY idcategoria")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)
   
@ventas_api.route('/api/complements/<id>/<rol>',  methods=['GET'])
def getListComplements(id, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT idcomplemento, nombrecomplemento, preciocomplemento, descripcioncomplemento FROM complementos WHERE idproducto = '{0}'".format(id))
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/modifiers/<id>/<rol>',  methods=['GET'])
def getListModifiers(id, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('''SELECT modificadores.idmodificador, nombremodificador, preciomodificador, obligatorio FROM modificadores INNER JOIN productosmodificadores 
                ON productosmodificadores.idproducto = '{0}' AND modificadores.idmodificador = productosmodificadores.idmodificador '''.format(id))
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/options/<idmodificador>/<rol>',  methods=['GET'])
def getListOptions(idmodificador, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute('''SELECT opciones.idopcionmodificador, idmodificador, nombreopcion, precioopcionmodificador, idingrediente, opcionporcion FROM opciones JOIN modificadoresopciones
                ON modificadoresopciones.idmodificador = {0} AND opciones.idopcionmodificador = modificadoresopciones.idopcionmodificador'''.format(idmodificador))
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/categories/<idcategoria>/<rol>',  methods=['GET'])
def getProducts(idcategoria, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idproducto, nombreproducto, descripcionproducto, precioproducto, idcategoria FROM productos WHERE idcategoria = {0}".format(idcategoria)
    cur.execute(sql, idcategoria) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)
## ------------------------------------------------------------------------------ ##
## -----------Verificacion de Cantidades de productos e Ingredientes ------------ ##
## ------------------------------------------------------------------------------ ##

@ventas_api.route('/api/sales/verification/<id>/<rol>',  methods=['GET'])
def verifyCantProduct(id, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT cantidadproducto FROM productos WHERE idproducto = '{0}'".format(id)
    cur.execute(sql, id) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@ventas_api.route('/api/sales/verification/complement/<id>/<rol>',  methods=['GET'])
def updateComplemento(id, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idproductooriginal FROM complementos WHERE idcomplemento = '{0}'".format(id)
    cur.execute(sql, id) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@ventas_api.route('/api/sales/verification/ingredient/portion/<idproducto>/<rol>',  methods=['GET'])
def getPortion(idproducto, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT porcion FROM productosingredientes WHERE idproducto = '{0}'".format(idproducto)
    cur.execute(sql, idproducto) 
    row = cur.fetchall()
    conn.close()
    return jsonify(row)

## ------------------------------------------------------------------------------ ##
## ----------Verificacion de productos simples o productos compuestos------------ ##
## ------------------------------------------------------------------------------ ##

@ventas_api.route('/api/sales/verification/products/complements/<search>/<rol>',  methods=['GET'])
def verifyProductComplement(search, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = ("SELECT idcomplemento FROM complementos WHERE idproducto = '{0}'".format(search))
    cur.execute(sql, search)
    rows = cur.fetchone()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/verification/products/modifiers/<search>/<rol>',  methods=['GET'])
def verifyProductModifier(search, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = ("SELECT idmodificador FROM productosmodificadores WHERE idproducto = '{0}'".format(search))
    cur.execute(sql, search)
    rows = cur.fetchone()
    conn.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/verifyproduct/<idproducto>/<rol>', methods=['GET'])
def verifyProducts(idproducto, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = "SELECT cantidadproducto FROM productos WHERE idproducto ='{0}'".format(idproducto)
    cur.execute(sql, idproducto) 
    rows = cur.fetchone()
    conn.close()
    cur.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/verifyingredients/<idproducto>/<rol>', methods=['GET'])
def verifyIngredients(idproducto, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = """SELECT cantidadingrediente FROM productosingredientes INNER JOIN ingredientes ON
            productosingredientes.idproducto = '{0}' AND productosingredientes.idingrediente = ingredientes.idingrediente""".format(idproducto)
    cur.execute(sql, idproducto) 
    rows = cur.fetchone()
    conn.close()
    cur.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/verifycomplements/<idcomplemento>/<rol>', methods=['GET'])
def verifyComplement(idcomplemento, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = """SELECT cantidadproducto FROM complementos INNER JOIN productos ON
            complementos.idcomplemento = {0} AND complementos.idproductooriginal = productos.idproducto""".format(idcomplemento)
    cur.execute(sql, idcomplemento) 
    rows = cur.fetchone()
    conn.close()
    cur.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/verifycomplementsingredients/<idcomplemento>/<rol>', methods=['GET'])
def verifyComplementIngredients(idcomplemento, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = """SELECT cantidadingrediente FROM complementos INNER JOIN productosingredientes ON
            complementos.idcomplemento = {0} AND complementos.idproductooriginal = productosingredientes.idproducto
            INNER JOIN ingredientes ON productosingredientes.idingrediente = ingredientes.idingrediente""".format(idcomplemento)
    cur.execute(sql, idcomplemento) 
    rows = cur.fetchone()
    conn.close()
    cur.close()
    return jsonify(rows)

@ventas_api.route('/api/sales/verifymodifiersingredients/<idopcion>/<rol>', methods=['GET'])
def verifyModifierIngredients(idopcion, rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql = """SELECT cantidadingrediente FROM ingredientes INNER JOIN opciones ON 
            opciones.idopcionmodificador = {0} AND opciones.idingrediente = ingredientes.idingrediente""".format(idopcion)
    cur.execute(sql, idopcion) 
    rows = cur.fetchone()
    conn.close()
    cur.close()
    return jsonify(rows)
## ------------------------------------------------------------------------------ ##
## ----------- Cambios en las cantidades de productos e ingredientes------------- ##
## ------------------------------------------------------------------------------ ##

@ventas_api.route('/api/sales/updateproduct/<rol>', methods=['PUT'])
def updateProducts(rol):
    data = request.json
    conn = conexionRol(rol)
    cur = conn.cursor()
    sql = "UPDATE productos SET cantidadproducto = cantidadproducto - {0} WHERE idproducto='{1}'".format(data['cantidad'], data['idproducto'])
    cur.execute(sql, data) 
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg="employee updated")

@ventas_api.route('/api/sales/updateingredient/<rol>', methods=['PUT'])
def updateIngredients(rol):
    data = request.json
    conn = conexionRol(rol)
    cur = conn.cursor()
    sql = """update ingredientes set cantidadingrediente = cantidadingrediente - {0} from productosingredientes
            where productosingredientes.idproducto = '{1}' and ingredientes.idingrediente = productosingredientes.idingrediente""".format(data['porcion'], data['idproducto'])
    cur.execute(sql, data) 
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg="ingredient updated")

@ventas_api.route('/api/sales/modifier/updateingredient/<rol>', methods=['PUT'])
def updateModifierIngredients(rol):
    data = request.json
    conn = conexionRol(rol)
    cur = conn.cursor()
    sql = "UPDATE ingredientes SET cantidadingrediente = cantidadingrediente - {0} WHERE idingrediente = '{1}'"-format(data['porcion'], data['idingrediente'])
    cur.execute(sql, data) 
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg="ingredient updated")


## ------------------------------------------------------------------------------ ##
## ------------------Inserciones en las tablas de ventas------------------------- ##
## ------------------------------------------------------------------------------ ##

@ventas_api.route('/api/sales/venta/<rol>', methods=['POST'])
def addSale(rol):
    data = request.json
    conn = conexionRol(rol)
    cur = conn.cursor()
    sql = """INSERT INTO ventas (idempleado, idcliente, idpago, totalventa, fechaventa, horaventa )
             VALUES (%(idusuario)s,%(idcliente)s, %(idpago)s, %(totalventa)s, %(fechaventa)s, %(horaventa)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added successfully!')

@ventas_api.route('/api/sales/addsaleproduct/<rol>', methods=['POST'])
def addSaleProduct(rol):
    data = request.json
    conn = conexionRol(rol)
    cur = conn.cursor()
    sql = """INSERT INTO ventasproducto (idusuario, idproducto, cantidad, nombreproducto, notas, subtotal, totalproductos )
             VALUES (%(idusuario)s,%(idproducto)s, %(cantidad)s, %(nombre)s, %(nota)s, %(precio)s, %(total)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added successfully!')

@ventas_api.route('/api/sales/addsalecomplement/<rol>', methods=['POST'])
def addSaleComplement(rol):
    data = request.json
    conn = conexionRol(rol)
    cur = conn.cursor()
    sql = """INSERT INTO ventascomplemento (idusuario, idcomplemento, nombrecomplemento, cantidad, subtotal, totalcomplemento )
             VALUES (%(idusuario)s,%(idcomplemento)s, %(nombre)s, %(cantidad)s, %(precio)s, %(total)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added successfully!')

@ventas_api.route('/api/sales/addsalemodifier/<rol>', methods=['POST'])
def addSaleModifier(rol):
    data = request.json
    conn = conexionRol(rol)
    cur = conn.cursor()
    sql = """INSERT INTO ventasmodificadores (idusuario, idmodificador, idopcionmodificador, nombremodificador, nombreopcion, subtotal, totalmodificador )
             VALUES (%(idusuario)s,%(idmod)s, %(idop)s, %(nombremod)s, %(nombreop)s, %(precio)s, %(precio)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added successfully!')