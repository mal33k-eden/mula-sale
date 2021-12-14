<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class InvestorsRecords extends Controller
{
    //

    public function saveInvestor(Request $request){
        $input = $request->_data;
        $name = $input[0]['value'];
        $email = $input[1]['value'];
        $cur = $input[2]['value'];
        $wallet = $input[3]['value'];
        $amount = $input[4]['value'];
        $USD = 0;
        $BNB = 0;
        if ($cur == 'BNB'){
            $BNB = $amount;
        }else{
            $USD = $amount;
        }
        $data = [
            $name, $email, $cur, $wallet,$USD,$BNB
        ];

        $handle = fopen(public_path('storage') . '/investor.csv', "a");

        fputcsv($handle, $data); # $line is an array of strings (array|string[])

        fclose($handle);

        return response()->json();
    }
    public function downloadInvestor(Request $request){

        //PDF file is stored under project/public/download/info.pdf
        $file= public_path(). "/storage/investor.csv";

        $headers = array(
            'Content-Type: application/csv',
        );

        return Response::download($file, 'investor.csv', $headers);
        //return public_path('storage') . '/investor.csv';
    }

}
