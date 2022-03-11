<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
@include('partials/head')
<body>

<!--preloader start-->
<div id="preloader">
    <div class="preloader-wrap">
        <img src="{{asset('site-assets/img/icon.png')}}" alt="logo" class="img-fluid preloader-icon" />
        <div class="loading-bar"></div>
    </div>
</div>
<!--preloader end-->
<!--main content wrapper start-->
<div class="main-wrapper">

    <!--header section start-->
    <!--header start-->
@include('partials/dapp-nav')


@yield('body')
<!--header end-->
    <!--register section start-->

    <!--footer section start-->
    <!--footer section start-->
@include('partials/footer')
<!--footer section end-->
    <!--footer section end-->

</div>



<!--build:js-->
@include('partials/scripts')
@yield('scripts')

<!--endbuild-->
</body>


</html>
