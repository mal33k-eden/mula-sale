const IDO = {
    rate:0.065,
    init:()=>{
        $('#mula-receiving').hide();
        $('#usd-giving').hide();
        $('input:radio[name="currency"]').change(()=>{
            $('#mula-receiving').empty();
            $('#usd-giving').empty();
            $("#amount").val('')
        });
        $("#amount").keyup(()=>{
            IDO.handleCalculations($("#amount").val(),$('input:radio[name="currency"]:checked').val());

        });
    },
    handleCalculations(giving,currency){
        if (giving > 0){
            let total = DAPP.tokenExpected(currency,giving,IDO.rate);
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
            let giving = $('#amount').val()
            let currency = $('input:radio[name="currency"]:checked').val()
            if (giving === ''){
                notifyError('amount field cannot be empty')
            }else{
                if (currency == 'BNB'){
                    IDO.contributeBNB(giving)
                }else{
                    showBusy()
                    notifySuccess('USDT transactions will take a bit longer.')
                    notifySuccess('')
                    notifySuccess('Kindly hold while processing completes.')
                    setTimeout(async ()=>{
                        let allowance = await DAPP.createUSDAllowance(CONTRACT.IDO,giving)
                        if (allowance){
                            notifySuccess('Please hold on while the dapp confirms your allowance')
                            setTimeout(()=>{
                                notifySuccess('Allowance created')
                                IDO.contributeUSDT(giving)
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
    contributeBNB: async (value)=>{

        showBusy()
        const options = {
            contractAddress: CONTRACT.IDO,
            functionName: 'participateBNB',
            abi: Abi.IDO,
            msgValue: Moralis.Units.ETH(value),
            params: {
                _roundId: DAPP.BNB_ROUND_ID,
            },
        };
        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait(3);
        IDO.trxConfirmation(receipt,value,'BNB')
    },
    contributeUSDT: async (value)=>{
        const options = {
            contractAddress: CONTRACT.IDO,
            functionName: 'participateUSDT',
            abi: Abi.IDO,
            params: {
                _roundId: DAPP.BNB_ROUND_ID,
            },
        };
        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait(3);
        IDO.trxConfirmation(receipt,value,'USDT')
    },
    trxConfirmation:(receipt,value,currency)=>{
        if (receipt.status == '1' ) {
            let total = DAPP.tokenExpected(currency,value,IDO.rate);
            let formData = $('#amount').val('');
            notifySuccess('Transaction Successful');
            DAPP.showModal(
                'Your tokens have been provisioned into the vault and will be available for claim as the vesting dates roll-out',
                'Amount : '+value+ currency,
                'Number Of Tokens : '+total+'  MULA',
                'Rate : ' +IDO.rate,
                 receipt.transactionHash
            );
            stopBusy()
        } else {
            notifyError('Transaction Failed')
            stopBusy()
        }
    }
}

$(()=>{
    IDO.init()
    IDO.handleContribution()
});
