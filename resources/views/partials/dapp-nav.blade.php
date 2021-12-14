<header class="main-header position-absolute w-100">
    <nav class="navbar navbar-expand-xl navbar-dark sticky-header">
        <div class="container d-flex align-items-center justify-content-lg-between position-relative">
            <a href="/" class="navbar-brand d-flex align-items-center mb-md-0 text-decoration-none">
                <img src="{{asset('site-assets/img/icon.png')}}" alt="logo" class="img-fluid dapp-logo" width="150"/>
                <a href="javascript:(0);"  class="btn btn-success connect-wallet">Connect To A Wallet</a>
                <a href="javascript:(0);"  class="btn btn-warning connected-wallet"> <span class="text-primary h6"> <i class="fad fa-dot-circle text-success"></i> BSC - </span> <span class="h6 text-primary" id="accountAddress"></span></a>
                <!-- popup-with-form -->
            </a>
            <!-- <a class="navbar-toggler position-absolute right-0 border-0" href="#offcanvasWithBackdrop" role="button">
                <span class="far fa-bars" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBackdrop" aria-controls="offcanvasWithBackdrop"></span>
            </a> -->
            <div class="clearfix"></div>
            <div class="collapse navbar-collapse justify-content-center">
                <ul class="nav col-12 col-md-auto justify-content-center main-menu">

                    <!-- <li><a href="#community" class="nav-link">How To Buy Mula</a></li> -->

                </ul>
            </div>

            <div class="action-btns text-end me-5 me-lg-0 d-none d-md-block d-lg-block">

                <!-- <a href="#connection-popup"  class="btn btn-success popup-with-form">Connect To A Wallet</a> -->
            </div>


            <!--offcanvas menu start-->
            <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasWithBackdrop">
                <div class="offcanvas-header d-flex align-items-center mt-4">
                    <a href="/" class="d-flex align-items-center mb-md-0 text-decoration-none">
                        <img src="{{asset('site-assets/img/logo.png')}}" alt="logo" class="img-fluid ps-2" />
                    </a>
                    <button type="button" class="close-btn text-danger" data-bs-dismiss="offcanvas" aria-label="Close">
                        <i class="far fa-close"></i>
                    </button>
                </div>
                <div class="offcanvas-body">
                    <ul class="nav col-12 col-md-auto justify-content-center main-menu">



                        <!-- <li><a href="#community" class="nav-link">How To Buy</a></li> -->
                    </ul>
                    <div class="action-btns mt-4 ps-3">
                        <!-- <a href="#connection-popup" class="btn btn-success">Connect To A Wallet</a> -->
                    </div>
                </div>
            </div>
            <!--offcanvas menu end-->
        </div>
    </nav>
</header>

