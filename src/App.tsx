import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

interface Task {
  id: number;
  title: string;
  description: string;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  const apiUrl = "https://localhost:7056/api/tasks";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(apiUrl);
        setTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (!title || !description) return;

    try {
      if (editingTaskId !== null) {
        await axios.put(`${apiUrl}/${editingTaskId}`, {
          id: editingTaskId,
          title,
          description,
        });
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTaskId ? { ...task, title, description } : task
          )
        );
        setEditingTaskId(null);
      } else {
        const response = await axios.post(apiUrl, {
          title,
          description,
        });
        setTasks((prevTasks) => [...prevTasks, response.data]);
      }

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Erro ao salvar a tarefa:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setTitle(task.title);
    setDescription(task.description);
    setEditingTaskId(task.id);
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Erro ao deletar a tarefa:", error);
    }
  };

  return (
    <div>
      <h1>Gerenciador de Tarefas</h1>
      <div className="box">
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="descricao"
        />
        <button onClick={handleAddTask} className="button">
          {editingTaskId !== null ? "Atualizar Tarefa" : "Adicionar Tarefa"}
        </button>
      </div>
      <div>
        {tasks.length === 0 && (
          <div className="vazio">
            <p>Não há tarefas para exibir.</p>
          </div>
        )}
        {tasks.map((task) => (
          <div key={task.id} className="task">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <button onClick={() => handleEditTask(task)} className="button">
              Editar
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="button delete"
            >
              Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
                          
export default App;
                                                     