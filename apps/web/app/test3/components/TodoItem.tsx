"use client";

import {useState} from 'react';
import type { Todo } from "../page";

interface TodoItemProps {
    item: Todo;
    actions: {
        handleDeleteTodo: (todoId: string) => void;
        handleToggleComplete: (todoId: string) => void;
        handleUpdateText: (todoId: string, updatedText: string) => void;
    };
}

export default function TodoItem ({item, actions}: TodoItemProps) {
    const {handleDeleteTodo, handleToggleComplete, handleUpdateText} = actions;
    const [editedTodoText, setEditedTodoText] = useState(item.text);
    const [isEditing, setIsEditing] = useState(false);


    const handleEditTodoText = () => {
        // id, new text
        handleUpdateText(item.id, editedTodoText);
        setIsEditing(false);
    }

    return (
        <li>
            {isEditing?
                <>
                    <input value={editedTodoText} onChange={(e) => setEditedTodoText(e.target.value)}></input>
                    <button onClick={() => {handleEditTodoText()}}>Save</button>
                    <button onClick={() => {setIsEditing(false)}}>Cancel</button>
                </>
            :
                <span className={item.isComplete? "isComplete": ""}>{item.text}</span>
            }
            <button onClick={()=> handleDeleteTodo(item.id)}>Delete</button>
            <button onClick={()=> handleToggleComplete(item.id)}>Toggle Complete</button>
            <button onClick={() => setIsEditing(true)}>Edit</button>
        </li>
    )
};