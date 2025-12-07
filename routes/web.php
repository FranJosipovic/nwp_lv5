<?php

use App\Http\Controllers\ApplicationsController;
use App\Http\Controllers\TasksController;
use App\Http\Middleware\LocalizationMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth','verified'])->group(function (){
    Route::get('teacher/tasks', [TasksController::class, 'index'])
        ->name('teacher.tasks')->middleware(LocalizationMiddleware::class);

    Route::get('teacher/tasks/create',function(){
        return Inertia::render('teacher/create-task');
    })->name('teacher.tasks.create');

    Route::post('teacher/tasks/create',
        [TasksController::class,'store'])
        ->name('teachers.tasks.store');

    Route::get('teacher/applications',[ApplicationsController::class,'index'])->name('teacher.applications');

    Route::post('/tasks/{task}/applications/{application}/accept',[ApplicationsController::class,'accept'])->name('application.accept');
});

Route::middleware(['auth','verified'])->group(function (){
    Route::get('student/tasks', [TasksController::class, 'studentIndex'])
        ->name('student.tasks');

    Route::post('student/tasks/{task}/apply', [TasksController::class, 'apply'])
        ->name('student.tasks.apply');
});

require __DIR__.'/settings.php';
