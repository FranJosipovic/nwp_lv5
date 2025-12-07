import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import AppLayout from '@/layouts/app-layout';
import { Link, useForm } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Clock,
    Mail,
    Plus,
    UserCheck,
    UserIcon,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface Application {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        role: 'STUDENT' | 'TEACHER';
    };
    created_at: string;
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

interface Task {
    id: number;
    title: string;
    titleEng: string;
    description: string;
    type_of_study: string;
    assignee_id: number | null;
    assignee?: {
        id: number;
        name: string;
        email: string;
        role: 'STUDENT' | 'TEACHER';
    } | null;
    applications: Application[];
}

interface MyTasksApplicationsProps {
    tasks: Task[];
}

function AcceptButton({
    applicationId,
    taskId,
    disabled,
}: {
    applicationId: number;
    taskId: number;
    disabled: boolean;
}) {
    const { post, processing } = useForm({});

    const handleAccept = () => {
        post(`/tasks/${taskId}/applications/${applicationId}/accept`);
    };

    return (
        <Button
            onClick={handleAccept}
            disabled={processing || disabled}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
        >
            {processing ? '...' : 'Accept'}
        </Button>
    );
}

function RejectButton({
    applicationId,
    taskId,
    disabled,
}: {
    applicationId: number;
    taskId: number;
    disabled: boolean;
}) {
    const { post, processing } = useForm({});

    const handleReject = () => {
        post(`/tasks/${taskId}/applications/${applicationId}/reject`);
    };

    return (
        <Button
            onClick={handleReject}
            disabled={processing || disabled}
            size="sm"
            variant="outline"
            className="border-red-300 bg-transparent text-red-600 hover:bg-red-50"
        >
            {processing ? '...' : 'Reject'}
        </Button>
    );
}

function TaskCard({ task }: { task: Task }) {
    const [isOpen, setIsOpen] = useState(false);

    const hasAcceptedApplicant = task.assignee_id !== null;
    const pendingApplications = task.applications.filter(
        (app) => app.status === 'PENDING',
    );
    const acceptedApplication = task.applications.find(
        (app) => app.status === 'ACCEPTED',
    );
    const rejectedApplications = task.applications.filter(
        (app) => app.status === 'REJECTED',
    );

    const pendingCount = pendingApplications.length;

    return (
        <Card>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">
                                    {task.title}
                                </CardTitle>
                                {pendingCount > 0 && (
                                    <Badge className="bg-amber-500">
                                        {pendingCount} pending
                                    </Badge>
                                )}
                            </div>
                            <CardDescription className="mt-1">
                                {task.titleEng}
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <BookOpen className="h-3 w-3" />
                                {task.type_of_study}
                            </Badge>
                            <CollapsibleTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <Users className="mr-1 h-4 w-4" />
                                    {task.applications.length}
                                    {isOpen ? (
                                        <ChevronUp className="ml-1 h-4 w-4" />
                                    ) : (
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    )}
                                </Button>
                            </CollapsibleTrigger>
                        </div>
                    </div>
                    {hasAcceptedApplicant && task.assignee && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-800">
                                Assigned to:{' '}
                                <span className="font-medium">
                                    {task.assignee.name}
                                </span>
                            </span>
                        </div>
                    )}
                </CardHeader>

                <CollapsibleContent>
                    <CardContent className="pt-0">
                        <p className="mb-4 text-sm text-muted-foreground">
                            {task.description}
                        </p>

                        {task.applications.length === 0 ? (
                            <div className="rounded-lg bg-muted/50 py-6 text-center">
                                <UserIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    No applications yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {acceptedApplication && (
                                    <div>
                                        <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-green-700">
                                            <CheckCircle className="h-4 w-4" />
                                            Accepted
                                        </h4>
                                        <div className="flex items-center justify-between rounded-lg border border-green-300 bg-green-50 p-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200">
                                                    <UserIcon className="h-5 w-5 text-green-700" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {
                                                            acceptedApplication
                                                                .user.name
                                                        }
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            acceptedApplication
                                                                .user.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-600">
                                                Accepted
                                            </Badge>
                                        </div>
                                    </div>
                                )}

                                {pendingApplications.length > 0 && (
                                    <div>
                                        <h4 className="mb-2 flex items-center gap-1 text-sm font-medium text-amber-700">
                                            <Clock className="h-4 w-4" />
                                            Pending (
                                            {pendingApplications.length})
                                        </h4>
                                        <div className="space-y-2">
                                            {pendingApplications.map(
                                                (application) => (
                                                    <div
                                                        key={application.id}
                                                        className="flex items-center justify-between rounded-lg border p-3"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        application
                                                                            .user
                                                                            .name
                                                                    }
                                                                </p>
                                                                <div className="flex items-center gap-2">
                                                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {
                                                                            application
                                                                                .user
                                                                                .email
                                                                        }
                                                                    </span>
                                                                    <Badge
                                                                        variant="outline"
                                                                        className="text-xs"
                                                                    >
                                                                        {
                                                                            application
                                                                                .user
                                                                                .role
                                                                        }
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <RejectButton
                                                                applicationId={
                                                                    application.id
                                                                }
                                                                taskId={task.id}
                                                                disabled={
                                                                    hasAcceptedApplicant
                                                                }
                                                            />
                                                            <AcceptButton
                                                                applicationId={
                                                                    application.id
                                                                }
                                                                taskId={task.id}
                                                                disabled={
                                                                    hasAcceptedApplicant
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                                {rejectedApplications.length > 0 && (
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                                            Rejected (
                                            {rejectedApplications.length})
                                        </h4>
                                        <div className="space-y-2 opacity-60">
                                            {rejectedApplications.map(
                                                (application) => (
                                                    <div
                                                        key={application.id}
                                                        className="flex items-center justify-between rounded-lg border p-3"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                                                                <UserIcon className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium">
                                                                    {
                                                                        application
                                                                            .user
                                                                            .name
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">
                                                                    {
                                                                        application
                                                                            .user
                                                                            .email
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <Badge
                                                            variant="outline"
                                                            className="border-red-300 text-red-600"
                                                        >
                                                            Rejected
                                                        </Badge>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
}

export default function MyTasksApplications({
    tasks,
}: MyTasksApplicationsProps) {
    console.log(tasks);
    return (
        <AppLayout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">
                            My Tasks & Applications
                        </h1>
                        <p className="mt-1 text-muted-foreground">
                            Manage applications for your tasks
                        </p>
                    </div>
                    <Link href="/tasks/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Task
                        </Button>
                    </Link>
                </div>

                {tasks.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <BookOpen className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-medium">
                                No Tasks Yet
                            </h3>
                            <p className="mb-4 text-muted-foreground">
                                You haven't created any tasks yet.
                            </p>
                            <Link href="/tasks/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Task
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
