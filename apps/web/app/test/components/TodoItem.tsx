"use client"
import {useState} from "react";

const TodoItem = ({item, actions}) => {
    const {toggleItemComplete, deleteItem, editItem} = actions;
    const [updatedTodoText, setUpdatedTodoText] = useState(item.text);
    const [isEditing, setIsEditing] = useState(false);

    return (
        <>
            <style>{`
                .strikethrough {
                    text-decoration: line-through;
                    color: gray;
                }
            `}</style>
            <li>
                {isEditing?
                    <>
                        {/* <span className={item.isCompleted? "strikethrough" : ""}>editing</span> */}
                        <input type="text" value={updatedTodoText} onChange={(e) => setUpdatedTodoText(e.target.value)}/>
                        <button onClick={() => {editItem(item.id, updatedTodoText); setIsEditing(false)}}>Save</button>
                        <button onClick={() => {setUpdatedTodoText(item.text); setIsEditing(false)}}>Cancel</button>
                    </>
                    :
                    <span className={item.isCompleted? "strikethrough" : ""}>{item.text}</span>
                }
                <button onClick={() => {toggleItemComplete(item.id)}}>Toggle Complete</button>
                <button onClick={() => {deleteItem(item.id)}}>Delete</button>
                <button onClick={() => {setIsEditing(true)}}>Edit</button>
            </li>
        </>
    )
};

export default TodoItem;