import TaskList from '@/components/tasks/task-list';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: 'teacher/tasks',
    },
];
interface User {
    id: number;
    name: string;
    email: string;
    role: 'STUDENT' | 'TEACHER';
}

interface Task {
    id: number;
    title: string;
    titleEng: string;
    description: string;
    type_of_study: string;
    owner_id: number;
    assignee_id: number | null;
    assignee?: User | null;
    created_at: string;
}

interface TaskListProps {
    tasks: Task[];
}
export default function Tasks({ tasks }: TaskListProps) {
    const { translations } = usePage<SharedData>().props;
    const tasksTranslations = translations.tasks;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <TaskList tasks={tasks} tasksTranslations={tasksTranslations} />
        </AppLayout>
    );
}
