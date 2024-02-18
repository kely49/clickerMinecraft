from flask import Flask, render_template, request, session, send_file,jsonify
import threading 
from werkzeug.serving import run_simple
import json

app = Flask(__name__)
app.secret_key = 'your_secret_key'

@app.route('/')
def index():
    # Cargar la configuración desde el archivo JSON
    with open('configuracion.json') as f:
        config = json.load(f)

    roturas_bloques = {
        "tierra": config.get('roturaBloqueTierra'),
        "madera": config.get('roturaBloqueMadera'),
        "grava": config.get('roturaBloqueGrava'),
        "arcilla": config.get('roturaBloqueArcilla'),
        "piedra": config.get('roturaBloquePiedra'),
        "carbon": config.get('roturaBloqueCarbon'),
        "hierro": config.get('roturaBloqueHierro'),
        "redstone": config.get('roturaBloqueRedstone'),
        "oro": config.get('roturaBloqueOro'),
        "lapislazuli": config.get('roturaBloqueLapislazuli'),
        "diamante": config.get('roturaBloqueDiamante'),
        "piedrabase": config.get('roturaBloquePiedrabase')
    }
    cadena_json = json.dumps(roturas_bloques)
    
    return render_template('index.html',roturas_bloques=cadena_json)

@app.route('/login', methods=['POST'])
def login():
    with open('configuracion.json') as login:
        login_config = json.load(login)

    username = request.form.get('username')
    password = request.form.get('password')
    session['username'] = username
    
    for user in login_config.get('usuarios', []):
        if user.get('username') == username and user.get('password') == password:
            # Si las credenciales son válidas, devuelve el contenido de principal.html
            return render_template('principal.html',usuario=session['username'])
        
@app.route('/configuracion')
def get_configuracion():
    return send_file('configuracion.json')

def cargar_configuracion():
    with open('configuracion.json', 'r') as file:
        configuracion = json.load(file)
    return configuracion

@app.route('/guardar-configuracion', methods=['POST'])
def guardar_configuracion():
    try:
        # Obtener la configuración actualizada enviada desde el cliente
        configuracion_actualizada = request.json

        # Guardar la configuración actualizada en el archivo JSON
        with open('configuracion.json', 'w') as file:
            json.dump(configuracion_actualizada, file, indent=4) 

        # Recargar la configuración actualizada en la memoria de la aplicación
        global configuracion
        configuracion = cargar_configuracion()

        # Responder con un mensaje de éxito
        return jsonify({'message': 'Configuración guardada correctamente'}), 200
    except Exception as e:
        # En caso de error, responder con un mensaje de error
        return jsonify({'error': str(e)}), 500

        
if __name__ == '__main__':
    app.run(debug=True)

     # Crear un hilo para ejecutar la aplicación Flask
    flask_thread = threading.Thread(target=run_simple('0.0.0.0', 8096, app, use_reloader=False))

    # Iniciar la ejecución de la aplicación Flask en un hilo
    flask_thread.start()
