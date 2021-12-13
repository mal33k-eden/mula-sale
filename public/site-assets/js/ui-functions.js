function showBusy(){
    $.blockUI({ message: '<h1><img src="/site-assets/img/icon.png" style="width:100px"/>' }); 
}

function stopBusy(){
    setTimeout(function(){  $.unblockUI(); }, 3000);
}

function notifyError(msg){
    $.notify(msg, "error");
}
function notifySuccess(msg){
    $.notify(msg, "success");
}