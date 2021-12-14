const CONTRACT={
    TK:'0xd54e35617fd299BA2fb3B1526e3EDf2170E37F34',
    SEED:'0x5a720742a89A7eCb87fCEf59064FB08fD44eB0ee',
    IDO:'0x99e27f8D9Dcb7596942C3c054bA09fF6AAB44756',
    IEO:'',
    USDT:'0x337610d27c682e347c9cd60bd4b3b107c9d34ddd',
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
