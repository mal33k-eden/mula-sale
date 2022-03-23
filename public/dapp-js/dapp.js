const DAPP = {
    moralisUrl:"https://sjd9gxsyctno.usemoralis.com:2053/server",
    moralisId:'21Fz6i8ZlSZm9awj55i4GgT433r4AvA6RRwrLHUi',
    init : async ()=>{


        let serverUrl = DAPP.moralisUrl
        let appId  = DAPP.moralisId
        Moralis.start({serverUrl, appId });
        DAPP.displayAddress()
        DAPP.getUser()
        DAPP.connectWallet()
        DAPP.chainLinkPrice()
        // DAPP.onChainChange()

    },
    displayAddress(){
        $('.pay-trigger').prop('disabled',true);
        if (DAPP.address == null) {
            $(".connect-wallet").show();
            $('.connected-wallet').hide();
        }else {
            $(".connect-wallet").hide();
            $('.connected-wallet').show();
            $("#accountAddress").html('BSC - ' + DAPP.formatAddress(DAPP.address))
        }
    },
    getUser:async ()=>{
        let user = Moralis.User.current();
        console.log(user)

        if (user) {
            DAPP.web3  = await Moralis.enableWeb3()
            let _address = user.get('ethAddress')
            DAPP.address = _address
            DAPP.displayAddress()
            DAPP.enforceBSCNetwork()
            if($('.collect-spotter-ido').length){
               IDOC.validateAddress()
            }
            if($('.collect-spotter-seed').length){
                SEEDC.validateAddress()
            }
            return user.get('ethAddress');

        }
        return false;
    },
    connectWallet: async ()=>{
        $(document).on('click', '.connect-wallet', async function (e) {
            e.preventDefault();
            let user = Moralis.User.current();
            if (!user) {
                console.log('has to log')
                try {
                    DAPP.web3  = await Moralis.enableWeb3()
                    user = await Moralis.authenticate(
                        { signingMessage: "Connect To Mula Finance Sale Dapp"})

                    user.get('ethAddress')
                    DAPP.getUser()
                } catch(error) {
                    console.log(error)
                }
            }else{
                console.log(user.get('ethAddress'))
            }
        })
    },
    disconnectWallet:async ()=>{
        $(document).on('click', '.disconnect-wallet', async function (e) {
            await Moralis.User.logOut();
            console.log("logged out");
            location.reload();
        })


    },
    enforceBSCNetwork:async ()=>{
        const chainId =  parseInt(await  Moralis.chainId, 16);
        if(chainId == '97'){
            DAPP.displayAddress()
            setInterval(()=>{DAPP.chainLinkPrice()},6000)
            notifySuccess('Wallet connected');
            $('.pay-trigger').prop('disabled',false);
        }else{
            notifyError('Wrong Network. change network to Binance SmartChain');
            $("#accountAddress").html('Change Your Network to BSC')
        }

    },
    formatAddress:(address)=>{
        var front = address.substr(0,4)
        var back = address.substr(address.length-5,5)
        return front +'...'+back
    },
    onChainChange:()=>{
        Moralis.onChainChanged(async function (chain) {
            DAPP.enforceBSCNetwork()
            if($('.collect-spotter').length){
                await Moralis.User.logOut();
                console.log("logged out");
                location.reload();
            }
        });
    },
    chainLinkPrice: async ()=>{
        const ethers = Moralis.web3Library
        const addr = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526" // 0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE
        const priceFeed = new ethers.Contract( addr, Abi.CL,DAPP.web3);
        const res = await priceFeed.latestRoundData()
        DAPP.bnb_price= res[1]/10**8;
        $('#chain-link-price').html(DAPP.bnb_price.toFixed(2))
        DAPP.BNB_ROUND_ID = res[0].toString()
        console.log(res[0].toString())

    },
    tokenExpected:(currency,giving,rate)=>{

        let total = 0;
        if(currency == 'BNB'){
            total =  Moralis.Units.Token(giving, "18") /  Moralis.Units.Token((((rate) /DAPP.bnb_price).toFixed(8)).toString(), "18");
            total = total.toString().split(".")[0];
        }else{
            total =  Moralis.Units.Token(giving, "18") / Moralis.Units.Token((((rate)).toFixed(8)).toString(), "18");
            total = total.toString().split(".")[0];
        }
        return total;
    },
    showGenModal:(title,subtitle)=>{

        $('._title').html(title);
        $('._sub_title').html(subtitle);

        $('.gen-modal').modal('show');
    },
    showModal:(title,investment,numOfTokens,rate,trxHash)=>{

        $('._title').html(title);
        $('._investment').html(investment);
        $('._numOfTokens').html(numOfTokens);
        $('._rate').html(rate);
        $('._trxHash').html(trxHash);
        var bscScan = "https://bscscan.com/tx/"+trxHash;
        $('.trx-hash').attr('href', bscScan);

        $('.success-trx').modal('show');
    },
    disconnectModal:()=>{
        $(document).on('click', '.show-disconnect-wallet', function (e) {
            $('._address').html(DAPP.address);
            $('.disconnect-wallet-modal').modal('show');
        })

    },
    createUSDAllowance: async (contractAddress,value)=>{
        const options = {
            contractAddress: CONTRACT.USDT,
            functionName: 'approve',
            abi: Abi.USDT,
            params: {
                spender: contractAddress,amount:Moralis.Units.ETH(value)
            },
        };
        const transaction = await Moralis.executeFunction(options);
        const receipt = await transaction.wait(3);
        if (receipt.status == 1){
            return true
        }
        return false
    },
    //Epoch
    dateToEpoch:(date)=> {
        return Math.round(new Date(date).getTime() / 1000.0);
    },
    epochToDate:(_epoch)=>{
        let epoch = _epoch
        if (epoch < 10000000000){
            epoch *= 1000;
        }
        // convert to milliseconds (Epoch is usually expressed in seconds, but Javascript uses Milliseconds)
         epoch = epoch + (new Date().getTimezoneOffset() * -1); //for timeZone
        return new Date(epoch);
    }
}
$(()=>{
    DAPP.init()
    DAPP.disconnectModal()
    DAPP.disconnectWallet()
})
