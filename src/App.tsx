// src/App.tsx
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import StudentsSection from './components/StudentsSection';
import BackupPanel from './components/BackupPanel';

const App = () => {
    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Student Management Dashboard</h1>

            <div style={styles.layout}>
                <div style={styles.left}>
                    <StudentsSection />
                </div>
                <div style={styles.right}>
                    <BackupPanel />
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

const styles: { [k: string]: React.CSSProperties } = {
    page: {
        maxWidth: 1100,
        margin: '0 auto',
        padding: '24px 16px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    title: {
        marginBottom: 24,
        textAlign: 'center',
    },
    layout: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 16,
        alignItems: 'flex-start',
    },
    left: { minWidth: 0 },
    right: { minWidth: 0 },
};

export default App;
