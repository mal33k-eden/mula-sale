const IDOC = {
    stages:[0,1,2,3,5],
    init: ()=>{
        showBusy()
        //check if address is connected else display connect address notice
        setTimeout(async ()=>{
            await IDOC.validateAddress()
            // let address = DAPP.address
            //
        },5000)
    },
    validateAddress:async ()=>{
        //check if the address is an investor
        if (DAPP.address != undefined){
            let isInvestor = await IDOC.isAddressInvestor()
            if (isInvestor){
                $('.vestor-card').empty()
                await IDOC.getTotalInvestment(DAPP.address)
                $('.investment').html('Total Tokens : ' + IDOC.investment +' MULA')
                for (let i = 0; i < IDOC.stages.length; i++) {
                    let _stage = IDOC.stages[i]
                    console.log(_stage)
                    let response = await IDOC.getVaultDetails(_stage,DAPP.address)
                    //build claim card
                    await IDOC.buildVestingCard(response,_stage)
                }
            }
        }else{
            notifyError('Error finding investor details with connected address')
        }
        stopBusy()
    },
    isAddressInvestor:async ()=>{
        const options = {
            contractAddress: CONTRACT.IDO_VESTOR,
            functionName: 'isInvestor',
            abi: Abi.IDO_VESTOR,
            params: {
                investor:DAPP.address
            },
        };
        return await Moralis.executeFunction(options);
    },
    getVaultDetails: async (stage,address)=>{
        const options = {
            contractAddress: CONTRACT.IDO_VESTOR,
            functionName: 'getVestingDetails',
            abi: Abi.IDO_VESTOR,
            params: {
                vestStage: stage,beneficiary:address
            },
        };
        return  await Moralis.executeFunction(options);
    },
    getTotalInvestment: async (address)=>{
        const options = {
            contractAddress: CONTRACT.IDO_VESTOR,
            functionName: 'getInvestmentTotal',
            abi: Abi.IDO_VESTOR,
            params: {
                beneficiary:address
            },
        };
        let total = Moralis.Units.FromWei(await Moralis.executeFunction(options)) ;
        let share = total * 0.2;
        IDOC.share = share.toFixed(2)
        IDOC.investment = total;
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
                            +'<h5 class="text-warning">MULA '+ IDOC.share +'</h5>'
                            if (!_status){
                                if(now > vest_date){
                                    card+='<p class="text-warning">Available Since: '+ DAPP.epochToDate(vest_date) +'</p>'
                                    card+='<button type="submit"   class="btn btn-primary mt-4 d-block w-100 claim-trigger" onclick="IDOC.claimToken('+stage+')">Claim</button>'
                                }else{
                                    card+='<p class="text-warning">Locked Till: '+ DAPP.epochToDate(vest_date) +'</p>'
                                    card+='<button type="submit"   class="btn btn-primary mt-4 d-block w-100 claim-trigger" onclick="IDOC.claimToken('+stage+')" disabled>Claim</button>'
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
            contractAddress: CONTRACT.IDO_VESTOR,
            functionName: 'withdrawInvestment',
            abi: Abi.IDO_VESTOR,
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
                'Number Of Tokens : '+(IDOC.investment * 0.2).toFixed(2) +'  MULA',
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
    IDOC.init()
    IDOC.onAddressConnected()

});
