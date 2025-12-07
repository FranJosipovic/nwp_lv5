<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\TwoFactorAuthenticationController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('user-password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::get('settings/appearance', function () {

        $currentLocale = session()->get('locale') ?? App::currentLocale();

        return Inertia::render('settings/appearance',[
            'locales' => ['en','hr'],
            'currentLocale' => $currentLocale
        ]);
    })->name('appearance.edit');

    Route::post('settings/appearance/locale', function (Illuminate\Http\Request $request) {
        $request->validate([
            'locale' => 'required|in:en,hr',
        ]);

        $request->session()->put('locale',$request->locale);

        return back();
    })->name('appearance.update-locale');


    Route::get('settings/two-factor', [TwoFactorAuthenticationController::class, 'show'])
        ->name('two-factor.show');
});
