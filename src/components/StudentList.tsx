// src/components/StudentList.tsx
import * as React from "react";
import type {Student} from '../types';
import StudentRow from './StudentRow';

interface StudentListProps {
    students: Student[];
    onUpdateStudent: (id: string, patch: Partial<Student>) => Promise<void>;
    onDeleteStudent: (id: string) => Promise<void>;
}

const StudentList = ({ students, onUpdateStudent, onDeleteStudent }: StudentListProps) => {
    return (
        <div style={{ marginTop: 16 }}>
            <h3>Student List</h3>
            {students.length === 0 ? (
                <p>No students</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Name</th>
                        <th style={styles.th}>Age</th>
                        <th style={styles.th}>Group</th>
                        <th style={styles.th}>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {students.map(s => (
                        <StudentRow
                            key={s.id}
                            student={s}
                            onUpdate={onUpdateStudent}
                            onDelete={onDeleteStudent}
                        />
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

const styles: { [k: string]: React.CSSProperties } = {
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'left',
        borderBottom: '1px solid #ccc',
        padding: '6px 8px',
    },
};

export default StudentList;
