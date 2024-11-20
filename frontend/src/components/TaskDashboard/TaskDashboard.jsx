import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import './TaskDashboard.css';

const TaskDashboard = () => {
    const { token } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);
    const [newTask, setNewTask] = useState('');
    const [description, setDescription] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    useEffect(() => {
        if (token) {
            axios.get('http://127.0.0.1:8000/api/tarefas/', {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(response => setTasks(response.data))
            .catch(error => console.error("Erro ao carregar tarefas:", error));
        }
    }, [token]);

    const handleAddTask = async () => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/api/tarefas/',
                { titulo: newTask, descricao: description, inicio: start, fim: end },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks([...tasks, response.data]);
            setShowCreateModal(false);
            setNewTask('');
            setDescription('');
            setStart('');
            setEnd('');
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
        }
    };

    const handleUpdateTask = async (taskId, completed) => {
        try {
            const response = await axios.patch(
                `http://127.0.0.1:8000/api/tarefas/${taskId}/`,
                { concluida: completed },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setTasks(tasks.map(task => task.id === taskId ? response.data : task));
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/tarefas/${taskId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error("Erro ao excluir tarefa:", error);
        }
    };

    const handleShowDetails = (task) => {
        setCurrentTask(task);
        setShowDetailModal(true);
    };

    return (
        <div className="task-dashboard">
            <div className="header">
                <h2>Tarefas</h2>
                <button onClick={() => setShowCreateModal(true)}>Criar Nova Tarefa</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Início</th>
                        <th>Fim</th>
                        <th>Concluída</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map(task => (
                        <tr key={task.id}>
                            <td>{task.titulo}</td>
                            <td>{task.inicio ? new Date(task.inicio).toLocaleString() : 'N/A'}</td>
                            <td>{task.fim ? new Date(task.fim).toLocaleString() : 'N/A'}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={task.concluida}
                                    onChange={() => handleUpdateTask(task.id, !task.concluida)}
                                />
                            </td>
                            <td className='botoesAcao'>
                                <button onClick={() => handleShowDetails(task)}>Mostrar Mais</button>
                                <button onClick={() => handleDeleteTask(task.id)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showCreateModal && (
                <div className="modal">
                    <h3>Criar Nova Tarefa</h3>
                    <input
                        type="text"
                        placeholder="Título da Tarefa"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                    <textarea
                        placeholder="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    <input
                        type="datetime-local"
                        placeholder="Início"
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        placeholder="Fim"
                        value={end}
                        onChange={(e) => setEnd(e.target.value)}
                    />
                    <button onClick={handleAddTask}>Salvar</button>
                    <button onClick={() => setShowCreateModal(false)}>Cancelar</button>
                </div>
            )}

            {showDetailModal && currentTask && (
                <div className="modal">
                    <h3>Detalhes da Tarefa</h3>
                    <p><strong>Título:</strong> {currentTask.titulo}</p>
                    <p><strong>Descrição:</strong> {currentTask.descricao}</p>
                    <p><strong>Início:</strong> {currentTask.inicio ? new Date(currentTask.inicio).toLocaleString() : 'N/A'}</p>
                    <p><strong>Fim:</strong> {currentTask.fim ? new Date(currentTask.fim).toLocaleString() : 'N/A'}</p>
                    <p><strong>Concluída em:</strong> {currentTask.concluido_em ? new Date(currentTask.concluido_em).toLocaleString() : 'N/A'}</p>
                    <button onClick={() => setShowDetailModal(false)}>Fechar</button>
                </div>
            )}
        </div>
    );
};

export default TaskDashboard;
