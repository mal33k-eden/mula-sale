@extends('layouts.dapp')
@section('body')
    <section class="sign-up-in-section bg-dark ptb-120" style="background: url('assets/img/page-header-bg.svg')no-repeat bottom right">
        <div class="container">
            <div class="row align-items-center justify-content-between">
                <div class="col-xl-5 col-lg-5 col-md-12">
                    <div class="testimonial-tab-slider-wrap mt-5">
                        <h3 class="text-white display-9">Mula Token Sale</h3>
                        <h1 class="fw-bold text-white display-5">Seed Round <span class="text-warning">Collection</span></h1>
                        <p>Mula Seed Round investors will be able to move only 5% of their tokens at TGE, 20% on month 2, 3 and 4 after TGE and the remaining 35% on month 12.</p>
                        <p>If you are investing in BNB, the Mula dapp will make a conversion of your BNB value to USDT at the current price before emitting the MULA tokens to your wallet.</p>
                        <hr>
                        <div class="row">
                            <div class="col-lg-3 col-md-3 ">
                                <a href="#" class="bg-warning position-relative text-decoration-none      mt-4 transition-base rounded-custom d-block overflow-hidden p-3">
                                    <div class="position-relative connected-app-content">

                                        <h5 class="text-white ">$250,000</h5>
                                        <p class="mb-0 text-white">Hard Cap</p>
                                    </div>
                                </a>
                            </div>
                            <div class="col-lg-3 col-md-3 ">
                                <a href="#" class="bg-success position-relative text-decoration-none      mt-4 transition-base rounded-custom d-block overflow-hidden p-3">
                                    <div class="position-relative connected-app-content">

                                        <h5 class="text-white ">$0.025</h5>
                                        <p class="mb-0 text-white">Rate</p>
                                    </div>
                                </a>
                            </div>
                            <div class="col-lg-3 col-md-3 ">
                                <a href="#" class="bg-info position-relative text-decoration-none      mt-4 transition-base rounded-custom d-block overflow-hidden p-3">
                                    <div class="position-relative connected-app-content">

                                        <h5 class="text-white ">$2,500</h5>
                                        <p class="mb-0 text-white">Min Inv</p>
                                    </div>
                                </a>
                            </div>
                            <div class="col-lg-3 col-md-3">
                                <a href="#" class="position-relative text-decoration-none   bg-success    mt-4 transition-base rounded-custom d-block overflow-hidden p-3">
                                    <div class="position-relative connected-app-content">

                                        <h5 class="text-white ">$10,000</h5>
                                        <p class="mb-0 text-white">Max Inv</p>
                                    </div>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="col-xl-5 col-lg-7 col-md-12 ">

                    <div class="register-wrap p-5 bg-white shadow rounded-custom mt-5 mt-lg-0 mt-xl-0">

                        <h4 class="fw-medium h5">Connect your wallet and collect your tokens.</h4>

                        <div class="row mt-4 register-form">



                            <div class="col-12">
                                <h5 class="text-warning mula-to-collect">MULA 0.00</h5>
                            </div>
                            <!-- <div class="col-12">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked">
                                    <label class="form-check-label small" for="flexCheckChecked">
                                        Yes, I have read the seen round investors .
                                        <a href="#"> View privacy policy</a>.
                                    </label>
                                </div>
                            </div> -->
                            <div class="col-12">
                                <button type="submit"   class="btn btn-primary mt-4 d-block w-100 pay-trigger" id="collect">Collect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
@endsection()
