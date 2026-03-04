"use client"

import { useState, useEffect } from "react"; 
import TodoItem from "./components/TodoItem";

// questions:
// do we plan on having (SSR) Server Side Rendered components?
// with next js, we need component to match server render, then hydrate with a useEffect after mount

// functional reqs: 
// 1. user can add todo item
// 2. user can modify todo item
// 3. user can delete todo item
// 4. todo item is persistent on page refresh
// 5. differntiates completed todo items
// 6. displays todo items

// TODO: 
// 1. make input fields responsive to "enter" key press


// TODO item json schema
// {
//    id: string;
//    text: string;
//    isCompleted: boolean;
// }


// mock data
const MOCK_DATA = [
    {
        id: crypto.randomUUID(),
        text: "take out the trash",
        isCompleted: false
    },
    {
        id: crypto.randomUUID(),
        text: "do the dishes",
        isCompleted: false
    },
    {
        id: crypto.randomUUID(),
        text: "walk the dog",
        isCompleted: false
    }
]

export default function TestPage() {

    console.log("test")

    const [todos, setTodos] = useState(() => {
        if (typeof window !== 'undefined'){
            const persistedTodos = localStorage.getItem("my_todo_list");
            return persistedTodos? JSON.parse(persistedTodos) : MOCK_DATA;
        }
        // return []
    })
    // const [ todos, setTodos ] = useState([]);
    //
    // const [ todos, setTodos ] = useState(()=> {
    //     const savedTodos = localStorage.getItem("my_todo_list");
    //     return savedTodos ? JSON.parse(savedTodos) : MOCK_DATA;
    // });
    const [ todoInput, setTodoInput ] = useState("");

    const handleAddTodo = () => {
        setTodos([...todos, {id: crypto.randomUUID(), text: todoInput, isCompleted:false}])
        setTodoInput("")
    }

    const toggleItemComplete = (itemId) => {
        setTodos( prev => prev.map((item) => {
            return item.id === itemId ? {...item, isCompleted: !item.isCompleted } : item
        }
            // if (item.id === itemId) {
            //     //do something
            //     item.isCompleted = !item.isCompleted
            //     return item
            // }
            // return item
        ))
    }

    const deleteItem = (itemId) => {
        setTodos( todos.filter((item) => {
            if (item.id !== itemId) {
                return item  
            } 
        }))
    }

    const editItem = (itemId, updatedTodoText) => {
        setTodos( prev => prev.map((item) => {
            if (item.id === itemId) {
                item.text = updatedTodoText
                return item  
            } 
            return item
        }))
    }

    // useEffect(() => {
    //     const persistedTodos = localStorage.getItem("my_todo_list");
    //     if (persistedTodos) {
    //         setTodos(JSON.parse(persistedTodos))
    //     }
    // }, []);

    useEffect(() => {
        localStorage.setItem("my_todo_list", JSON.stringify(todos));
        return 
    }, [todos]);

    return (
        <>
            <div>
                <label htmlFor="todoInput">Add todo item:</label>
                <input type="text" id="todoInput" value={todoInput} onChange={(e) => {setTodoInput(e.target.value)}}placeholder="e.g. do the laundry"></input> 
                <button onClick={handleAddTodo}>Add Todo Item</button>
                <ul>    
                    {todos.map((item)=> (
                        <TodoItem
                            key={item.id}
                            item={item}
                            // toggleItemComplete={toggleItemComplete}
                            // deleteItem={deleteItem}
                            // editItem={editItem}
                            actions={{toggleItemComplete, deleteItem, editItem}}
                        />
                    ))} 
                </ul>
            </div>
        </>    
    )
}