"use client";

import React, { Suspense } from 'react';
import TasksPageContent from './TasksPageContent';

export default function TasksPage() {
    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading tasks...</div>}>
            <TasksPageContent />
        </Suspense>
    );
}
