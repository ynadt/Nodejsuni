export interface Student {
    id: string;
    name: string;
    age: number;
    group: string | number;
}

export interface StudentInput {
    name: string;
    age: number;
    group: string | number;
}

export interface BackupStatus {
    status: 'running' | 'stopped';
    isBackupRunning: boolean;
    pendingIntervals: number;
    intervalMs: number;
}
