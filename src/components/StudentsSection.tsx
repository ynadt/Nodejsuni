import { useEffect, useState } from 'react';
import {
    fetchStudents,
    updateStudent,
    deleteStudent,
    getAverageAge,
    getStudentsByGroup,
    saveStudents,
    loadStudents,
    getStudentById,
} from '../api';

import type { Student } from '../types';
import AddStudentForm from './AddStudentForm';
import StudentList from './StudentList';
import { toast } from 'react-toastify';

const StudentsSection = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(false);

    const [averageAge, setAverageAgeState] = useState<number | null>(null);

    const [groupQuery, setGroupQuery] = useState('');
    const [groupResult, setGroupResult] = useState<Student[] | null>(null);
    const [displayedGroup, setDisplayedGroup] = useState('');
    const [isGroupLoading, setIsGroupLoading] = useState(false);

    const [idQuery, setIdQuery] = useState('');
    const [idResult, setIdResult] = useState<Student | null>(null);
    const [isIdLoading, setIsIdLoading] = useState(false);

    // Load all students

    const loadAllStudents = async () => {
        setLoading(true);
        try {
            const data = await fetchStudents();
            setStudents([...data]);
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllStudents();
    }, []);


    // CRUD

    const handleStudentAdded = (s: Student) => {
        setStudents(prev => [...prev, { ...s }]);
    };

    const handleUpdateStudent = async (id: string, patch: Partial<Student>) => {
        try {
            const updated = await updateStudent(id, patch);
            setStudents(prev =>
                prev.map(s => (s.id === id ? { ...updated } : s))
            );
            toast.success('Student updated');
        } catch (err: any) {
            toast.error(err.message || 'Failed to update student');
        }
    };

    const handleDeleteStudent = async (id: string) => {
        try {
            await deleteStudent(id);
            setStudents(prev => prev.filter(s => s.id !== id));
            toast.success('Student deleted');
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete student');
        }
    };


    // Queries

    const handleAverageAge = async () => {
        try {
            const res = await getAverageAge();
            setAverageAgeState(res.averageAge);
        } catch (err: any) {
            toast.error(err.message || 'Failed to get average age');
        }
    };

    const handleGetByGroup = async () => {
        if (!groupQuery.trim()) {
            setGroupResult(null);
            setDisplayedGroup('');
            toast.warn('Please enter group ID');
            return;
        }

        setIsGroupLoading(true);
        setDisplayedGroup(groupQuery); // Сохраняем запрос для заголовка

        try {
            const res = await getStudentsByGroup(groupQuery);
            setGroupResult([...res]);
            if (res.length === 0) {
                toast.info(`No students found in group "${groupQuery}"`);
            } else {
                toast.success(`Found ${res.length} students in group "${groupQuery}"`);
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to get group students');
            setGroupResult(null);
        } finally {
            setIsGroupLoading(false);
        }
    };

    const handleFindById = async () => {
        if (!idQuery.trim()) {
            setIdResult(null);
            toast.warn('Please enter student ID');
            return;
        }

        setIsIdLoading(true);

        try {
            const res = await getStudentById(idQuery);
            setIdResult({ ...res });
            toast.success('Student found');
        } catch (err: any) {
            setIdResult(null);
            toast.error(err.message || 'Student not found');
        } finally {
            setIsIdLoading(false);
        }
    };


    // Save / Load

    const handleSave = async () => {
        try {
            const res = await saveStudents();
            toast.success(`Saved to ${res.filePath}`);
        } catch (err: any) {
            toast.error(err.message || 'Failed to save');
        }
    };

    const handleLoad = async () => {
        try {
            const res = await loadStudents();
            toast.success(`Loaded ${res.count} students`);
            await loadAllStudents();
        } catch (err: any) {
            toast.error(err.message || 'Failed to load');
        }
    };


    const handleGroupKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleGetByGroup();
        }
    };

    const handleIdKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleFindById();
        }
    };

    return (
        <section style={styles.section}>
            <h2>Students</h2>

            <AddStudentForm onStudentAdded={handleStudentAdded} />

            <div style={styles.controlsRow}>
                <button onClick={loadAllStudents} style={styles.button}>
                    Refresh
                </button>
                <button onClick={handleSave} style={styles.button}>
                    Save to File
                </button>
                <button onClick={handleLoad} style={styles.button}>
                    Load from File
                </button>
            </div>

            <div style={styles.controlsRow}>
                <button onClick={handleAverageAge} style={styles.button}>
                    Get Average Age
                </button>
                {averageAge !== null && <span>Average age: {averageAge.toFixed(1)}</span>}
            </div>

            {/* Group search */}
            <div style={styles.controlsRow}>
                <input
                    style={styles.input}
                    placeholder="Group ID"
                    value={groupQuery}
                    onChange={e => setGroupQuery(e.target.value)}
                    onKeyPress={handleGroupKeyPress}
                    disabled={isGroupLoading}
                />
                <button
                    style={styles.button}
                    onClick={handleGetByGroup}
                    disabled={isGroupLoading}
                >
                    {isGroupLoading ? 'Loading...' : 'Get by Group'}
                </button>
            </div>

            {groupResult && (
                <div style={styles.box}>
                    <h4>Students in group "{displayedGroup}"</h4>
                    {groupResult.length === 0 ? (
                        <p>No students in this group</p>
                    ) : (
                        <ul style={styles.list}>
                            {groupResult.map(s => (
                                <li key={s.id} style={styles.listItem}>
                                    <strong>{s.name}</strong> (age: {s.age}) — group <code>{s.group}</code>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* ID search */}
            <div style={styles.controlsRow}>
                <input
                    style={styles.input}
                    placeholder="Student ID"
                    value={idQuery}
                    onChange={e => setIdQuery(e.target.value)}
                    onKeyPress={handleIdKeyPress}
                    disabled={isIdLoading}
                />
                <button
                    style={styles.button}
                    onClick={handleFindById}
                    disabled={isIdLoading}
                >
                    {isIdLoading ? 'Loading...' : 'Find by ID'}
                </button>
            </div>

            {idResult && (
                <div style={styles.box}>
                    <h4>Student by ID</h4>
                    <div style={styles.studentCard}>
                        <p><strong>ID:</strong> {idResult.id}</p>
                        <p><strong>Name:</strong> {idResult.name}</p>
                        <p><strong>Age:</strong> {idResult.age}</p>
                        <p><strong>Group:</strong> {idResult.group}</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div style={styles.loading}>Loading students...</div>
            ) : (
                <StudentList
                    students={students}
                    onUpdateStudent={handleUpdateStudent}
                    onDeleteStudent={handleDeleteStudent}
                />
            )}
        </section>
    );
};

const styles = {
    section: {
        padding: '16px',
        borderRadius: 8,
        border: '1px solid #ddd',
        backgroundColor: '#fafafa',
        marginBottom: 24,
    },
    controlsRow: {
        display: 'flex',
        gap: '8px',
        marginTop: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    input: {
        padding: '6px 8px',
        border: '1px solid #ccc',
        borderRadius: 4,
        minWidth: '150px',
        flex: 1,
    },
    button: {
        padding: '6px 12px',
        borderRadius: 4,
        background: '#1976d2',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        minHeight: '32px',
        minWidth: '120px',
    },
    buttonDanger: {
        padding: '6px 12px',
        borderRadius: 4,
        background: '#c62828',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        minHeight: '32px',
    },
    box: {
        marginTop: 12,
        padding: 12,
        border: '1px solid #ccc',
        borderRadius: 6,
        background: '#fff',
    },
    list: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
    },
    listItem: {
        padding: '8px 0',
        borderBottom: '1px solid #eee',
        '&:last-child': {
            borderBottom: 'none',
        },
    },
    studentCard: {
        padding: '12px',
        backgroundColor: '#f8f9fa',
        borderRadius: '4px',
    },
    loading: {
        padding: '20px',
        textAlign: 'center',
        color: '#666',
    },
} as const;

export default StudentsSection;