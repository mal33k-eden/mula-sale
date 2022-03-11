const SEEDC = {
    stages:[0,2,3,4,6],
    init: ()=>{
        showBusy()
        //check if address is connected else display connect address notice
        setTimeout(async ()=>{
            await SEEDC.validateAddress()
            // let address = DAPP.address
            //
        },5000)
    },
    validateAddress:async ()=>{
        //check if the address is an investor
        if (DAPP.address != undefined){
            let isInvestor = await SEEDC.isAddressInvestor()
            if (isInvestor){
                $('.vestor-card').empty()
                await SEEDC.getTotalInvestment(DAPP.address)
                $('.investment').html('Total Tokens : ' + SEEDC.investment +' MULA')
                for (let i = 0; i < SEEDC.stages.length; i++) {
                    let _stage = SEEDC.stages[i]
                    let response = await SEEDC.getVaultDetails(_stage,DAPP.address)
                    //build claim card
                    await SEEDC.buildVestingCard(response,_stage)
                }
            }
        }else{
            notifyError('Error finding investor details with connected address')
        }
        stopBusy()
    },
    isAddressInvestor:async ()=>{
        const options = {
            contractAddress: CONTRACT.SEED_VESTOR,
            functionName: 'isInvestor',
            abi: Abi.SEED_VESTOR,
            params: {
                investor:DAPP.address
            },
        };
        return await Moralis.executeFunction(options);
    },
    getVaultDetails: async (stage,address)=>{
        const options = {
            contractAddress: CONTRACT.SEED_VESTOR,
            functionName: 'getVestingDetails',
            abi: Abi.SEED_VESTOR,
            params: {
                vestStage: stage,beneficiary:address
            },
        };
        return  await Moralis.executeFunction(options);
    },
    getTotalInvestment: async (address)=>{
        const options = {
            contractAddress: CONTRACT.SEED_VESTOR,
            functionName: 'getInvestmentTotal',
            abi: Abi.SEED_VESTOR,
            params: {
                beneficiary:address
            },
        };
        let total = Moralis.Units.FromWei(await Moralis.executeFunction(options)) ;
        let share = total * 0.2;
        SEEDC.share = share.toFixed(2)
        SEEDC.investment = total;
    },
    buildVestingCard:async (response,stage)=>{
        console.log(response)
        let _date = response[0]
        console.log(_date)
        let now = DAPP.dateToEpoch(new Date(Date.now()));
        let vest_date = _date

        let _status = response[1]
        let card = '<div class="col-lg-4 col-md-6 mb-3 mt-3 ">'
                    +'<a href="javascript:void(0);" class="position-relative text-decoration-none connected-app-single bg-dark border border-2  mt-4 mt-lg-0 mt-md-0 transition-base rounded-custom d-block overflow-hidden p-5">'
                        +'<div class="position-relative connected-app-content">'
                            +'<div class="integration-logo bg-warning rounded-circle p-2 d-inline-block">'
                                if(now > vest_date){
                                    card+='<img src="/images/unlock.png" width="40" alt="integration" class="img-fluid">'
                                }else{
                                    card+='<img src="images/lock.png" width="40" alt="integration" class="img-fluid">'
                                }
                            card+='</div>'
                            +'<h5 class="text-warning">MULA '+ SEEDC.share +'</h5>'
                            if (!_status){
                                if(now > vest_date){
                                    card+='<p class="text-warning">Available Since: '+ DAPP.epochToDate(vest_date) +'</p>'
                                    card+='<button type="submit"   class="btn btn-primary mt-4 d-block w-100 claim-trigger" onclick="SEEDC.claimToken('+stage+')">Claim</button>'
                                }else{
                                    card+='<p class="text-warning">Locked Till: '+ DAPP.epochToDate(vest_date) +'</p>'
                                    card+='<button type="submit"   class="btn btn-primary mt-4 d-block w-100 claim-trigger" onclick="SEEDC.claimToken('+stage+')" disabled>Claim</button>'
                                }
                            }

                        card+='</div>'
                    if (_status){
                        card+='<span class="badge position-absolute integration-badge bg-success-dark px-3 py-2 text-primary">Claimed</span>'
                    }else{
                        if(now > vest_date){
                            card+='<span class="badge position-absolute integration-badge bg-success-light px-3 py-2 text-primary">Opened</span>'
                        }else{
                            card+='<span class="badge position-absolute integration-badge bg-primary-soft px-3 py-2 text-primary">Locked</span>'
                        }
                    }

                    card+='</a>'
                +'</div>'
        $('.vestor-card').append(card)

    },
    onAddressConnected: ()=>{
        Moralis.onAccountChanged(async function (chain) {
            if($('.collect-spotter').length){
                await Moralis.User.logOut();
                console.log("logged out");
                location.reload();
            }
        });
    },
    claimToken:async (stage)=>{
        showBusy()
        const options = {
            contractAddress: CONTRACT.SEED_VESTOR,
            functionName: 'withdrawInvestment',
            abi: Abi.SEED_VESTOR,
            params: {
                vestStage:stage
            },
        };
        let trx = await Moralis.executeFunction(options)
        let res = await trx.wait(3)
        if(res.status == 1){
            DAPP.showModal(
                'Your tokens have been sent to you wallet address',
                'Release Stage : M-' + ( parseInt(stage) + 1),
                'Number Of Tokens : '+(SEEDC.investment * 0.2).toFixed(2) +'  MULA',
                '',
                res.transactionHash
            );

        }else{
            notifyError('could not claim at this time. try again')
        }
        stopBusy()
    }

}

$(()=>{
    SEEDC.init()
    SEEDC.onAddressConnected()

});
