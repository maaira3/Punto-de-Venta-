from flask import Blueprint
from flask import Flask,request, jsonify, send_from_directory #pip install Flask
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_cors import CORS #pip install flask-cors
import os
from random import SystemRandom
from werkzeug.utils import secure_filename

inv_api = Blueprint('inv_api', __name__)

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
## ------------------------------Manejo de inventarios--------------------------- ##
## ------------------------------------------------------------------------------ ##

@inv_api.route('/api/inventario/getActualUser/<rol>/<id>',  methods=['GET'])
def getUserInv(rol,id):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idusuario FROM usuarios WHERE idempleado = {0}".format(id)
    cur.execute(sql, id) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@inv_api.route('/api/inventario/insertInventarioMovimiento/<rol>', methods=['POST'])
def insercionMoveInv(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO movimientos (tipo,razon,descripcion,total,idusuario,fechamovimiento) values(%(tipo)s,%(razon)s,%(descripcionmov)s,%(totalinversion)s,%(idusuarioes)s,NOW())"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='movimiento de entrada agregado')
    

@inv_api.route('/api/inventario/getActualProduct/<rol>/<id>',  methods=['GET'])
def getProductsInv(rol,id):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idproducto,nombreproducto,precioproducto,costoproducto,descripcionproducto,idunidad,imagebproducto,cantidadproducto,cantidadnotificacionproducto,productos.idcategoria,nombrecategoria FROM productos JOIN categorias ON productos.idcategoria=categorias.idcategoria WHERE productos.idproducto = '{0}'".format(id)
    cur.execute(sql, id) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)


@inv_api.route('/api/inventario/getInventario2/<rol>/<int:valor>', methods=['GET'])
def selectall2(rol,valor):
    conn=conexionRol(rol)
    cur=conn.cursor(cursor_factory= RealDictCursor)
    if valor ==1:
        cur.execute("SELECT c.nombreproveedor, b.costo, a.nombreingrediente, a.idunidad, a.idingrediente,a.cantidadingrediente,b.fecha,TO_CHAR(b.fecha, 'DD/MM/YYYY') AS fecha FROM ingredientes a LEFT JOIN ingredientesproveedores b ON a.idingrediente=b.idingrediente LEFT JOIN proveedores c ON c.idproveedor=b.idproveedor ORDER BY a.nombreingrediente")
    if valor ==4:
        cur.execute("SELECT c.nombreproveedor, b.costo, a.nombreingrediente, a.idunidad, a.idingrediente,a.cantidadingrediente,b.fecha,TO_CHAR(b.fecha, 'DD/MM/YYYY') AS fecha FROM ingredientes a LEFT JOIN ingredientesproveedores b ON a.idingrediente=b.idingrediente LEFT JOIN proveedores c ON c.idproveedor=b.idproveedor WHERE a.cantidadnotificacioningrediente>a.cantidadingrediente")
    if valor ==6:
        cur.execute("SELECT c.nombreproveedor, b.costo, a.nombreingrediente, a.idunidad, a.idingrediente,b.cantidad,b.fecha,TO_CHAR(b.fecha, 'DD/MM/YYYY') AS fecha FROM ingredientes a LEFT JOIN ingredientesproveedores b ON a.idingrediente=b.idingrediente LEFT JOIN proveedores c ON c.idproveedor=b.idproveedor ORDER BY b.fecha DESC")
    if valor ==2:
        cur.execute("SELECT c.nombreproveedor, a.costoproducto,a.precioproducto,a.descripcionproducto, a.nombreproducto, a.idunidad, a.idproducto,a.cantidadproducto,b.fecha,TO_CHAR(b.fecha, 'DD/MM/YYYY') AS fecha FROM productos a LEFT JOIN productosproveedores b ON a.idproducto=b.idproducto LEFT JOIN proveedores c ON c.idproveedor=b.idproveedor ORDER BY a.nombreproducto")
    if valor ==3:
        cur.execute("SELECT c.nombreproveedor, a.costoproducto,a.precioproducto,a.descripcionproducto, a.nombreproducto, a.idunidad, a.idproducto,a.cantidadproducto,b.fecha,TO_CHAR(b.fecha, 'DD/MM/YYYY') AS fecha FROM productos a LEFT JOIN productosproveedores b ON a.idproducto=b.idproducto LEFT JOIN proveedores c ON c.idproveedor=b.idproveedor WHERE a.cantidadnotificacionproducto>a.cantidadproducto")
    if valor ==5:
        cur.execute("SELECT c.nombreproveedor, a.costoproducto,a.precioproducto,a.descripcionproducto, a.nombreproducto, a.idunidad, a.idproducto,b.cantidad,b.fecha,TO_CHAR(b.fecha, 'DD/MM/YYYY') AS fecha FROM productos a LEFT JOIN productosproveedores b ON a.idproducto=b.idproducto LEFT JOIN proveedores c ON c.idproveedor=b.idproveedor ORDER BY b.fecha DESC")
    if valor ==7:
        cur.execute("SELECT idproducto,cantidadmerma,descripcionmerma,nombreproducto,idunidad,fechareporte,TO_CHAR(fechareporte, 'DD/MM/YYYY') AS fechareporteZ FROM reportesMermas ORDER BY fechareporteZ DESC")
    if valor ==8:
        cur.execute("SELECT descripcion,total,to_char(fechamovimiento, 'YYYY-MM-DD HH24:MI:SS') As fechamovimiento, usuarios.usuario AS usuario FROM movimientos JOIN usuarios ON usuarios.idusuario=movimientos.idusuario WHERE (razon='carga' AND fechamovimiento>current_date-interval '5' day) ORDER BY fechamovimiento DESC")
    rows=cur.fetchall()
    conn.close()
    cur.close()
    return jsonify(rows)


@inv_api.route('/api/inventario/getInventario/<rol>/<int:valor>', methods=['GET'])
def selectall(rol,valor):
    conn=conexionRol(rol)
    cur=conn.cursor(cursor_factory= RealDictCursor)
    if valor ==1:
        cur.execute("SELECT * FROM ingredientes")
    if valor ==4:
        cur.execute("SELECT * FROM ingredientes WHERE cantidadnotificacioningrediente>cantidadingrediente")
    if valor ==6:
        cur.execute("SELECT * FROM ingredientes")
    if valor ==2:
        cur.execute("SELECT idproducto,nombreproducto,precioproducto,costoproducto,descripcionproducto,idcategoria,idunidad,cantidadproducto,cantidadnotificacionproducto FROM productos")
    if valor ==3:
        cur.execute("SELECT idproducto,nombreproducto,precioproducto,costoproducto,descripcionproducto,idcategoria,idunidad,cantidadproducto,cantidadnotificacionproducto FROM productos WHERE cantidadnotificacionproducto>cantidadproducto")
    if valor ==5:
        cur.execute("SELECT idproducto,nombreproducto,precioproducto,costoproducto,descripcionproducto,idcategoria,idunidad,cantidadproducto,cantidadnotificacionproducto FROM productos")
    rows=cur.fetchall()
    conn.close()
    cur.close()
    return jsonify(rows)

@inv_api.route('/api/inventario/getActualIngredient/<rol>/<ids>',  methods=['GET'])
def getIngredientsInv(rol,ids):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT a.idunidad, a.cantidadingrediente, a.idingrediente, a.nombreingrediente, a.cantidadnotificacioningrediente, b.idproveedor, b.costo, c.nombreproveedor FROM ingredientes a LEFT JOIN ingredientesproveedores b ON a.idingrediente=b.idingrediente LEFT JOIN proveedores c ON c.idproveedor=b.idproveedor WHERE a.idingrediente = '{0}' ORDER BY a.nombreingrediente".format(ids) 
    cur.execute(sql,ids) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@inv_api.route('/api/inventario/insertProduct/<rol>', methods=['POST'])
def insercionProductInv(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO productos (idproducto, nombreproducto, descripcionproducto, precioproducto, costoproducto, idcategoria, cantidadnotificacionproducto, idunidad, cantidadproducto) values(%(productcode)s,%(productname)s,%(productdescrip)s,%(productprice)s,%(productcost)s,1, %(productstocknotif)s,%(productunidad)s, %(productstock)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added succesfully');

@inv_api.route('/api/inventario/editProduct/<rol>', methods=['PUT'])
def editionProductInv(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE productos SET nombreproducto=%(productname)s, descripcionproducto=%(productdescrip)s, precioproducto=%(productprice)s, costoproducto=%(productcost)s, idcategoria=1, cantidadnotificacionproducto=%(productstocknotif)s, idunidad=%(productunidad)s, cantidadproducto= %(stockParcial1)s WHERE idproducto=%(productcode)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited succesfully');

@inv_api.route('/api/inventario/editProductMerma/<rol>', methods=['PUT'])
def editionProductMermaInv(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE productos SET cantidadproducto= %(stockParcial1)s WHERE idproducto=%(productcode)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited succesfully');

@inv_api.route('/api/inventario/editIngredientMerma/<rol>', methods=['PUT'])
def editionIngredientMermaInv(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE ingredientes SET cantidadingrediente= %(stockParcial1)s WHERE idingrediente=%(productcode)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited succesfully');

@inv_api.route('/api/inventario/editIngredient/<rol>', methods=['PUT'])
def editionIngredientInv(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE ingredientes SET nombreingrediente=%(productname)s, cantidadingrediente=%(stockParcial1)s, cantidadnotificacioningrediente=%(productstocknotif)s, idunidad=%(productunidad)s WHERE idingrediente=%(productcode)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited succesfully');

@inv_api.route('/api/inventario/editProveedorPro/<rol>', methods=['PUT'])
def editionProveedorPro(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE proveedores SET nombreproveedor=%(productproveedor)s WHERE idproveedor=%(productidproveedor)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited succesfully');

@inv_api.route('/api/inventario/editCategoriaPro/<rol>', methods=['PUT'])
def editionCategoriaPro(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE categorias SET nombrecategoria=%(productcategoria)s WHERE idcategoria=%(productIdcategoria)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited completely succesfully');

@inv_api.route('/api/inventario/editProveedorPro2/<rol>', methods=['PUT'])
def editionProveedorPro2(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE productosproveedores SET idproveedor=%(productidproveedor)s,costo=%(productcost)s,cantidad=%(productstock)s, fecha=NOW() WHERE idproducto=%(productcode)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited succesfully');

@inv_api.route('/api/inventario/editProveedorIng2/<rol>', methods=['PUT'])
def editionProveedorIng2(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE ingredientesproveedores SET idproveedor=%(productidproveedor)s,costo=%(productcost)s,cantidad=%(productstock)s, fecha=NOW() WHERE idingrediente=%(productcode)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='edited succesfully');

@inv_api.route('/api/inventario/insertIngredient/<rol>', methods=['POST'])
def insercionIngredientInv(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO ingredientes (idingrediente,nombreingrediente,cantidadingrediente, idunidad,cantidadnotificacioningrediente) values(%(productcode)s,%(productname)s,%(productstock)s,%(productunidad)s,%(productstocknotif)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added succesfully');

@inv_api.route('/api/inventario/mermaProducto/<rol>', methods=['POST'])
def insercionMermaProducto(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO reportesmermas(idproducto,cantidadmerma, descripcionmerma,fechareporte,nombreproducto,idunidad)values(%(productcode)s,%(productcantidad)s,%(productdescrip)s, NOW(),%(productname)s,%(productunidad)s )"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added succesfully');

@inv_api.route('/api/inventario/getProveedor/<rol>/<proveedor>',  methods=['GET'])
def getProveedor(rol, proveedor):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT * FROM proveedores WHERE nombreproveedor = '{0}'".format(proveedor) 
    cur.execute(sql,proveedor) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@inv_api.route('/api/inventario/getCategoria/<rol>/<categoria>',  methods=['GET'])
def getCategoria(rol,categoria):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT * FROM categorias WHERE nombrecategoria = '{0}'".format(categoria) 
    cur.execute(sql,categoria) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@inv_api.route('/api/inventario/getActualProveedorId/<rol>/<idproducto>',  methods=['GET'])
def getProveedorId(rol,idproducto):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idproveedor FROM productosproveedores WHERE idproducto = '{0}'".format(idproducto) 
    cur.execute(sql,idproducto) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@inv_api.route('/api/inventario/getActualProveedorIdIng/<rol>/<idingrediente1>',  methods=['GET'])
def getProveedorIdIng(rol,idingrediente1):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT idproveedor,costo FROM ingredientesproveedores WHERE idingrediente = '{0}'".format(idingrediente1) 
    cur.execute(sql,idingrediente1) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@inv_api.route('/api/inventario/getActualProveedorName/<rol>/<idproveedor>',  methods=['GET'])
def getProveedorName(rol,idproveedor):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    sql="SELECT nombreproveedor FROM proveedores WHERE idproveedor = {0}".format(idproveedor) 
    cur.execute(sql,idproveedor) 
    row = cur.fetchone()
    conn.close()
    return jsonify(row)

@inv_api.route('/api/inventario/insertProveedor/<rol>', methods=['POST'])
def insercionProveedor(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO proveedores(compania,nombreproveedor,direccionproveedor,telproveedor)values('',%(productproveedor)s,'',0)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added succesfully');

@inv_api.route('/api/inventario/insertCategoria/<rol>', methods=['POST'])
def insercionCategoria(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO categorias(nombrecategoria)values(%(productcategoria)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added succesfully');

@inv_api.route('/api/inventario/insertCategoria2/<rol>', methods=['PUT'])
def insercionCategoria2(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""UPDATE productos SET idcategoria=%(idcategoria1)s WHERE idproducto=%(productcode)s"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='la inserción se realizó con éxito');

@inv_api.route('/api/inventario/insertProveedorProduct/<rol>', methods=['POST'])
def insercionProveedorProducto(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO productosproveedores(idproveedor, idproducto, cantidad,costo, fecha)values(%(idproveedor1)s,%(productcode)s,%(productstock)s, %(productcost)s, NOW())"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added succesfully');

@inv_api.route('/api/inventario/insertProveedorIng/<rol>', methods=['POST'])
def insercionProveedorIngrediente(rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO ingredientesproveedores(idproveedor, cantidad,costo, fecha, idingrediente)values(%(idproveedor1)s,%(productstock)s, %(productcost)s, NOW(),%(productcode)s)"""
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added succesfully');

## ------------------------------------------------------------------------------ ##
## ---------------------- Agregar productos al inventario ----------------------- ##
## ------------------------------------------------------------------------------ ##
#Obtiene la lista de unidades ordenadas por el id
@inv_api.route('/api/products/units/<rol>',  methods=['GET'])
def getUnits(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM unidades ORDER BY idunidad")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

#Obtiene la lista de ingredientes con el nombre de la unidad
@inv_api.route('/api/ingredients/<rol>',  methods=['GET'])
def getListIngredients(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT a.idingrediente, a.nombreingrediente, b.nombreunidad FROM ingredientes a LEFT JOIN unidades b ON a.idunidad=b.idunidad")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

#Verifica que la categoria no exista y si no existe la agrega y devuelve idcategoria
@inv_api.route('/api/products/category/<rol>',  methods=['POST'])
def newCategory(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    data=request.json
    sql="SELECT * FROM categorias WHERE nombrecategoria= '{0}'".format(data['namecategory'])
    cur.execute(sql)
    row = cur.fetchone()
    cur.close()
    if (row!=None):
        conn.close()
        return jsonify(0)
    else:
        cur = conn.cursor()
        sql = "INSERT INTO categorias (nombrecategoria) VALUES (%(namecategory)s)"
        cur.execute(sql, data)
        cur.close()
        cur1 = conn.cursor()
        sql="SELECT idcategoria FROM categorias WHERE nombrecategoria= '{0}'".format(data['namecategory'])
        cur1.execute(sql)
        row1 = cur1.fetchone()
        conn.commit()
        conn.close()
        cur1.close()
        return jsonify(row1)

#Devuelve lista de productos con el nombre y su id
@inv_api.route('/api/products/<rol>',  methods=['GET'])
def getListProducts(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT nombreproducto, idproducto FROM productos")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

#Inserta un nuevo modificador e inserta en la tabla de productosmodificadores y devuelve idmodificador del modificador insertado
@inv_api.route('/api/products/modifiers/<idproducto>/<rol>', methods=['POST'])
def newModifier(idproducto, rol):
    conn = conexionRol(rol)
    cur = conn.cursor()
    data = request.json
    sql = "INSERT INTO modificadores (nombremodificador, preciomodificador,obligatorio) VALUES ('{0}', '{1}', '{2}') RETURNING idmodificador".format(data['namemodifier'],data['pricemodifier'],data['requiredchecked'])
    if(data['idmodifieroriginal']==''):
        cur.execute(sql, data)
        idmodificador= cur.fetchone()
        d = {}
        d['idproduct'] = idproducto
        d['idmodifier'] = idmodificador[0]
    else:
        d = {}
        d['idmodifier']=data['idmodifieroriginal']
        d['idproduct'] = idproducto
        idmodificador=[1]
    sql2 = "INSERT INTO productosmodificadores (idproducto, idmodificador) VALUES ('{0}', '{1}')".format(d['idproduct'],d['idmodifier'])
    cur.execute(sql2, d)
    conn.commit()
    cur.close()
    conn.close()
    return jsonify(idmodificador[0])

#Inserta una nueva opcion e inserta en la tabla modificadoresopciones
@inv_api.route('/api/products/modifiers/options/<idmodificador>/<rol>', methods=['POST'])
def newOptionModifier(idmodificador, rol):
    conn = conexionRol(rol)
    cur = conn.cursor()
    data = request.json
    if(data['idoptionmodifieroriginal']==''):
        sql = "INSERT INTO opciones (nombreopcion, precioopcionmodificador,idingrediente,opcionporcion) VALUES ('{0}', '{1}','{2}','{3}') RETURNING idopcionmodificador".format(data['name'],data['price'],data['idingredient'],data['portion'])
        cur.execute(sql, data)
        idopcion= cur.fetchone()
        d = {}
        d['idoption'] = idopcion[0]
        d['idmodifier'] = idmodificador
        sql2 = "INSERT INTO modificadoresopciones (idmodificador, idopcionmodificador) VALUES ('{0}', '{1}')".format(d['idmodifier'],d['idoption'])
        cur.execute(sql2, d)
        conn.commit()
        conn.close()
        cur.close()
    return jsonify(1)

#Inserta un nuevo complemento
@inv_api.route('/api/products/complements/<idproducto>/<rol>', methods=['POST'])
def newComplement(idproducto, rol):
	conn = conexionRol(rol)
	cur = conn.cursor()
	data = request.json
	sql = "INSERT INTO complementos (nombrecomplemento, preciocomplemento, idproducto, descripcioncomplemento,idproductooriginal,tipocomplemento) VALUES ('{0}', '{1}', '{2}', '{3}','{4}','{5}')".format(data['namecomplement'],data['pricecomplement'],idproducto,data['descriptioncomplement'],data['idproduct'],data['typecomplement'])
	cur.execute(sql, data)
	conn.commit()
	conn.close()
	cur.close()
	return jsonify(1)

#Inserta un nuevo ingrediente
@inv_api.route('/api/products/ingredients/<idproducto>/<rol>', methods=['POST'])
def newIngredient(idproducto, rol):
	conn = conexionRol(rol)
	cur = conn.cursor()
	data = request.json
	sql = "INSERT INTO productosingredientes (idproducto, idingrediente, porcion) VALUES ('{0}', '{1}', '{2}')".format(idproducto,data['idingredient'],data['portioningredient'])
	cur.execute(sql, data)
	conn.commit()
	conn.close()
	cur.close()
	return jsonify(1)

@inv_api.route('/api/products/<rol>', methods=['POST'])
def newProduct(rol):
	data = request.json
	conn = conexionRol(rol)
	cur = conn.cursor()
	sql = "INSERT INTO productos (idproducto, nombreproducto, precioproducto, costoproducto, descripcionproducto, idcategoria, idunidad, cantidadproducto,cantidadnotificacionproducto, imagebproducto ) VALUES (%(idproduct)s, %(nameproduct)s, %(priceproduct)s, %(costproduct)s, %(descriptionproduct)s, %(categoryproduct)s, %(unitproduct)s, %(stockinitproduct)s, %(stocknotifiproduct)s , %(imageproduct)s)"
	cur.execute(sql, data)
	conn.commit()
	conn.close()
	cur.close()
	return jsonify(1)

#Obtiene la lista de las categorias ordenanadas por abecedario
@inv_api.route('/api/products/categories/<rol>',  methods=['GET'])
def getCategoriesProducts(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM categorias ORDER BY nombrecategoria ASC ")
    rows = cur.fetchall()
    conn.close()
    return jsonify(rows)

@inv_api.route('/api/products/modifiers/<rol>',  methods=['GET'])
def getModifiers(rol):
    conn = conexionRol(rol)
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT idmodificador as idmodifieroriginal, nombremodificador as namemodifier, preciomodificador as pricemodifier, obligatorio as requiredchecked FROM modificadores ")
    modifiers = cur.fetchall()
    cur2 = conn.cursor(cursor_factory=RealDictCursor)
    cur2.execute("SELECT a.idmodificador as idmodifier, a.idopcionmodificador as idoptionmodifieroriginal, b.nombreopcion as name, b.idingrediente as idingredient, c.nombreingrediente as nameingredient, b.precioopcionmodificador as price, b.opcionporcion as portion FROM modificadoresopciones a LEFT JOIN opciones b ON a.idopcionmodificador=b.idopcionmodificador LEFT JOIN ingredientes c ON b.idingrediente=c.idingrediente")
    options =cur2.fetchall()
    for modifier in modifiers:
       print(modifier)
       modifier['optionsmodifier']=[]
       modifier['idmodifier']=0
       modifier['name']=modifier['namemodifier']
       for option in options:
        if(option['idmodifier']==modifier['idmodifieroriginal']):
            modifier['optionsmodifier'].append(option)
    conn.close()
    return jsonify(modifiers)

@inv_api.route('/api/products/proveedores/<idproducto>/<rol>', methods=['POST'])
def InsertarProductoProveedor(idproducto, rol):
    conn=conexionRol(rol)
    cur=conn.cursor()
    data=request.json
    sql="""INSERT INTO productosproveedores(idproveedor, idproducto, cantidad,costo, fecha)values(1,{0},0, 0, NOW())""".format(idproducto)
    cur.execute(sql, data)
    conn.commit()
    conn.close()
    cur.close()
    return jsonify(msg='added succesfully');