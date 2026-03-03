"use client";
import {useState, useEffect} from 'react';

const STORAGE_KEY = 'todos';

export default function testtest() {
    // Load todos from localStorage on initial render
    const [todos, setTodos] = useState<{id: string; text: string}[]>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch {
                    return [];
                }
            }
        }
        return [];
    });
    
    const [inputText, setInputText] = useState("");

    // Save todos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = () => {
        if (inputText.trim()) {
            setTodos([...todos, {id: crypto.randomUUID(), text: inputText.trim()}]);
            setInputText("");
        }
    }

    
    return <div>

        <label htmlFor="todoInput">Add Todo:</ label> 
        <input value={inputText} type="test" name="todoInput"onChange={(e) => setInputText(e.target.value)} placeholder="enter todo"></input>
        <button onClick={handleAddTodo}>Add Todo</button>


        <ul>
            {todos.length > 0 && todos.map((item)=> {
                    return <li key={item.id}>{item.text}</li>
                })}
        </ul>
    </div>
}