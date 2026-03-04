"use client";
import {useState} from "react";
import TodoItem from "./components/TodoItem";

// Requirements

// 1. works with SSR components
// 2. page displays a list of todos
// 3. user can add todo
// 4. user can delete todo
// 5. user cna modify todo
// 6. user cna mark todo complete
// 7. todos persist on page refresh

// TODO JSON SCHEMA

// {
//  id: string,
//  text: string,
//  isCompleted: boolean
// }

// REST APIs
// GET
// DELETE

export type Todo = {
    id: string;
    text: string;
    isComplete: boolean;
};

const MOCK_DATA: Todo[] = [
    {
        id: crypto.randomUUID(),
        text: "take out trash",
        isComplete: false
    },
    {
        id: crypto.randomUUID(),
        text: "do laundry",
        isComplete: true
    }
]

export default function page3(){
    const [todos, setTodos] = useState<Todo[]>(MOCK_DATA);
    const [todoInput, setTodoInput] = useState("");

    const handleAddTodo = () => {
        setTodos(prev => [...prev, {id: crypto.randomUUID(), text: todoInput, isComplete: false}]);
        setTodoInput("");
    }

    const handleDeleteTodo = (todoId: string) => {
        setTodos(prev => prev.filter((item)=> item.id !== todoId))
    }

    const handleToggleComplete = (todoId: string) => {
        setTodos( prev => prev.map((item) => {
            return item.id === todoId ? {...item, isComplete: !item.isComplete } : item
        }))
    }

    const handleUpdateText = (todoId: string, updatedText: string) => {
        setTodos(prev => prev.map(item => item.id === todoId ? {...item, text: updatedText} : item))
    }

    return (
        <>
            <style>{`
                .isComplete {
                    text-decoration: line-through;
                }
            `}</style>
            <h1>My Todo List</h1>
            <label htmlFor="todoInput">Add Todo Item</label>
            <input id="todoInput" type="text" value={todoInput} onChange={(e) => setTodoInput(e.target.value)}></input>
            <button onClick={() => handleAddTodo()}>Add Todo</button>
            <br/><br/>
            <h2>Todos:</h2>
            <ul>
                {todos.map((item)=> {
                    return (
                        <TodoItem key={item.id} item={item} actions={{handleDeleteTodo, handleToggleComplete, handleUpdateText}}/>
                    )
                })}
            </ul>
        </>
    )
}

