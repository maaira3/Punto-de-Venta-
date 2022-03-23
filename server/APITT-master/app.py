from flask import Flask, jsonify
from flask_cors import CORS
from flask_restful import Api
from flask_jwt_extended import JWTManager
from marshmallow import ValidationError

from dotenv import load_dotenv
load_dotenv(".env")

from datetime import datetime
import os
os.environ['TZ']= 'America/Mexico_City'
# from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.schedulers.background import BackgroundScheduler
import requests

from ma import ma
# from oa import oauth
from models.empleado import UsuarioModel
# from resources.facebook_login import FacebookLogin, FacebookAuthorize
# from resources.google_login import GoogleLogin, GoogleCallback
from resources.participante import Participante, ParticipanteList, WelcomeParticipante, Autenticacion, LoginSocialNetwork, RegistroSocialNetwork, ParticipanteDemoList
from resources.upload import ImageUpload, ImageDownload, ImageList, EmojiList
from resources.tarjeta import TarjetaSellos, TarjetaPuntos, TarjetaSellosTemplate, SistemaPuntos, SistemaPuntosId
from resources.notificaciones import NotificacionList, NotificacionesAdminList, NotificacionesAdmin, NotificacionAcciones #Task:Desacoplar list
from resources.premio import Premio, PremioList, PremioId, PremioParticipante #Task:Desacoplar list
from resources.movimiento import MovimientoList, Movimiento
from resources.encuesta import Encuesta, EncuestaParticipante, ControlEncuestas, AdministradorEncuestas, Respuestas
from resources.ayuda import  AyudaList, Ayuda
from resources.producto import CatalogoList, Catalogo
from resources.time import Time
from resources.venta import ProductoList, Producto, PromocionList, Promocion, TicketList, Ticket
from resources.metricas import FiltradoByMetrica
from resources.birthday import Birthday, BirthdaySetter
from resources.config import Config

from globals.constants import APIURL

from flask_uploads import (UploadSet, configure_uploads, IMAGES,
                              UploadNotAllowed)

app = Flask(__name__)
CORS(app)
app.config.from_object("default_config")
#app.config.from_envvar("APPLICATION_SETTINGS")
app.config['UPLOADED_PHOTOS_DEST'] = 'static/img'
app.config['UPLOADED_EMOJIS_DEST'] = '/mnt/a/Escom_Semestre9/Bubbletown/Bubbletown_api_v3_stable/static/img/openmoji-72x72-color'
# app.config['UPLOADED_EMOJIS_DEST'] = 'static/img/openmoji-72x72-color'
photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)
api = Api(app)
jwt = JWTManager(app)

"""
@app.before_first_request
def create_tables():
    db.create_all()
"""


@app.errorhandler(ValidationError)
def handle_marshmallow_validation(err):
    return jsonify(err.messages), 400


# api.add_resource(UserRegister, "/register")
# api.add_resource(User, "/user/<int:user_id>")
# api.add_resource(UserLogin, "/login")
#api.add_resource(FacebookLogin, "/login/facebook")
#api.add_resource(
#    FacebookAuthorize, "/login/facebook/authorized", endpoint="facebook.authorize"
#)
#api.add_resource(GoogleLogin, "/login/google")
#api.add_resource(GoogleCallback, "/login/google/callback")
api.add_resource(Participante, "/participante/<string:id>")
api.add_resource(WelcomeParticipante, "/wparticipante/<string:id>")
api.add_resource(ParticipanteList, "/participante")
api.add_resource(ParticipanteDemoList, "/participantes")
api.add_resource(TarjetaSellos, "/tarjetasellos/<string:id>")
api.add_resource(TarjetaSellosTemplate, "/tarjetasellos")
api.add_resource(TarjetaPuntos, "/tarjetapuntos/<string:id_participante>")
api.add_resource(SistemaPuntos, "/niveles")
api.add_resource(SistemaPuntosId, "/niveles/<string:id>")
api.add_resource(NotificacionList, "/notificaciones/<string:id>")
api.add_resource(NotificacionesAdminList, "/notificaciones")
api.add_resource(NotificacionesAdmin, "/admin/notificaciones/<string:id>")
api.add_resource(NotificacionAcciones, "/admin/notificaciones/<string:id>/acciones/<string:accion>")
api.add_resource(Catalogo, "/catalogo/<string:vartipo>")
api.add_resource(CatalogoList, "/catalogo")
api.add_resource(Config, "/config")
api.add_resource(PremioId, "/premio/<string:id>")
api.add_resource(Premio, "/premios")
api.add_resource(PremioList, "/premios/<string:id>")
api.add_resource(PremioParticipante, "/admin/premio/<string:id>")
api.add_resource(MovimientoList, "/movimientos/<string:id_participante>")
api.add_resource(Movimiento, "/movimiento/<string:id_movimiento>")
api.add_resource(Encuesta, "/encuesta")
api.add_resource(EncuestaParticipante, "/encuesta/<string:id_encuesta>")
api.add_resource(ControlEncuestas, "/controlencuestas/<string:id_participanteencuesta>")
api.add_resource(AdministradorEncuestas, "/controlencuestas")
api.add_resource(Respuestas, "/participantes/<string:id_participante>/encuestas/<string:id_encuesta>")
api.add_resource(AyudaList, "/ayuda")
api.add_resource(Ayuda, "/ayuda/<string:id>")
api.add_resource(ImageUpload, "/upload")
api.add_resource(ImageDownload, "/download/<string:filename>")
api.add_resource(ImageList, "/images")
api.add_resource(EmojiList, "/emojis")
api.add_resource(Autenticacion, "/autenticacion")
api.add_resource(LoginSocialNetwork, "/autenticacion/<string:socialNetwork>")
api.add_resource(RegistroSocialNetwork, "/registro/<string:socialNetwork>")
api.add_resource(Time, "/time")
api.add_resource(ProductoList, "/productos")
api.add_resource(Producto, "/productos/<string:id>")
api.add_resource(PromocionList, "/promociones")
api.add_resource(Promocion, "/promociones/<string:id>")
api.add_resource(TicketList, "/tickets")
api.add_resource(Ticket, "/tickets/<string:id>")
api.add_resource(FiltradoByMetrica, "/filtrado")
api.add_resource(Birthday, "/birthday")
api.add_resource(BirthdaySetter, "/birthday/<string:id>")

# api.add_resource(SetPassword, "/user/password")

# Proceso autónomo 'giveBirthdayGifts': Ejecuta automáticamente cada  
# 24 hrs la función que otorga los premios y notificaciones por cumpleaños.
def giveBirthdayGifts():
    r = requests.post(APIURL+"/birthday/loquesea")
    # Verificar que esta correcta la URL
    print(r.url)
    # Contenido de la respuesta
    print(r.text)
    # Contenidos de respuesta binarios
    print(r.content)
    # Contenido de respuesta JSON
    print(r.json())
        # print('Tick! The time is: %s' % datetime.now())
    # Ejecutar metodo post de SetBirthday
    # Ejecutar la eliminacion de premios caducados


if __name__ == "__main__":
    ma.init_app(app)
    # oauth.init_app(app)
    #app.run(ssl_context="adhoc")
    ## SecondPlane task process
    scheduler = BackgroundScheduler()
    # scheduler.add_executor('processpool')
    scheduler.add_job(giveBirthdayGifts, 'interval', hours=24)
    scheduler.start()
    # 
    app.run(port=5001)



# TODO: 

# Refactorizar
# Clases de servicios y modelos
    # Codigos
    # Movimientos
    # Encuesta (Cerrada y abierta)
    # Logout