import { useState, useEffect } from 'react';
import './ListaDeTarefas.css';
import { EditOutlined } from '@ant-design/icons';

function ListaDeTarefas() {
  const [addingTask, setAddingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [editingTask, setEditingTask] = useState<boolean>(false);
  const [taskToBeEdited, setTaskToBeEdited] = useState<any>();
  const [taskDescription, setTaskDescription] = useState<string>('');
  const [taskTitle, setTaskTitle] = useState<string>('');

  // Get trask when the component is mounted

  useEffect(() => {
    handleGetTasks();
  }, []);

  // Handle get tasks from server

  const handleGetTasks = () => {
    fetch('http://localhost:5000/tarefas', {
      method: 'GET'
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        const sortedTasks = data.sort((a: any, b: any) => a.id - b.id); // Sort tasks by ID
        const tableViewData = sortedTasks.map((task:any, index:any) => ({
          number: index + 1, 
          title: task.title,
          description: task.description,
          status: 'A fazer', 
          taskId: task.id
        }));
        setTasksList(tableViewData); 
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

	// Handle finished tasks

	const handleFinishedTask = (taskNumber: number) => {
    setTasksList(
      tasksList.map((task) => {
        if (task.number === taskNumber) {
          return { ...task, status: task.status === 'Feito' ? 'A fazer' : 'Feito' };
        }
        return task;
      })
    );
  };

	// Handle deleting tasks

	const handleDeleteTask = (taskId: number) => {
    fetch(`http://localhost:5000/tarefas/${taskId}`, {
      method: 'DELETE'
    })
      .then((response) => {
        if (response.ok) {

          // Reload tasks list
          handleGetTasks();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };
  
	// Handle adding tasks to server

  const handleAddTask = () => {

    if (!newTaskTitle || !newTaskDescription) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    fetch('http://localhost:5000/tarefas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTaskTitle, description: newTaskDescription }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(() => {
        // Reload tasks list
        handleGetTasks();

          // Close overlay and clear input fields
          setAddingTask(false);
          setNewTaskTitle('');
          setNewTaskDescription('');
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  // Handle editing tasks

  const handleEditTask = (taskTitle: string, taskDescription: string, taskToBeEditedId: any) => {

    fetch(`http://localhost:5000/editar-tarefa/${taskToBeEditedId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: taskTitle, description: taskDescription }),
    })
      .then((response) => {
        if (response.ok) {
          handleGetTasks();
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then(() => {
        handleGetTasks();
        setEditingTask(false);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  };

  return (
    <>
      <div className="ltf-gen-container">
        <div className="ltf-title-container">
          <h1>Lista de Tarefas</h1>
        </div>
        <div className="ltf-btn-container">
          <button
            className="ltf-add-btn"
            onClick={() => {
              setAddingTask(!addingTask);
            }}
          >
            Adicionar tarefa
          </button>
        </div>

        {tasksList.length > 0 && (
          <>
            <div>
              <table className="ltf-tasks-table">
                <tr>
                  <th id='text-header'>Número</th>
                  <th id='text-header'>Título</th>
                  <th id='text-header'>Descrição</th>
                  <th id='text-header'>Editar</th>
                  <th id='text-header'>Status</th>
                  <th>
                    Marcar como concluido
                  </th>
                  <th>
                    Deletar tarefa
                  </th>
                </tr>
                {tasksList.map((task, index) => (
                  <tr key={index}>
                    <td>{task.number}</td>
                    <td id='title'>{task.title}</td>
                    <td id='desc'>{task.description}</td>
                    <td id='edit'><EditOutlined 
                    onClick={() => {
                      setEditingTask(!editingTask);
                      setTaskToBeEdited(task);
                      setTaskDescription(task.description);
                      setTaskTitle(task.title);
                    }}
                    style={{
                      fontSize: '22px',
                      cursor: 'pointer',
                      marginBottom: '-10px'
                    }}
                    /></td>
                    <td>{task.status}</td>
                    <td>
                      <button
                        className="ltf-list-btn del"
                        style={{ width: '100%', backgroundColor: task.status === 'Feito' ? 'green' : (task.status === 'A fazer' ? '#b58e38' : 'auto') }}
												onClick={() => {
													handleFinishedTask(task.number)
												}}
                      >
                        Concluído
                      </button>
                    </td>
                    <td>
                      <button
                        className="ltf-list-btn del"
                        style={{ width: '100%', backgroundColor: 'red' }}
												onClick = {() => {
													handleDeleteTask(task.taskId)
												}}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
          </>
        )}
      </div>
      {addingTask && (
        <>
          <div className="backdrop"></div>
          <div className="ltf-add-task-container">
						<div className="ltf-add-task-title-container">
            	<h1 className="ltf-add-task-title">Nova tarefa</h1>
						</div>
            <div className="ltf-add-divider-line"></div>
            <div className="ltf-add-task-tt-desc-container">
              <div className="ltf-add-task-tt-inp-container">
                <h1
                  className="ltf-add-task-tt"
                  style={{
                    fontSize: '20px',
										textAlign: 'left',
                  }}
                >
                  Título
                </h1>
                <div className="inp-container">
                  <input
                    className="ltf-add-task-inp"
                    placeholder="Nova tarefa..."
                    value={newTaskTitle}
                    onChange={(e) => {
                      setNewTaskTitle(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="ltf-add-task-desc-inp-container">
                <h1
                  className="ltf-add-task-desc"
                  style={{
                    fontSize: '20px',
										textAlign: 'left',
                  }}
                >
                  Descrição
                </h1>
                <div className="inp-container">
                  <input
                    className="ltf-add-task-inp"
                    id="ltf-add-task-desc-inp"
                    placeholder="Descrição da nova tarefa..."
                    type="text"
                    value={newTaskDescription}
                    onChange={(e) => {
                      setNewTaskDescription(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="ltf-btn-cancel-btns-container">
                <div className="ltf-btn-cancel-btn-container">
                  <button
                    className="ltf-ccl-btn"
                    onClick={() => {
                      setAddingTask(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
                <div className="ltf-btn-submit-btn-container">
                  <button
                    className="ltf-add-btn"
                    onClick={() => {
                      handleAddTask();
                    }}
                  >
                    Adicionar tarefa
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {editingTask && (
        <>
          <div className="backdrop"></div>
          <div className="ltf-add-task-container">
						<div className="ltf-add-task-title-container">
            	<h1 className="ltf-add-task-title">Editar Tarefa</h1>
						</div>
            <div className="ltf-add-divider-line"></div>
            <div className="ltf-add-task-tt-desc-container">
              <div className="ltf-add-task-tt-inp-container">
                <h1
                  className="ltf-add-task-tt"
                  style={{
                    fontSize: '20px',
										textAlign: 'left',
                  }}
                >
                  Título
                </h1>
                <div className="inp-container">
                  <input
                    className="ltf-edit-task-inp"
                    placeholder={taskToBeEdited['title']}
                    value={taskTitle}
                    onChange={(e) => {
                      setTaskTitle(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="ltf-add-task-desc-inp-container">
                <h1
                  className="ltf-add-task-desc"
                  style={{
                    fontSize: '20px',
										textAlign: 'left',
                  }}
                >
                  Descrição
                </h1>
                <div className="inp-container">
                  <input
                    className="ltf-add-task-inp"
                    id="ltf-add-task-desc-inp"
                    placeholder="Descrição da nova tarefa..."
                    type="text"
                    value={taskDescription}
                    onChange={(e) => {
                      setTaskDescription(e.target.value);
                    }}
                  ></input>
                </div>
              </div>
              <div className="ltf-btn-cancel-btns-container">
                <div className="ltf-btn-cancel-btn-container">
                  <button
                    className="ltf-ccl-btn"
                    onClick={() => {
                      setEditingTask(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
                <div className="ltf-btn-submit-btn-container">
                  <button
                    className="ltf-add-btn"
                    onClick={() => {
                      handleEditTask(taskTitle, taskDescription, taskToBeEdited.taskId);
                    }}
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ListaDeTarefas;
