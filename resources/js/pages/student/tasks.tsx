'use client';

import type React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle,
    Clock,
    FileText,
    GraduationCap,
    Send,
} from 'lucide-react';

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
    owner?: User;
    created_at: string;
}

interface BrowseTasksProps {
    tasks: Task[];
    appliedTasks: Task[];
    acceptedTasks: Task[];
}

function ApplyButton({ taskId }: { taskId: number }) {
    const { post, processing } = useForm({});

    const handleApply = () => {
        post(`/student/tasks/${taskId}/apply`);
    };

    return (
        <Button
            onClick={handleApply}
            disabled={processing}
            className="w-full gap-2"
        >
            <Send className="h-4 w-4" />
            {processing ? 'Applying...' : 'Apply'}
        </Button>
    );
}

function TaskCard({
    task,
    variant = 'available',
}: {
    task: Task;
    variant?: 'available' | 'applied' | 'accepted';
}) {
    const getStudyTypeIcon = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'research':
                return <BookOpen className="h-4 w-4" />;
            case 'thesis':
                return <GraduationCap className="h-4 w-4" />;
            default:
                return <FileText className="h-4 w-4" />;
        }
    };

    const getStudyTypeBadgeVariant = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'research':
                return 'default' as const;
            case 'thesis':
                return 'secondary' as const;
            default:
                return 'outline' as const;
        }
    };

    return (
        <Card className="flex flex-col transition-shadow hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-lg">
                        {task.title}
                    </CardTitle>
                    <Badge
                        variant={getStudyTypeBadgeVariant(task.type_of_study)}
                    >
                        <span className="flex items-center gap-1">
                            {getStudyTypeIcon(task.type_of_study)}
                            {task.type_of_study}
                        </span>
                    </Badge>
                </div>
                {task.titleEng && task.titleEng !== task.title && (
                    <CardDescription className="line-clamp-1 text-sm italic">
                        {task.titleEng}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="flex-1">
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                    {task.description || 'No description provided'}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        Owner:{' '}
                        <span className="font-medium text-foreground">
                            {task.owner?.name || 'Unknown'}
                        </span>
                    </span>
                    <span>
                        {new Date(task.created_at).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
            <CardFooter className="pt-0">
                {variant === 'available' && <ApplyButton taskId={task.id} />}
                {variant === 'applied' && (
                    <div className="flex w-full items-center justify-center gap-2 rounded-md bg-muted py-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Pending Review
                    </div>
                )}
                {variant === 'accepted' && (
                    <div className="flex w-full items-center justify-center gap-2 rounded-md bg-green-100 py-2 text-sm text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        Accepted
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}

function EmptyState({
    title,
    description,
    icon: Icon,
}: {
    title: string;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10">
                <Icon className="mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-base font-semibold text-foreground">
                    {title}
                </h3>
                <p className="text-center text-sm text-muted-foreground">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function TaskSection({
    title,
    description,
    tasks,
    variant,
    emptyTitle,
    emptyDescription,
    emptyIcon,
}: {
    title: string;
    description: string;
    tasks: Task[];
    variant: 'available' | 'applied' | 'accepted';
    emptyTitle: string;
    emptyDescription: string;
    emptyIcon: React.ElementType;
}) {
    return (
        <section className="mb-10">
            <div className="mb-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {tasks.length === 0 ? (
                <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    icon={emptyIcon}
                />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} variant={variant} />
                    ))}
                </div>
            )}
        </section>
    );
}

export default function BrowseTasks({
    tasks,
    appliedTasks,
    acceptedTasks,
}: BrowseTasksProps) {
    return (
        <AppLayout>
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            Tasks
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Browse tasks, track your applications, and manage
                            accepted tasks
                        </p>
                    </div>

                    <TaskSection
                        title="Accepted Tasks"
                        description="Tasks you've been accepted for"
                        tasks={acceptedTasks}
                        variant="accepted"
                        emptyTitle="No accepted tasks yet"
                        emptyDescription="Once you're accepted for a task, it will appear here."
                        emptyIcon={CheckCircle}
                    />

                    <TaskSection
                        title="Applied Tasks"
                        description="Tasks you've applied to and are awaiting review"
                        tasks={appliedTasks}
                        variant="applied"
                        emptyTitle="No pending applications"
                        emptyDescription="Tasks you apply to will appear here while awaiting review."
                        emptyIcon={Clock}
                    />

                    {/* Available Tasks Section */}
                    <TaskSection
                        title="Available Tasks"
                        description="Browse and apply to available tasks"
                        tasks={tasks}
                        variant="available"
                        emptyTitle="No tasks available"
                        emptyDescription="There are no tasks available for application at the moment."
                        emptyIcon={FileText}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
