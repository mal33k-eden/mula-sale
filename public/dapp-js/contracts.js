const CONTRACT={
    TK:'0xd54e35617fd299BA2fb3B1526e3EDf2170E37F34',
    SEED:'0xF4C408BEDf9cb93D51E9057bD60d414a57f11514',
    IDO:'0x99e27f8D9Dcb7596942C3c054bA09fF6AAB44756',
    IEO:'',
    USDT:'0x55d398326f99059fF775485246999027B3197955',
    init:()=>{
        CONTRACT.Token      = new WALLET.web3.eth.Contract(Abi.TK,CONTRACT.TK);
        CONTRACT.SeedRound  = new WALLET.web3.eth.Contract(Abi.SR,CONTRACT.SEED);
        CONTRACT.IdoRound        = new WALLET.web3.eth.Contract(Abi.IEO,CONTRACT.IDO);
        // WALLET.contracts.MulaIEO = new App.web3.eth.Contract(Abi.IEO,ADDRESS_IEO);
        CONTRACT.UsdtContract  = new WALLET.web3.eth.Contract(Abi.USDT,CONTRACT.USDT);
    }
}

$(()=>{
   CONTRACT.init()
})
