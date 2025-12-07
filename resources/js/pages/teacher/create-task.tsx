import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface CreateTaskProps {
    studyTypes?: string[];
}

export default function CreateTask({
    studyTypes = ['PROFESSIONAL', 'UNDERGRADUATE', 'GRADUATE'],
}: CreateTaskProps) {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-2xl px-4 py-8">
                {/* Back Button */}
                <Link
                    href="/teacher/tasks"
                    className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Tasks
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Create New Task
                        </CardTitle>
                        <CardDescription>
                            Fill in the details below to create a new task.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            method="post"
                            action="/teacher/tasks/create"
                            className="flex flex-col gap-6"
                        >
                            {/* Title */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    placeholder="Enter task title"
                                />
                            </div>

                            {/* English Title */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="titleEng">English Title</Label>
                                <Input
                                    id="titleEng"
                                    name="titleEng"
                                    type="text"
                                    placeholder="Enter English title"
                                />
                            </div>

                            {/* Type of Study */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="type_of_study">
                                    Type of Study
                                </Label>
                                <Select name="type_of_study">
                                    <SelectTrigger id="type_of_study">
                                        <SelectValue placeholder="Select type of study" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {studyTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Enter task description"
                                    rows={5}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-3 pt-2">
                                <Button type="submit">Create Task</Button>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
