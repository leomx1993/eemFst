import { useState } from 'react';
import './ListaDeTarefas.css';

function ListaDeTarefas() {
  const [addingTask, setAddingTask] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [tasksList, setTasksList] = useState<any[]>([]);

	// Handle finished tasks

	const handleFinishedTask = (taskNumber: number) => {

		setTasksList(
			tasksList.map((task) => {
				if (task.number === taskNumber) {

					if (task.status === 'Feito') {
						task.status = 'A fazer';
						return task;
					}

					task.status = 'Feito';
				}
				return task;
			})
		);
	}

	// Handle deleting tasks

	const handleDeleteTask = (taskNumber: number) => {
		const updatedTasks = tasksList
			.filter((task) => task.number !== taskNumber)
			.map((task, index) => ({ ...task, number: index + 1 }));
		setTasksList(updatedTasks);
	};

	// Handle adding tasks using the add task overlay

  const handleAddTask = () => {
    if (!newTaskTitle || !newTaskDescription) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setTasksList([
      ...tasksList,
      {
        number: tasksList.length + 1,
        title: newTaskTitle,
        description: newTaskDescription,
        status: 'A fazer',
        deleted: false,
      },
    ]);
    setAddingTask(false);
    setNewTaskTitle('');
    setNewTaskDescription('');
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
                    <td>{task.title}</td>
                    <td id='desc'>{task.description}</td>
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
													handleDeleteTask(task.number)
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
    </>
  );
}

export default ListaDeTarefas;
