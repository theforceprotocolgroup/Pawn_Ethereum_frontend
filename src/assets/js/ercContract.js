import Web3 from 'web3';
import config from './abi/ContractConfig'
import service from './commonService';
import util from './ercUtil';
import '../../components/Toast/Toast.js';

export default {
    ercStake: {
        contract: null,
        tokenContract: null,
        orderHash: null,
        failureStatus: null,
        init() {
            if (typeof web3 !== 'undefined') {
                web3 = new Web3(Web3.givenProvider);
                if (window.ethereum.isMetaMask) {
                    let _this = this;
                    window.ethereum.enable().then(function (accounts) {
                        _this.contract = new web3.eth.Contract(config.abi, config.contractAddress);
                        _this.contract.events.Failure(function (err, event) {
                            if (err) {
                                console.log(err);
                                return;
                            }
                        });
                    }).catch(function (error) {
                        window.error(error.message); //Error: User denied account authorization
                    });
                } else {
                    window.error("please connect to MetaMask!");
                }
            } else {
                window.error("MetaMask is not installed!");
            }
        },
        waitBlockConfirmation: function (n) {
            if (!n) n = 1;
            return new Promise(async function (resolve) {
                let receiptBlockNumber = await web3.eth.getBlockNumber();
                while (true) {
                    await new Promise(function (r) {
                        setTimeout(r, 1000);
                    });
                    let blockNumber = await web3.eth.getBlockNumber();
                    if (blockNumber - receiptBlockNumber >= n) {
                        break;
                    }
                }
                resolve();
            });
        },
        checkBalance: async function (tokenAddress, fromAddress_) {
            let tokenContract = new web3.eth.Contract(util.getTokenAbi(tokenAddress), tokenAddress);
            return new Promise(function (resolve, reject) {
                tokenContract.methods.balanceOf(fromAddress_).call().then((num) => {
                    resolve(web3.utils.hexToNumberString(num));
                }).catch(function (err) {
                    resolve(0);
                });
            });

        },
        checkAllowance: async function (tokenAddress, fromAddress_, needAmount) {
            this.tokenContract = new web3.eth.Contract(util.getTokenAbi(tokenAddress), tokenAddress);
            return await this.tokenContract.methods.allowance(fromAddress_, config.contractAddress).call().then((num) => {
                num = web3.utils.hexToNumberString(num);
                console.log("需要" + needAmount, "当前" + num);
                return parseInt(needAmount) <= parseInt(num);
            });
        },
        approve: async function (tokenAddress, fromAddress_, needAmount, loading, ending) {

            if (!loading) {
                loading = function (transactionHash) {
                }
            }

            if (!ending) {
                ending = function (err, success) {
                }
            }

            this.tokenContract = new web3.eth.Contract(util.getTokenAbi(tokenAddress), tokenAddress);

            let allowance = await this.tokenContract.methods.allowance(fromAddress_, config.contractAddress).call();

            allowance = web3.utils.hexToNumberString(allowance);

            if (parseInt(allowance) >= needAmount) {
                ending(null, true);
                return;
            }
            let _this = this;
            this.tokenContract.methods.approve(config.contractAddress, needAmount).send({
                from: fromAddress_
            }, function (transactionHash) {
                loading(transactionHash);
            })
                .then(async function (receipt) {
                    console.log("contract.methods.approve.receipt: ", receipt);
                    if (receipt.status) {
                        await _this.waitBlockConfirmation();
                        ending(null, true);
                    }
                }).catch(function (err) {
                console.log("Approve error:", err);
                ending(err, false);
            });
        },
        borrow_: async function (loan_address, loan_amount, mortgage_address, mortgage_amount, lending_cycle, mortgage_rate, interest_rate, fee_rate) {
            let fromAddress_ = window.ethereum.selectedAddress;
            if (!fromAddress_) {
                window.error("please connect to MetaMask!");
                return;
            }
            let currentNonce_ = await web3.eth.getTransactionCount(fromAddress_);
            let data = {
                tokenGet: loan_address,
                amountGet: util.toWei(loan_amount),
                tokenGive: mortgage_address,
                amountGive: util.toWei(mortgage_amount),
                nonce: currentNonce_,
                lendingCycle: lending_cycle,
                pledgeRate: mortgage_rate,
                interestRate: interest_rate,
                feeRate: fee_rate
            };
            this.orderHash = await this.contract.methods.hash(data.tokenGet, data.amountGet, data.tokenGive, data.amountGive,
                data.nonce, data.lendingCycle, data.pledgeRate, data.interestRate, data.feeRate).call();

            let _this = this;
            return new Promise(function (resolve, reject) {
                _this.contract.methods.borrow(data.tokenGet, data.amountGet, data.tokenGive, data.amountGive,
                    data.nonce, data.lendingCycle, data.pledgeRate, data.interestRate, data.feeRate)
                    .send({
                        from: fromAddress_
                    })
                    .then(async function (receipt) {
                        receipt.borrowContext = {};

                        if (receipt.status) {
                            await _this.waitBlockConfirmation();
                            receipt.borrowContext.orderHash = _this.orderHash;
                            receipt.borrowContext.nonce = data.nonce;
                            resolve(receipt);
                        }
                    })
                    .catch(function (error) {
                        reject(error);
                    });
            });
        },

        lend_: async function (borrower, hash, token, feeAmount, totalAmount) {
            let fromAddress_ = window.ethereum.selectedAddress;
            if (!fromAddress_) {
                window.error("Please login in MetaMask!");
                return;
            }
            if (borrower === fromAddress_) {
                window.error("Not allowed to lend to yourself!");
                return
            }
            const data = {
                borrower: borrower,
                hash: hash,
                tokenAddress: token,
                feeAmount: util.toWei(feeAmount),
                totalAmount: util.toWei(totalAmount)
            };

            let _this = this;
            return new Promise(function (resolve, reject) {
                _this.contract.methods.lend(
                    data.borrower, data.hash, data.tokenAddress, data.totalAmount, data.feeAmount)
                    .send({
                        from: fromAddress_
                    })
                    .then(async function (receipt) {
                        console.log("contract.methods.lend.receipt: ", receipt);
                        if (receipt.status) {
                            await _this.waitBlockConfirmation();
                            resolve(receipt);
                        }
                    }).catch(function (error) {
                    reject(error);
                });
            });
        },
        cancelorder: function (order_id, hash) {
            let fromAddress_ = window.ethereum.selectedAddress;
            if (!fromAddress_) {
                window.error("please connect to MetaMask!");
                return;
            }
            console.log(fromAddress_)
            console.log(hash)

            let _this = this;
            this.contract.methods.cancelOrder(fromAddress_, hash)
                .send({
                    from: fromAddress_
                })
                .then(async function (receipt) {
                    console.log("contract.methods.CancelOrder.receipt: ", receipt);
                    if (receipt.status) {
                        await _this.waitBlockConfirmation();

                        let respHash = receipt.events.CancelOrder.returnValues.txId;
                        let txHash = receipt.transactionHash;
                        let respBorrower = receipt.events.CancelOrder.returnValues.borrower;

                        console.log("cancelOrder respHash: ", respHash);
                        console.log("cancelOrder txHash: ", txHash);
                        console.log("cancelOrder respBorrower: ", respBorrower);

                        if (respHash === hash && fromAddress_.toLowerCase() === respBorrower.toLowerCase()) {
                            window.success('success');
                            service.canceled({
                                txId: txHash,
                                orderNumber: order_id,
                                account: fromAddress_
                            }).then(rep => {
                                if (rep.status === 200) {
                                    window.location.href = '/#/order?list=' + order_id;
                                } else {
                                    window.error(rep.msg);
                                }
                            });
                        }
                    }
                }).catch(function (error) {
                window.error("call contract failed");
            });
        },
        repay: async function (borrower, hash, token, amount, order_id) {
            let fromAddress_ = window.ethereum.selectedAddress;
            if (!fromAddress_) {
                window.error("please connect to MetaMask!");
                return;
            }
            const data = {
                borrower: borrower,
                hash: hash,
                tokenAddress: token,
                amount: util.toWei(amount)
            };
            let _this = this;
            return new Promise(function (resolve, reject) {
                _this.contract.methods.repay(
                    data.borrower, data.hash, data.tokenAddress, data.amount)
                    .send({
                        from: fromAddress_
                    }).then(async function (receipt) {
                    console.log("contract.methods.lend.receipt: ", receipt);
                    if (receipt.status) {
                        await _this.waitBlockConfirmation();
                        resolve(receipt);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            });
        },
        callMargin: async function (borrower, hash, token, amount) {
            let fromAddress_ = window.ethereum.selectedAddress;
            if (!fromAddress_) {
                window.error("please connect to MetaMask!");
                return;
            }
            const data = {
                borrower: borrower,
                hash: hash,
                tokenAddress: token,
                amount: util.toWei(amount)
            };
            let _this = this;
            return new Promise(function (resolve, reject) {
                _this.contract.methods.callmargin(
                    data.borrower, data.hash, data.tokenAddress, data.amount)
                    .send({
                        from: fromAddress_
                    }).then(async function (receipt) {
                    console.log("contract.methods.lend.receipt: ", receipt);
                    if (receipt.status) {
                        await _this.waitBlockConfirmation();
                        resolve(receipt);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            });
        }
    }
}