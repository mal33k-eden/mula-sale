const SEED = {
    rate:0.025,
    minInv:1000,
    maxInv:10000,
    init :()=>{
        $('#mula-receiving').hide();
        $('#usd-giving').hide();
        $('input:radio[name="currency"]').change(()=>{
            $('#mula-receiving').empty();
            $('#usd-giving').empty();
            $("#amount").val('')
        });
        $("#amount").keyup(()=>{

            SEED.handleCalculations($("#amount").val(),$('input:radio[name="currency"]:checked').val());

        });
    },
    handleCalculations(giving,currency){

        if (giving > 0){
            let total = DAPP.tokenExpected(currency,giving,SEED.rate);
            if(currency == 'BNB'){
                $('#mula-receiving').html('Receiving : ' + parseFloat(total).toLocaleString(0) + 'MULA');
                $('#usd-giving').html(' | Giving : ' +parseFloat(DAPP.bnb_price * giving).toLocaleString(0) + 'USD');
                $('#mula-receiving').show();
                $('#usd-giving').show();
            }else{
                $('#mula-receiving').html('Receiving : ' + parseFloat(total).toLocaleString(0) + 'MULA');
                $('#mula-receiving').show();
                $('#usd-giving').hide();
            }
        }

    },
    handleContribution(){
        $(document).on('click', '#contribute',()=>{
            let name = $('#name').val()
            let email = $('#email').val()
            let wallet = $('#wallet').val()
            let giving = $('#amount').val()
            let currency = $('input:radio[name="currency"]:checked').val()
            if (giving == '' || name == '' || email == '' || wallet == ''){
                notifyError('kindly fille out all fields correctly.')
            }else{
                if (currency == 'BNB'){
                    SEED.contributeBNB(giving,wallet,name,email)
                }else{
                    showBusy()
                    notifySuccess('USDT transactions will take a bit longer.')
                    notifySuccess('')
                    notifySuccess('Kindly hold while processing completes.')
                    setTimeout(async ()=>{
                        let allowance = await DAPP.createUSDAllowance(CONTRACT.SEED,giving)
                        if (allowance){
                            notifySuccess('Please hold on while the dapp confirms your allowance')
                            setTimeout(()=>{
                                notifySuccess('Allowance created')
                                SEED.contributeUSDT(giving,wallet,name,email)
                            },500)
                        }else{
                            stopBusy()
                            notifyError('Error creating allowance, kindly check balance and try again')
                        }
                    },2000)
                }

            }
        })

    },
    contributeBNB: async (value,wallet,name,email)=>{

        showBusy()
        const options = {
            contractAddress: CONTRACT.SEED,
            functionName: 'participateBNB',
            abi: Abi.SEED,
            msgValue: Moralis.Units.ETH(value),
            params: {
                _roundId: DAPP.BNB_ROUND_ID,collector:wallet
            },
        };
        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait(3);
        SEED.trxConfirmation(receipt,value,'BNB',name,email,wallet)
    },
    contributeUSDT: async (value,wallet,name,email)=>{
        const options = {
            contractAddress: CONTRACT.SEED,
            functionName: 'participateUSDT',
            abi: Abi.SEED,
            params: {
                _roundId: DAPP.BNB_ROUND_ID,collector:wallet
            },
        };
        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait(3);
        SEED.trxConfirmation(receipt,value,'USDT',name,email,wallet)
    },
    trxConfirmation:(receipt,value,currency,name,email,wallet)=>{
        if (receipt.status == '1' ) {
            SEED.saveToDB(name,wallet,currency,value,email)
            let total = DAPP.tokenExpected(currency,value,SEED.rate);
            $('#name').val('')
            $('#email').val('')
            $('#wallet').val('')
            $('#amount').val('')
            notifySuccess('Transaction Successful');
            DAPP.showModal(
                'Your tokens have been provisioned into the vault and will be available for claim as the vesting dates roll-out',
                'Amount : '+value+ currency,
                'Number Of Tokens : '+total+'  MULA',
                'Rate : ' +SEED.rate,
                receipt.transactionHash
            );

            stopBusy()
        } else {
            notifyError('Transaction Failed')
            stopBusy()
        }
    },
    saveToDB:(name,wallet,currency,amount,email)=>{

        $.ajax({
            url: '/save-seed-investor',
            type:'get',
            data: {
                name:name,
                email:email,
                wallet:wallet,
                currency:currency,
                amount:amount,
            },
            success: function(response) {

               console.log(response)
                // $('#answers').html(response);
            }
        });
    },


}

$(()=>{
    SEED.init();
    SEED.handleContribution()
});
