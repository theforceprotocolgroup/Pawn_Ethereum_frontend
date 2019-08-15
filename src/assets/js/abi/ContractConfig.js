const abi = [{
    "constant": false,
    "inputs": [{"name": "borrower", "type": "address"}, {"name": "hash", "type": "bytes32"}, {
        "name": "token",
        "type": "address"
    }],
    "name": "forcerepay",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "borrower", "type": "address"}, {"name": "hash", "type": "bytes32"}, {
        "name": "token",
        "type": "address"
    }],
    "name": "closepstion",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "tokenGet", "type": "address"}, {"name": "amountGet", "type": "uint256"}, {
        "name": "tokenGive",
        "type": "address"
    }, {"name": "amountGive", "type": "uint256"}, {"name": "nonce", "type": "uint256"}, {
        "name": "lendingCycle",
        "type": "uint256"
    }, {"name": "pledgeRate", "type": "uint256"}, {"name": "interestRate", "type": "uint256"}, {
        "name": "feeRate",
        "type": "uint256"
    }],
    "name": "hash",
    "outputs": [{"name": "", "type": "bytes32"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "address"}],
    "name": "tokens",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "feeAccount",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "feeAccount_", "type": "address"}],
    "name": "changeFeeAccount",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "borrower", "type": "address"}, {"name": "hash", "type": "bytes32"}, {
        "name": "token",
        "type": "address"
    }, {"name": "amount", "type": "uint256"}],
    "name": "callmargin",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "borrower", "type": "address"}, {"name": "hash", "type": "bytes32"}],
    "name": "cancelOrder",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "tokenGet", "type": "address"}, {"name": "amountGet", "type": "uint256"}, {
        "name": "tokenGive",
        "type": "address"
    }, {"name": "amountGive", "type": "uint256"}, {"name": "nonce", "type": "uint256"}, {
        "name": "lendingCycle",
        "type": "uint256"
    }, {"name": "pledgeRate", "type": "uint256"}, {"name": "interestRate", "type": "uint256"}, {
        "name": "feeRate",
        "type": "uint256"
    }],
    "name": "borrow",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "admin_", "type": "address"}],
    "name": "changeAdmin",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "", "type": "address"}, {"name": "", "type": "bytes32"}],
    "name": "orderBook",
    "outputs": [{"name": "tx_id", "type": "bytes32"}, {"name": "deadline", "type": "uint256"}, {
        "name": "state",
        "type": "uint8"
    }, {"name": "borrower", "type": "address"}, {"name": "lender", "type": "address"}, {
        "name": "lending_cycle",
        "type": "uint256"
    }, {"name": "token_get", "type": "address"}, {"name": "amount_get", "type": "uint256"}, {
        "name": "token_pledge",
        "type": "address"
    }, {"name": "amount_pledge", "type": "uint256"}, {"name": "_nonce", "type": "uint256"}, {
        "name": "pledge_rate",
        "type": "uint256"
    }, {"name": "interest_rate", "type": "uint256"}, {"name": "fee_rate", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "borrower", "type": "address"}, {"name": "hash", "type": "bytes32"}, {
        "name": "token",
        "type": "address"
    }, {"name": "amount", "type": "uint256"}],
    "name": "repay",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": false,
    "inputs": [{"name": "borrower", "type": "address"}, {"name": "hash", "type": "bytes32"}, {
        "name": "token",
        "type": "address"
    }, {"name": "amount", "type": "uint256"}, {"name": "feeAmount", "type": "uint256"}],
    "name": "lend",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}, {
    "constant": true,
    "inputs": [{"name": "token", "type": "address"}, {"name": "user", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "constant": true,
    "inputs": [],
    "name": "admin",
    "outputs": [{"name": "", "type": "address"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
}, {
    "inputs": [{"name": "admin_", "type": "address"}, {"name": "feeAccount_", "type": "address"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
}, {"payable": true, "stateMutability": "payable", "type": "fallback"}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "tokenGet", "type": "address"}, {
        "indexed": false,
        "name": "amountGet",
        "type": "uint256"
    }, {"indexed": false, "name": "tokenGive", "type": "address"}, {
        "indexed": false,
        "name": "amountGive",
        "type": "uint256"
    }, {"indexed": false, "name": "nonce", "type": "uint256"}, {
        "indexed": false,
        "name": "lendingCycle",
        "type": "uint256"
    }, {"indexed": false, "name": "pledgeRate", "type": "uint256"}, {
        "indexed": false,
        "name": "interestRate",
        "type": "uint256"
    }, {"indexed": false, "name": "feeRate", "type": "uint256"}, {
        "indexed": false,
        "name": "user",
        "type": "address"
    }, {"indexed": false, "name": "hash", "type": "bytes32"}, {"indexed": false, "name": "status", "type": "uint256"}],
    "name": "Borrow",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "borrower", "type": "address"}, {
        "indexed": false,
        "name": "txId",
        "type": "bytes32"
    }, {"indexed": false, "name": "token", "type": "address"}, {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
    }, {"indexed": false, "name": "give", "type": "address"}],
    "name": "Lend",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "borrower", "type": "address"}, {
        "indexed": false,
        "name": "txId",
        "type": "bytes32"
    }, {"indexed": false, "name": "by", "type": "address"}],
    "name": "CancelOrder",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "borrower", "type": "address"}, {
        "indexed": false,
        "name": "txId",
        "type": "bytes32"
    }, {"indexed": false, "name": "token", "type": "address"}, {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
    }, {"indexed": false, "name": "by", "type": "address"}],
    "name": "Callmargin",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "borrower", "type": "address"}, {
        "indexed": false,
        "name": "txId",
        "type": "bytes32"
    }, {"indexed": false, "name": "token", "type": "address"}, {
        "indexed": false,
        "name": "amount",
        "type": "uint256"
    }, {"indexed": false, "name": "by", "type": "address"}],
    "name": "Repay",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "borrower", "type": "address"}, {
        "indexed": false,
        "name": "txId",
        "type": "bytes32"
    }, {"indexed": false, "name": "token", "type": "address"}, {"indexed": false, "name": "by", "type": "address"}],
    "name": "Closepstion",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "borrower", "type": "address"}, {
        "indexed": false,
        "name": "txId",
        "type": "bytes32"
    }, {"indexed": false, "name": "token", "type": "address"}, {"indexed": false, "name": "by", "type": "address"}],
    "name": "Forcerepay",
    "type": "event"
}, {
    "anonymous": false,
    "inputs": [{"indexed": false, "name": "name", "type": "string"}, {
        "indexed": false,
        "name": "error",
        "type": "uint256"
    }],
    "name": "Failure",
    "type": "event"
}];
const contractAddress = "0x462889f9082eb915ac961370a2f13d6a8c949c8d";
export default {
    abi: abi,
    contractAddress: contractAddress
}