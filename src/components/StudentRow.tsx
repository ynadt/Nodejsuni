// src/components/StudentRow.tsx
import * as React from "react";
import { useState } from 'react';
import type {Student} from '../types';

interface StudentRowProps {
    student: Student;
    onUpdate: (id: string, patch: Partial<Student>) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
}

const StudentRow = ({ student, onUpdate, onDelete }: StudentRowProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(student.name);
    const [editAge, setEditAge] = useState<number | ''>(student.age);
    const [editGroup, setEditGroup] = useState<string | number>(student.group);

    const handleSave = async () => {
        await onUpdate(student.id, {
            name: editName,
            age: typeof editAge === 'string' ? Number(editAge) : editAge,
            group: editGroup,
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditName(student.name);
        setEditAge(student.age);
        setEditGroup(student.group);
    };

    return (
        <tr>
            <td>{student.id}</td>
            <td>
                {isEditing ? (
                    <input
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        style={styles.input}
                    />
                ) : (
                    student.name
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        type="number"
                        value={editAge}
                        onChange={e => setEditAge(e.target.value === '' ? '' : Number(e.target.value))}
                        style={styles.input}
                    />
                ) : (
                    student.age
                )}
            </td>
            <td>
                {isEditing ? (
                    <input
                        value={editGroup}
                        onChange={e => setEditGroup(e.target.value)}
                        style={styles.input}
                    />
                ) : (
                    student.group
                )}
            </td>
            <td style={styles.actions}>
                {isEditing ? (
                    <>
                        <button style={styles.btnPrimary} onClick={handleSave}>
                            Save
                        </button>
                        <button style={styles.btnGhost} onClick={handleCancel}>
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button style={styles.btnPrimary} onClick={() => setIsEditing(true)}>
                            Edit
                        </button>
                        <button style={styles.btnDanger} onClick={() => onDelete(student.id)}>
                            Delete
                        </button>
                    </>
                )}
            </td>
        </tr>
    );
};

const styles: { [k: string]: React.CSSProperties } = {
    input: {
        padding: '4px 6px',
        borderRadius: 4,
        border: '1px solid #ccc',
        minWidth: 80,
    },
    actions: {
        display: 'flex',
        gap: '6px',
        justifyContent: 'flex-end',
    },
    btnPrimary: {
        padding: '4px 8px',
        borderRadius: 4,
        border: 'none',
        backgroundColor: '#1976d2',
        color: '#fff',
        cursor: 'pointer',
    },
    btnDanger: {
        padding: '4px 8px',
        borderRadius: 4,
        border: 'none',
        backgroundColor: '#d32f2f',
        color: '#fff',
        cursor: 'pointer',
    },
    btnGhost: {
        padding: '4px 8px',
        borderRadius: 4,
        border: '1px solid #aaa',
        backgroundColor: 'transparent',
        cursor: 'pointer',
    },
};

export default StudentRow;
