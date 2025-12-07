<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('teacher/applications', [
            'tasks' => auth()->guard()->user()->ownedTasks()->with(['applications.user', 'assignee'])->get(),
        ]);
    }

    public function accept(Task $task, Application $application)
    {
        $application->update(['status' => 'ACCEPTED']);
        $task->update(['assignee_id' => $application->user_id]);
        
        // Optionally reject all other pending applications
        $task->applications()
            ->where('id', '!=', $application->id)
            ->where('status', 'PENDING')
            ->update(['status' => 'REJECTED']);
        
        return redirect()->back();
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
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Application $application)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Application $application)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Application $application)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Application $application)
    {
        //
    }
}
