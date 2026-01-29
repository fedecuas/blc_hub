import { useSearchParams } from 'next/navigation';

export default function TasksSearchHandler() {
    const searchParams = useSearchParams();
    return searchParams.get('projectId');
}
