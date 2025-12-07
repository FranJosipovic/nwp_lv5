import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { BookOpen, FileText, GraduationCap, Plus } from 'lucide-react';

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

interface TaskTranslation {
    [key: string]: string;
}

interface TaskListProps {
    tasks: Task[];
    tasksTranslations: TaskTranslation;
}

export default function TaskList({ tasks, tasksTranslations }: TaskListProps) {
    const getStudyTypeIcon = (type: string) => {
        switch (type) {
            case 'PROFESSIONAL':
                return <BookOpen className="h-4 w-4" />;
            case 'GRADUATE':
                return <GraduationCap className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getStudyTypeBadgeVariant = (type: string) => {
        switch (type) {
            case 'PROFESSIONAL':
                return 'default';
            case 'GRADUATE':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {tasksTranslations['title']}
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            {tasksTranslations['description']}
                        </p>
                    </div>
                    <Link href="/teacher/tasks/create">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" />
                            {tasksTranslations['create_new_button']}
                        </Button>
                    </Link>
                </div>

                {/* Tasks Grid */}
                {tasks.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold text-foreground">
                                {tasksTranslations['empty_state']}
                            </h3>
                            <p className="mb-4 text-center text-muted-foreground">
                                {tasksTranslations['empty_state_desc']}
                            </p>
                            <Link href="/teacher/tasks/create">
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    {tasksTranslations['empty_state_button']}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {tasks.map((task) => (
                            <Card
                                key={task.id}
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 text-lg">
                                            {task.title}
                                        </CardTitle>
                                        <Badge
                                            variant={getStudyTypeBadgeVariant(
                                                task.type_of_study,
                                            )}
                                        >
                                            <span className="flex items-center gap-1">
                                                {getStudyTypeIcon(
                                                    task.type_of_study,
                                                )}
                                                {task.type_of_study}
                                            </span>
                                        </Badge>
                                    </div>
                                    {task.titleEng &&
                                        task.titleEng !== task.title && (
                                            <CardDescription className="line-clamp-1 text-sm italic">
                                                {task.titleEng}
                                            </CardDescription>
                                        )}
                                </CardHeader>
                                <CardContent>
                                    <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                                        {task.description ||
                                            'No description provided'}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>
                                            Assignee:{' '}
                                            <span className="font-medium text-foreground">
                                                {task.assignee?.name ||
                                                    'Unassigned'}
                                            </span>
                                        </span>
                                        <span>
                                            {new Date(
                                                task.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Task Count */}
                {tasks.length > 0 && (
                    <p className="mt-6 text-center text-sm text-muted-foreground">
                        Showing {tasks.length} task
                        {tasks.length !== 1 ? 's' : ''}
                    </p>
                )}
            </div>
        </div>
    );
}
