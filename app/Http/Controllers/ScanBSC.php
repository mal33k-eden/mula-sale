<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ScanBSC extends Controller
{
    //
    //https://api.bscscan.com/  https://api-testnet.bscscan.com/
    function buys($address,$startBlock){
        $response = Http::get(env('BSC_API_ENDPOINT'), [
            'module'=>'account',
            'action'=>'tokentx',
            'address' => $address,
            'startblock' => $startBlock,
            'endblock'=>"latest",
            'sort'=>'desc',
            'apikey'=>env('BSC_APIKEY')
        ]);
        if($response->successful()){
            return $response->json();
        }else{
            return $response->json(['status'=>'0']);
        }
    }
    function contributions($address,$startBlock){
         $response = Http::get(env('BSC_API_ENDPOINT'), [
            'module'=>'account',
            'action'=>'txlist',
            'address' => $address,
            'startblock' => $startBlock,
            'endblock'=>"latest",
            'sort'=>'desc',
            'apikey'=>env('BSC_APIKEY')
        ]);
        if($response->successful()){
            return $response->json();
        }else{
            return $response->json(['status'=>'0']);
        }
    }



}
