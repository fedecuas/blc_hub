"use client";

import React from 'react';
import { useDataContext } from '@/context/DataContext';

export default function DataRecoveryGuard({ children }: { children: React.ReactNode }) {
    const { loadStatus, refreshAllData } = useDataContext();

    if (loadStatus === 'error') {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
                <div className="max-w-md w-full p-8 bg-[#1a1c20] border border-red-500/30 rounded-2xl shadow-2xl text-center">
                    <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Conexión Inestable</h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Parece que la conexión con la base de datos es lenta o se ha interrumpido.
                        No te preocupes, tus datos están seguros.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => refreshAllData()}
                            className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reintentar Conexión
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-all"
                        >
                            Refrescar Aplicación
                        </button>
                    </div>

                    <p className="mt-6 text-xs text-gray-500 italic">
                        Si el problema persiste, intenta usar una ventana de incógnito o limpia la memoria en el login.
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
