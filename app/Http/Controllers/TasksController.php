<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Task;
use Illuminate\Container\Attributes\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TasksController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = auth()->guard()->user()->ownedTasks()->with('assignee')->get();

        return Inertia::render('teacher/tasks',[
            'tasks' => $tasks,
            'translations' => __('messages')
        ]);
    }

    public function studentIndex(){
        $tasksAvailable = Task::whereNull('assignee_id')
            ->where('owner_id', '!=', auth()->guard()->id())
            ->whereDoesntHave('applications', function ($query) {
                $query->where('user_id', auth()->guard()->id());
            })
            ->with('owner')->get();

        $acceptedTasks = Task::where('assignee_id', auth()->guard()->id())
            ->with('owner')->get();

        $appliedTasks = Task::whereHas('applications', function ($query) {
            $query->where('user_id', auth()->guard()->id())
                    ->where('status','PENDING');
        })->with('owner')->get();

        return Inertia::render('student/tasks', [
            'tasks' => $tasksAvailable,
            'acceptedTasks' => $acceptedTasks,
            'appliedTasks' => $appliedTasks,
            'translations' => __('messages'),
        ]);
    }

    public function apply(Task $task)
    {
        // Check if student has already applied
        $existingApplication = Application::where('task_id', $task->id)
            ->where('user_id', auth()->guard()->id())
            ->first();

        if ($existingApplication) {
            return redirect()->back()
                ->with('error', 'You have already applied to this task');
        }

        // Check if task is already assigned
        if ($task->assignee_id !== null) {
            return redirect()->back()
                ->with('error', 'This task is no longer available');
        }

        // Create application
        Application::create([
            'task_id' => $task->id,
            'user_id' => auth()->guard()->id(),
            'status' => 'PENDING',
        ]);

        return redirect()->back()
            ->with('success', 'Application submitted successfully');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'titleEng' => 'required|string|max:255',
            'description' => 'required|string',
            'type_of_study' => 'required|in:PROFESSIONAL,UNDERGRADUATE,GRADUATE',
        ]);

        auth()->guard()->user()->ownedTasks()->create($validated);

        return redirect()->route('teacher.tasks')
            ->with('success', 'Task created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
