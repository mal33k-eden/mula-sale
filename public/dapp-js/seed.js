const Seed = {
    rate:0.025,
    init :()=>{
        const contributeBtn = $('#contribute');
        const collectBtn = $('#collect');

        if (contributeBtn.length > 0) {
            document.querySelector('#contribute').addEventListener('click', () => {Seed.contributeForm();});
        }
        if (collectBtn.length > 0) {
        document.querySelector('#collect').addEventListener('click', () => {Seed.collectSeedToken();});
        }
        $('#mula-receiving').hide();
        $('#usd-giving').hide();
        $('#amount').prop('disabled',true)
        $('input:radio[name="currency"]').change(()=>{$('#amount').prop('disabled',false);$('#mula-receiving').empty();$('#usd-giving').empty();});
        $("#amount").keyup(()=>{Seed.handleBnBAmount($("#amount").val(),$('input:radio[name="currency"]:checked').val())});
        Seed.priceChecker();
    },
    contributeForm:()=>{
        $('#seed-form').validate({
            rules:{
                currency:{ required:true },

            },messages:{currency:{required:"Please select a currency"}},
            errorPlacement: function(error, element) {
                console.log(element)
                if ( element.is(":radio")){
                    error.appendTo('.radio-container');
                }else{ // This is the default behavior
                    error.insertAfter( element );
                }
            },submitHandler: function(form,event) {
                event.preventDefault();
                showBusy()
                WALLET.flag = 1
                let value = $('#amount').val();
                let currency = $('input:radio[name="currency"]:checked').val();
                if (currency =='BNB') {
                    Seed.contributeBNB(currency,value);
                } else {
                    notifySuccess('USDT transactions will take a bit longer. Kindly hold while processing completes.')
                    WALLET.createUSDAllowance(CONTRACT.SEED,value);
                    let interval = setInterval(() => {
                        console.log(WALLET.allowance)
                       if (WALLET.allowance == true) {
                           notifySuccess('USDT transactions will take a bit longer. Kindly hold while processing completes.')
                           setTimeout(() => {
                            Seed.contributeUSD(value);
                            WALLET.allowance = null;
                           }, 2000);
                        clearInterval(interval)
                       }
                        if (WALLET.allowance == false) {
                            stopBusy()
                            clearInterval(interval)
                        }
                    }, 2000);
                }
                $('#seed-form').trigger("reset");


                //let formData = $('#seed-form').serialize();
                //Seed.saveToDB(formData);
            }
        });
    },

    priceChecker:  ()=>{
        setInterval(()=>{WALLET.chainLinkPrice()},6000)
    },
    handleBnBAmount(giving,currency){
        let total = WALLET.tokenExpected(currency,giving,Seed.rate);
        if(currency == 'BNB'){
            $('#mula-receiving').html('Receiving : ' + parseFloat(total).toLocaleString(0) + 'MULA');
            $('#usd-giving').html(' | Giving : ' +parseFloat(WALLET.bnb_price * giving).toLocaleString(0) + 'USD');
            $('#mula-receiving').show();
            $('#usd-giving').show();
        }else{
            $('#mula-receiving').html('Receiving : ' + parseFloat(total).toLocaleString(0) + 'MULA');
            $('#mula-receiving').show();
            $('#usd-giving').hide();
        }
    },
    checkTransaction: async (interval,_weiSpending,currency,tokens)=>{

        console.log(parseFloat(tokens).toLocaleString(0))
        WALLET.flag++;
        let res = await Seed.verifyContributionOnBSC();
        let data = res.data;
        console.log(data)
        if(data.status == 1){
             let trxs = data.result;
             for (let trx of trxs) {
                 if(trx.to == CONTRACT.SEED.toLowerCase() && trx.value == _weiSpending){
                    if (trx.isError == 0) {
                        WALLET.flag = 0;
                        notifySuccess('Transaction Successful');
                        WALLET.showModal(
                            'We will inform the community when claiming opens. Stay glued to our community.',
                            'Amount : ' + WALLET.web3.utils.fromWei(_weiSpending,'ether')  + currency,
                            'Number Of Tokens : '+tokens+' MULA',
                            'Rate : 0.025',
                            trx.hash
                        );
                        stopBusy()
                     clearInterval(interval);
                     } else {
                         console.log(trx.isError)
                         console.log(trx.hash)
                        notifyError('Transaction Failed')
                        stopBusy()
                        clearInterval(interval);
                        notifyError('Transaction Failed')
                     }

                 }

             }
         }
    },
    contributeBNB:(currency,value)=>{
        let _weiSpending = WALLET.web3.utils.toWei(value); //in wei
        console.log(_weiSpending)
        let trxParam = {
            to: CONTRACT.SeedRound._address,
            from: WALLET.account,
            data: CONTRACT.SeedRound.methods.participateBNB(WALLET.BNB_ROUND_ID).encodeABI(),
            gas:"0x4DD0F",
            gasPrice: "0x2CB417800",
            value: WALLET.web3.utils.fromDecimal(WALLET.web3.utils.toBN(_weiSpending))
        };
        let tokens = WALLET.tokenExpected(currency,value,Seed.rate);

        WALLET.sendTrx(trxParam);
        setTimeout(function(){
            console.error("Did not get response in 15 seconds");
            let interval = setInterval(function(){
                if(WALLET.flag > 0 && WALLET.flag <= 6){
                    Seed.checkTransaction(interval,_weiSpending,currency,tokens);
                }else{
                    WALLET.flag = 0;
                    clearInterval(interval);
                    stopBusy()
                }
            }, 5000);

        }, 15000);
    },
    contributeUSD:(value)=>{
        WALLET.flag = 1;
        let _weiSpending = WALLET.web3.utils.toWei(value); //in wei
        let trxParam = {
            to: CONTRACT.SeedRound._address,
            from: WALLET.account,
            data: CONTRACT.SeedRound.methods.participateUSD(WALLET.BNB_ROUND_ID).encodeABI(),
            gas:"0x4DD0F",
            gasPrice: "0x2CB417800",
        };
        // let tokens = WALLET.tokenExpected(currency,_weiSpending,Seed.rate);
        WALLET.sendTrx(trxParam);
        setTimeout(function(){
            console.error("Did not get response in 15 seconds");
            let interval = setInterval(function(){
                if(WALLET.flag > 0 && WALLET.flag <= 6){
                    Seed.checkTransaction(interval,_weiSpending);
                }else{
                    WALLET.flag = 0;
                   notifyError('Transaction Failed')
                   stopBusy()
                   clearInterval(interval);
                }
            }, 5000);

        }, 15000);
    },
    saveToDB:(_data)=>{
        $.ajax({
            url: '/sale/seed-round',
            type:'post',
            data: _data,
            beforeSend:function(){
                showBusy()
            },
            success: function(response) {
               if (response.inserted == 1) {
                   console.log('inserted')
                   $('#seed-form').trigger("reset");

               } else {
                console.log('error occured')
               }
                // $('#answers').html(response);
            }
        });
    },
    verifyContributionOnBSC: async ()=>{
        try {
            return await axios.get('/sale/seed-round/check/'+WALLET.account+'/contribution/' + WALLET.block)
        } catch (error) {
            console.error(error)
        }
        return false;
    },
    collectSeedToken:async ()=>{
        showBusy()
        WALLET.flag=1;
        let trxParam = {
            to: CONTRACT.SeedRound._address,
            from: WALLET.account,
            data: CONTRACT.SeedRound.methods._collectMula(WALLET.account).encodeABI(),
            gas:"0x4DD0F",
            gasPrice: "0x2CB417800",
        };
        //let tokens = WALLET.tokenExpected(currency,_weiSpending,Seed.rate);
        WALLET.sendTrx(trxParam);
        setTimeout(function(){
            console.error("Did not get response in 15 seconds");
            let interval = setInterval(function(){
                if(WALLET.flag > 0 && WALLET.flag <= 6){
                    WALLET.checkTransaction(interval);
                }else{
                    WALLET.flag = 0;
                    clearInterval(interval);
                    stopBusy()
                }
            }, 5000);

        }, 15000);
    }


}

$(()=>{
    Seed.init();
});
