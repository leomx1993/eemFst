from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from urllib.parse import quote_plus
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)  

password_from_env = os.getenv('DB_PASSWORD')
password_encoded = quote_plus(password_from_env)
app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://postgres:{password_encoded}@localhost:5432/flask_db'
db = SQLAlchemy(app)

class Tarefas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    description = db.Column(db.String(2000))

with app.app_context():
    db.create_all()
    
#  GET tasks
@app.route('/tarefas', methods=['GET'])
def get_tasks():
    tarefas = Tarefas.query.all()
    tarefas_json = [{'id': tarefa.id, 'title': tarefa.title, 'description': tarefa.description} for tarefa in tarefas]
    return jsonify(tarefas_json)

# POST tasks
@app.route('/tarefas', methods=['POST'])
def new_task():
    data = request.json
    new_task = Tarefas(title=data['title'], description=data['description'])
    db.session.add(new_task)
    db.session.commit()
    return jsonify({'message': 'New task added'})

# DELETE tasks
@app.route('/tarefas/<int:tarefa_id>', methods=['DELETE'])
def delete_task_by_id(tarefa_id):
    tarefa = Tarefas.query.get_or_404(tarefa_id)
    db.session.delete(tarefa)
    db.session.commit()
    return jsonify({'message': 'Task deleted'})

# EDIT tasks
@app.route('/editar-tarefa/<int:tarefa_id>', methods=['PUT'])
def edit_task_by_id(tarefa_id):
    tarefa = Tarefas.query.get_or_404(tarefa_id)
    data = request.json
    
    tarefa.title = data.get('title', tarefa.title)
    tarefa.description = data.get('description', tarefa.description)
    
    db.session.commit()
    
    return jsonify({'message': 'Task edited successfully'})

if __name__ == '__main__':
    app.run()
