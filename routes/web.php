<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| <html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('seed');
});
Route::get('/seed-collection', function () {
    return view('seed-collection');
});
Route::get('/ido', function () {
    return view('ido');
});
Route::get('/ieo', function () {
    return view('ieo');
});

Route::get('/sale/verify/{address}/credit/{block}',[\App\Http\Controllers\ScanBSC::class, 'buys']);
Route::get('/sale/seed-round/check/{address}/contribution/{block}',[\App\Http\Controllers\ScanBSC::class, 'contributions']);

