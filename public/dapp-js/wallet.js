const connectBtn = document.querySelector('.connect-wallet');
const connectedBtn = document.querySelector('.connected-wallet');
const walletBtn = document.querySelector('.connected-wallet');
const Web3Modal = window.Web3Modal.default;
        const WalletConnectProvider = window.WalletConnectProvider.default;
        const providerOptions = {
            // Example with WalletConnect provider
            walletconnect: {

                package: WalletConnectProvider,
                options: {
                    infuraId: "f67b5c76814745f5ba04d5bb8d37a9f1",
                    qrcodeModalOptions: {
                        mobileLinks: [
                            "rainbow",
                            "metamask",
                            "argent",
                            "trust",
                            "imtoken",
                            "pillar",
                        ],
                    },
                }
            }
        };
        const web3Modal = new Web3Modal({
            cacheProvider: false, // optional
            providerOptions, // required
            disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        });
const WALLET = {
    account:null,
    bnb_price:0,
    allowance:null,
    init:()=>{
        WALLET.configureWallectConnect();
        connectBtn.addEventListener('click', () => {WALLET.connectWallet();});
        connectedBtn.addEventListener('click', () => {WALLET.clipAddress();});
        $('.connect-wallet').hide();
        $('.connected-wallet').hide();
        $('.pay-trigger').prop('disabled',true);
        WALLET.configureWeb3();



        // $('#trx-success-popup').on('hidden.bs.modal', function () {
        //     location.reload();
        // })

        // addressDiv.hide();
    },
    configureWallectConnect:()=>{
    },
    configureWeb3:()=>{
        WALLET.web3 = new Web3(NODE);
        if (WALLET.account == null) {
            $(".connect-wallet").show();
            $('.connected-wallet').hide();
        }else{
            WALLET.enforceBSCNetwork();

        }
        WALLET.chainLinkPrice()
    },
    connectWallet: async ()=>{

        try {
            WALLET.provider = await web3Modal.connect();
        } catch(e) {
            //WALLET.notifyError("Could not get a wallet connection. Try again or contact us via our telegram channel");
            return;
        }
        if (WALLET.provider) {
            WALLET.provider.on('accountsChanged', WALLET.loadWallet);
            WALLET.provider.on('chainChanged',(chainId) => window.location.reload());
            WALLET.provider.on('networkChanged',(networkId) => window.location.reload());
            WALLET.web3 = new Web3(WALLET.provider);
            //await WALLET.loadContracts();
            await WALLET.loadWallet();

            //PSL.notifySuccess('Wallet connected');

        }
    },
    displayAddress:()=>{
        let string = WALLET.account;
        let display = string.substr(0,6) + '...' + string.slice(-4)
        $('#accountAddress').html(display);
    },
    loadWallet:async ()=>{
            // Get list of accounts of the connected wallet
        let accounts = await WALLET.web3.eth.getAccounts();
        if (accounts.length === 0) {
            // MetaMask is locked or the user has not connected any accounts
            notifyError('Looks like you have not unlocked your metamask wallet. check your wallet & try again');
            $(".connect-wallet").show();
            $('.connected-wallet').hide();
            $('.pay-trigger').prop('disabled',true);
        } else if (accounts[0] !== WALLET.account) {
            WALLET.account = accounts[0];



            WALLET.enforceBSCNetwork();
            // WALLET.onDisconnect()
        }
    },
    enforceBSCNetwork:async ()=>{
        const chainId = await WALLET.web3.eth.getChainId();

       if(chainId == '97'){

           $(".connect-wallet").hide();
           $('.connected-wallet').show();
           $('.pay-trigger').prop('disabled',false);
           WALLET.displayAddress()
           // $('#accountAddress').html("#: " + WALLET.account);
           notifySuccess('Wallet connected');
           WALLET.checkSeedCollection();

       }else{
            notifyError('Wrong Network.');
        }
    },
    checkSeedCollection:async ()=>{
        //load contracts
        let seed = CONTRACT.SeedRound.methods;
        seed.getParticipantReceivings(WALLET.account).call().then((collection)=>{
            if(collection > 0){
                WALLET.seedCollection = collection;
                $('.mula-to-collect').html('MULA ' + WALLET.web3.utils.fromWei(collection,'ether'));
                console.log(collection)
            }
            console.log(collection)
        });

    },
    onDisconnect: async ()=> {

        console.log("Killing the wallet connection", WALLET.provider);

        // TODO: Which providers have close method?
        if(WALLET.provider.close) {
          await WALLET.provider.close();

          // If the cached provider is not cleared,
          // WalletConnect will default to the existing session
          // and does not allow to re-scan the QR code with a new wallet.
          // Depending on your use case you may want or want not his behavir.
          await WALLET.web3Modal.clearCachedProvider();
          WALLET.provider = null;

        }
        window.location.reload();
    },
    chainLinkPrice: ()=>{
        const addr = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526"
            const priceFeed = new WALLET.web3.eth.Contract(Abi.CL, addr)
             priceFeed.methods.latestRoundData().call()
            .then((roundData) => {
            WALLET.bnb_price= roundData[1]/10**8;
            $('#chain-link-price').html(WALLET.bnb_price.toFixed(2))
            console.log(WALLET.bnb_price)
            WALLET.BNB_ROUND_ID = roundData[0];
        })
    },
    tokenExpected:(currency,giving,rate)=>{
        console.log(currency)
        console.log(giving)
        let total = 0;
        if(currency == 'BNB'){
            total =  WALLET.web3.utils.toWei(giving) / WALLET.web3.utils.toWei((((rate) /WALLET.bnb_price).toFixed(8)).toString());

            total = total.toString().split(".")[0];
        }else{
            total = WALLET.web3.utils.toWei(giving) / WALLET.web3.utils.toWei((((rate)).toFixed(8)).toString());
            total = total.toString().split(".")[0];
        }
        return total;
    },
    sendTrx:async (trxParam)=>{
        WALLET.setLatestBlock();
        let y = await WALLET.web3.eth.sendTransaction(trxParam);
        console.log(y)
    },
    createUSDAllowance:(contractAddress,value)=>{
        let USDT = CONTRACT.UsdtContract.methods;
            let _weiSpending = WALLET.web3.utils.toWei(value); //in wei
            let trx = {
                to: CONTRACT.USDT,
                from: WALLET.account,
                gas:"0x4DD0F",
                gasPrice: "0x2CB417800",
                data:USDT.approve(contractAddress,_weiSpending).encodeABI(),
            };
        WALLET.flag= 1;
        WALLET.sendTrx(trx);
        WALLET.verifyUSDAllowance(contractAddress,_weiSpending);
    },
    verifyUSDAllowance:(contractAddress,_weiSpending)=>{
        setTimeout(function(){
            console.error("Did not get response in 15 seconds");
            let interval = setInterval(function(){
                if(WALLET.flag > 0 && WALLET.flag <= 3){
                    WALLET.flag++;
                    let USDT = CONTRACT.UsdtContract.methods;
                    USDT.allowance(WALLET.account,contractAddress).call().then((allowance)=>{
                        if(allowance == _weiSpending){
                            WALLET.flag = 0;
                            clearInterval(interval);
                            notifySuccess('Allowance created & Approved.')
                            notifySuccess('Finalizing transaction.')
                            WALLET.allowance = true;
                            WALLET.allowanceOf = true;
                        }
                    });
                }else{
                    notifyError('Allowance creation failed. Check your balance & Try again.')
                    WALLET.flag = 0;
                    clearInterval(interval);
                    WALLET.allowance = false;

                }
            }, 5000);

        }, 15000);
    },
    buyToken:(trxParam,expectedTokens)=>{
        showBusy()
        WALLET.flag = 1;
        WALLET.sendTrx(trxParam);
        WALLET.checkerBuy(expectedTokens);
    },
    contribute:(trxParam,expectedTokens)=>{
        showBusy()
        WALLET.flag = 1;
        WALLET.sendTrx(trxParam);
        WALLET.checkerBuy(expectedTokens);
    },
    checkerBuy: (expectedTokens)=>{
        setTimeout(function(){
            console.error("Did not get response in 15 seconds");
            let interval = setInterval(function(){
                if(WALLET.flag > 0 && WALLET.flag <= 6){
                    WALLET.checkTransaction(interval,expectedTokens);
                }else{
                    WALLET.flag = 0;
                    clearInterval(interval);
                }
            }, 5000);

        }, 15000);
    },
    checkTransaction: async (interval)=>{
        WALLET.flag++;
        let res = await WALLET.verifyMulaCredit();
        let data = res.data;
         if(data.status == 1){
             let trxs = data.result;
             for (let trx of trxs) {
                if(trx.contractAddress == CONTRACT.TK.toLowerCase()){
                    notifySuccess('Transaction Successful');
                    WALLET.showModal(
                        'TRANSACTION SUCCESSFUL',
                        ' ',
                        'Number Of Tokens : ' + WALLET.web3.utils.fromWei(trx.value) + ' MULA',
                        ' ',
                        trx.hash
                    );
                    stopBusy()
                 clearInterval(interval);

                }

            }
         }
    },
    approveAllowance:async(trxParam,usdSpending)=>{
        WALLET.sendTrx(trxParam);
        WALLET.checkApproval(usdSpending);
    },
    checkApproval:(figure)=>{
        setTimeout(function(){
            console.error("Did not get response in 15 seconds");
            let interval = setInterval(function(){
                if(WALLET.flag > 0 && WALLET.flag <= 3){
                    WALLET.flag++;
                    let usd = new WALLET.web3.eth.Contract(Abi.USDT,CONTRACT_USDT);
                    usd.methods.allowance(WALLET.account,CONTRACT_IDO).call().then((allowance)=>{
                        if(allowance == figure){
                            WALLET.flag = 0;
                            clearInterval(interval);
                            WALLET.USDT_APPROVAL = true;
                        }
                    });
                }else{
                    WALLET.flag = 0;
                    WALLET.USDT_APPROVAL = false;
                    clearInterval(interval);
                }
            }, 5000);

        }, 15000);
    },
    verifyMulaCredit:async ()=>{
        try {
            return await axios.get('/sale/verify/'+WALLET.account+'/credit/' + WALLET.block)
        } catch (error) {
            console.error(error)
        }
        return false;
    },
    setLatestBlock: async ()=>{
        let block = await WALLET.web3.eth.getBlock('latest');
        WALLET.block = block.number;
    },
    showModal:(title,investment,numOfTokens,rate,trxHash)=>{

        $('._title').html(title);
        $('._investment').html(investment);
        $('._numOfTokens').html(numOfTokens);
        $('._rate').html(rate);
        $('._trxHash').html(trxHash);
        var bscScan = "https://testnet.bscscan.com/tx/"+trxHash;
        $('.trx-hash').attr('href', bscScan);

        $('.success-trx').modal('show');
    },
    clipAddress:()=>{

        var textarea = document.createElement("textarea");
        textarea.textContent = WALLET.account;
        textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        notifySuccess('address copied')
    }
}

$(()=>{
    WALLET.init();
});
