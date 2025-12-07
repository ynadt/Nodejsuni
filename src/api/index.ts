// src/api/index.ts

import type {BackupStatus, Student, StudentInput} from "../types.ts";

const API_BASE_URL = 'http://localhost:3000/api';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let message = `Request failed with status ${res.status}`;
        try {
            const data = await res.json();
            if (data && data.error) {
                message = data.error;
            }
        } catch {
            // ignore JSON parse errors
        }
        throw new Error(message);
    }
    return res.json();
}

// -------- STUDENTS --------

export async function fetchStudents(): Promise<Student[]> {
    const res = await fetch(`${API_BASE_URL}/students`);
    return handleResponse<Student[]>(res);
}

export async function addStudent(input: StudentInput): Promise<Student> {
    const res = await fetch(`${API_BASE_URL}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    return handleResponse<Student>(res);
}

export async function updateStudent(
    id: string,
    input: Partial<StudentInput>,
): Promise<Student> {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });
    return handleResponse<Student>(res);
}

export async function deleteStudent(id: string): Promise<{ message: string; id: string }> {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
        method: 'DELETE',
    });
    return handleResponse<{ message: string; id: string }>(res);
}

export async function getStudentById(id: string): Promise<Student> {
    const res = await fetch(`${API_BASE_URL}/students/${id}`);
    return handleResponse<Student>(res);
}

export async function getStudentsByGroup(groupId: string): Promise<Student[]> {
    const res = await fetch(`${API_BASE_URL}/students/group/${groupId}`);
    return handleResponse<Student[]>(res);
}

export async function getAverageAge(): Promise<{ averageAge: number }> {
    const res = await fetch(`${API_BASE_URL}/students/average-age`);
    return handleResponse<{ averageAge: number }>(res);
}

export async function saveStudents(): Promise<{ message: string; filePath: string }> {
    const res = await fetch(`${API_BASE_URL}/students/save`, {
        method: 'POST',
    });
    return handleResponse<{ message: string; filePath: string }>(res);
}

export async function loadStudents(): Promise<{ message: string; count: number }> {
    const res = await fetch(`${API_BASE_URL}/students/load`, {
        method: 'POST',
    });
    return handleResponse<{ message: string; count: number }>(res);
}


// -------- BACKUP --------

export async function startBackup(): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE_URL}/backup/start`, {
        method: 'POST',
    });
    return handleResponse<{ status: string }>(res);
}

export async function stopBackup(): Promise<{ status: string }> {
    const res = await fetch(`${API_BASE_URL}/backup/stop`, {
        method: 'POST',
    });
    return handleResponse<{ status: string }>(res);
}

export async function getBackupStatus(): Promise<BackupStatus> {
    const res = await fetch(`${API_BASE_URL}/backup/status`);
    return handleResponse<BackupStatus>(res);
}

export async function getBackupReport(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/backup/report`);
    return handleResponse<any>(res);
}
