import { useSearchParams } from 'next/navigation';
import { useEffect, Dispatch, SetStateAction } from 'react';

interface ProjectsSearchHandlerProps {
    setViewMode: Dispatch<SetStateAction<'overview' | 'board' | 'timeline'>>;
}

export default function ProjectsSearchHandler({ setViewMode }: ProjectsSearchHandlerProps) {
    const searchParams = useSearchParams();

    useEffect(() => {
        const projectId = searchParams.get('id');
        if (projectId) {
            setViewMode('board');
        }
    }, [searchParams, setViewMode]);

    return null;
}
