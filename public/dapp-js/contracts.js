const CONTRACT={
    TK:'0x9fC4d9f4B469fb0dF85A476409e6D6aEe31CfeAA',
    SEED:'0x43555eb2a516162F29946Be188CA4D8E656E9425',
    IDO:'0x98589f7251d2A94D0A81013cb8d88292c89E3FC6',
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