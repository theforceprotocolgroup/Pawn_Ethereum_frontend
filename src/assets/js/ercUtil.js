import Web3 from 'web3';
import daiToken from './abi/DAIAbi'
import bnbToken from './abi/BNBAbi'
import forToken from './abi/FORAbi'
import htToken from './abi/HTAbi'
import lrcToken from './abi/LRCAbi'
import zrxToken from './abi/ZRXAbi'
import usdtToken from './abi/USDTAbi'

export default {
    getErrorMessage(status) {
        return "status error"
    },
    getTokenAbi(tokenAddress) {
        tokenAddress = tokenAddress.toLowerCase();
        if (tokenAddress === daiToken.contractAddress.toLowerCase()) {
            return daiToken.abi;
        } else if (tokenAddress === bnbToken.contractAddress.toLowerCase()) {
            return bnbToken.abi;
        } else if (tokenAddress === lrcToken.contractAddress.toLowerCase()) {
            return lrcToken.abi;
        } else if (tokenAddress === forToken.contractAddress.toLowerCase()) {
            return forToken.abi;
        } else if (tokenAddress === htToken.contractAddress.toLowerCase()) {
            return htToken.abi;
        } else if (tokenAddress === zrxToken.contractAddress.toLowerCase()) {
            return zrxToken.abi;
        } else if (tokenAddress === usdtToken.contractAddress.toLowerCase()) {
            return usdtToken.abi;
        } else {
            console.log("token not supported:" + tokenAddress)
        }
    },
    toWei(amount) {
        return web3.utils.toWei(amount.toString(), 'wei');
    }
}