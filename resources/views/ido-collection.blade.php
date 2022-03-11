@extends('layouts.dapp')
@section('body')
    <section class="sign-up-in-section bg-dark ptb-60">
        <div class="container">
            <div class="row align-items-center justify-content-between">
                <div class="col-xl-12 col-lg-12 col-md-12">
                    <div class="testimonial-tab-slider-wrap mt-5">
                        <h3 class="text-white display-9">Mula Token Collection</h3>
                        <h1 class="fw-bold text-white display-5">IDO Collection</h1>
                         <hr>
                        <h3 class="text-warning display-9 investment collect-spotter-ido"></h3>
                        <div class="row vestor-card">
                            <h3 class="text-white display-9">Connect Your Wallet To Claim</h3>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        @include('partials/trx-modal')
        @include('partials/gen-modal')
        @include('partials/wallet-disconnect-modal')
    </section>
@endsection()
@section('scripts')
    <script src="{{asset('dapp-js/ido-collection.js')}}"></script>
@endsection
