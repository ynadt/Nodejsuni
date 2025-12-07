// src/components/BackupPanel.tsx
import { useEffect, useState } from 'react';
import {
    startBackup,
    stopBackup,
    getBackupStatus,
    getBackupReport,
} from '../api';
import type {BackupStatus} from '../types';
import { toast } from 'react-toastify';

const BackupPanel = () => {
    const [status, setStatus] = useState<BackupStatus | null>(null);
    const [report, setReport] = useState<any | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(false);

    const loadStatus = async () => {
        setLoadingStatus(true);
        try {
            const s = await getBackupStatus();
            setStatus(s);
        } catch (err: any) {
            toast.error(err.message || 'Failed to get backup status');
        } finally {
            setLoadingStatus(false);
        }
    };

    useEffect(() => {
        loadStatus();
    }, []);

    const handleStart = async () => {
        try {
            await startBackup();
            toast.success('Backup started');
            await loadStatus();
        } catch (err: any) {
            toast.error(err.message || 'Failed to start backup');
        }
    };

    const handleStop = async () => {
        try {
            await stopBackup();
            toast.success('Backup stopped');
            await loadStatus();
        } catch (err: any) {
            toast.error(err.message || 'Failed to stop backup');
        }
    };

    const handleReport = async () => {
        try {
            const r = await getBackupReport();
            setReport(r);
            toast.info('Backup report loaded');
        } catch (err: any) {
            toast.error(err.message || 'Failed to get backup report');
        }
    };

    return (
        <section style={styles.section}>
            <h2>Backup</h2>
            <div style={styles.row}>
                <button style={styles.button} onClick={handleStart}>
                    Start backup
                </button>
                <button style={styles.button} onClick={handleStop}>
                    Stop backup
                </button>
                <button style={styles.button} onClick={loadStatus} disabled={loadingStatus}>
                    {loadingStatus ? 'Updating status...' : 'Refresh status'}
                </button>
                <button style={styles.button} onClick={handleReport}>
                    Show report
                </button>
            </div>

            {status && (
                <div style={styles.statusBox}>
                    <p>
                        Status: <strong>{status.status}</strong>
                    </p>
                    <p>isBackupRunning: {String(status.isBackupRunning)}</p>
                    <p>pendingIntervals: {status.pendingIntervals}</p>
                    <p>intervalMs: {status.intervalMs}</p>
                </div>
            )}

            {report && (
                <div style={styles.reportBox}>
                    <h4>Backup report JSON</h4>
                    <pre style={styles.pre}>{JSON.stringify(report, null, 2)}</pre>
                </div>
            )}
        </section>
    );
};

const styles: { [k: string]: React.CSSProperties } = {
    section: {
        padding: '16px',
        borderRadius: 8,
        border: '1px solid #ddd',
        backgroundColor: '#fafafa',
    },
    row: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: 12,
    },
    button: {
        padding: '6px 10px',
        borderRadius: 4,
        border: 'none',
        backgroundColor: '#455a64',
        color: '#fff',
        cursor: 'pointer',
    },
    statusBox: {
        padding: 8,
        borderRadius: 6,
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    reportBox: {
        padding: 8,
        borderRadius: 6,
        border: '1px solid #ccc',
        backgroundColor: '#fff',
    },
    pre: {
        margin: 0,
        maxHeight: 200,
        overflow: 'auto',
        fontSize: 12,
        backgroundColor: '#f5f5f5',
        padding: 8,
    },
};

export default BackupPanel;
