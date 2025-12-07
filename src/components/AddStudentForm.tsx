// src/components/AddStudentForm.tsx
import { useState } from 'react';
import { addStudent } from '../api';
import type {Student, StudentInput} from '../types.ts';
import { toast } from 'react-toastify';
import * as React from "react";

interface AddStudentFormProps {
    onStudentAdded: (student: Student) => void;
}

const AddStudentForm = ({ onStudentAdded }: AddStudentFormProps) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState<number | ''>('');
    const [group, setGroup] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || age === '' || !group) {
            toast.error('Please fill all fields');
            return;
        }

        const payload: StudentInput = {
            name,
            age: Number(age),
            group,
        };

        try {
            const created = await addStudent(payload);
            onStudentAdded(created);
            toast.success('Student added');
            setName('');
            setAge('');
            setGroup('');
        } catch (err: any) {
            toast.error(err.message || 'Failed to add student');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={styles.form}>
            <h3>Add New Student</h3>
            <div style={styles.row}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    style={styles.input}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                    style={styles.input}
                />
                <input
                    type="text"
                    placeholder="Group"
                    value={group}
                    onChange={e => setGroup(e.target.value)}
                    style={styles.input}
                />
                <button type="submit" style={styles.buttonPrimary}>
                    Add
                </button>
            </div>
        </form>
    );
};

const styles: { [k: string]: React.CSSProperties } = {
    form: { marginBottom: '16px', padding: '12px', border: '1px solid #ddd', borderRadius: 8 },
    row: { display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' },
    input: {
        padding: '6px 8px',
        border: '1px solid #ccc',
        borderRadius: 4,
        minWidth: 120,
    },
    buttonPrimary: {
        padding: '6px 12px',
        borderRadius: 4,
        border: 'none',
        backgroundColor: '#1976d2',
        color: 'white',
        cursor: 'pointer',
    },
};

export default AddStudentForm;
