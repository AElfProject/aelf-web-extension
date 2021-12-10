/**
 * @author hzz780
 * @file crossChain.js
 * 2021.12.10
 * Beijing
 */
import AElf from 'aelf-sdk';
import {CrossChain} from 'aelf-sdk-cross-chain';

export class CrossChainMethodsExtension {
    constructor(options) {
        this.wallet = options.wallet;
        // const CROSS_INFO = {
        //     mainChainId: 9992731,
        //     issueChainId: 9992731, // Token issue chain id
        //     from: {
        //         name: 'AELF',
        //         url: 'https://explorer-test.aelf.io/chain',
        //         id: 9992731,
        //         mainTokenContract: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
        //         crossChainContract: '2SQ9LeGZYSWmfJcYuQkDQxgd3HzwjamAaaL4Tge2eFSXw2cseq'
        //     },
        //     to: {
        //         name: 'tDVV',
        //         url: 'https://tdvv-wallet-test.aelf.io/chain', // provider url
        //         id: 1866392, // chain id
        //         mainTokenContract: '7RzVGiuVWkvL4VfVHdZfQF2Tri3sgLe9U991bohHFfSRZXuGX',
        //         crossChainContract: '2snHc8AMh9QMbCAa7XXmdZZVM5EBZUUPDdLjemwUJkBnL6k8z9'
        //     }
        // };
        this.CROSS_INFO = options.CROSS_INFO;
        this.crossChainInstance = null;
    }

    async crossChainInstanceInit() {
        if (this.crossChainInstance) {
            return this.crossChainInstance;
        }

        const wallet = this.wallet;
        const CROSS_INFO = this.CROSS_INFO;

        const receiveInstance = new AElf(new AElf.providers.HttpProvider(CROSS_INFO.to.url));
        const sendInstance = new AElf(new AElf.providers.HttpProvider(CROSS_INFO.from.url));
        const crossChainInstance = new CrossChain({
            AElfUtils: AElf.utils,
            sendInstance,
            receiveInstance,
            wallet,
            // TODO: use api to getTokenInfo.
            // A good news is that we only support AELF, EPC, EDA, EDB, EDC, EDD to crossChain now.
            mainChainId: CROSS_INFO.mainChainId,
            issueChainId: CROSS_INFO.issueChainId,
            queryLimit: 1
        });

        await crossChainInstance.init({
            contractAddresses: {
                tokenContractAddressSend: CROSS_INFO.from.mainTokenContract,
                crossChainContractAddressSend: CROSS_INFO.from.crossChainContract,
                tokenContractAddressReceive: CROSS_INFO.to.mainTokenContract,
                crossChainContractAddressReceive: CROSS_INFO.to.crossChainContract
            },
            chainIds: {
                chainIdSend: CROSS_INFO.from.name,
                chainIdReceive: CROSS_INFO.to.name
            }
        });
        this.crossChainInstance = crossChainInstance;
        return crossChainInstance;
    }

    // {
    //     transfer: {
    //         to: receiveAddress,
    //         symbol: 'ELF',
    //         amount: 1,
    //         memo: 'to be or not to be.'
    //     },
    //     amountShow: 1 * 10^-8,
    //    // toChain: 'tDVV': // get from transfer to
    // }
    // 业务方需要自行判断是否支持跨链，再调用
    /**
     *
     * @param params {
     *    object: {
     *        to: string,
     *        symbol: string,
     *        amount: number,
     *        memo: string
     *    }
     *  }
     * @return {Promise<*>}
     */
    async send(params) {
        const crossChainInstance = await this.crossChainInstanceInit(params);
        const {
            crossTransferTxId
        } = await crossChainInstance.send(params);

        console.log('crossTransferTxId: ', crossTransferTxId);

        return crossTransferTxId;
    }

    // {
    //     crossTransferTxId,
    //     transfer: {
    //         to: receiveAddress,
    //         symbol: 'ELF',
    //         amount: 1,
    //         memo: 'to be or not to be.'
    //     },
    //     fromChain: 'AELF':
    // }
    // TODO: Error of Cross SDK; throw Error but not return error:1
    // config: 1.address send the cross transfer, 2.primary token info
    /**
     * @param params {object: {crossTransferTxId: string}}
     * @return {Promise<*>}
     */
    async receive(params) {
        const isReadyToRecevie = await this.isChainReadyToReceive(params);

        if (isReadyToRecevie.error) {
            console.log('isReadyToRecevie error: ', isReadyToRecevie);
            throw Error(isReadyToRecevie.message);
        }

        const crossChainInstance = await this.crossChainInstanceInit(params);
        const {crossTransferTxId} = params;
        console.log('crossTransferTxId: ', crossTransferTxId);
        const receiveInfo = await crossChainInstance.receive({
            // crossTransferTxId: 'f0263bb88a2fb392b174abb548432fa1dc8e8f8193b6b44841b9f048cecb414a'
            crossTransferTxId
        });
        if (receiveInfo.error) {
            console.log('receiveInfo error: ', receiveInfo);
            throw Error(receiveInfo.message);
        }
        return receiveInfo;
    }

    // TODO use api at first
    // http://127.0.0.1:7000/api/cross-chain/is-ready-to-receive?
    // send=http://54.199.254.157:8000
    // &receive=http://3.112.250.87:8000
    // &main_chain_id=9992731&issue_chain_id=9992731
    // &cross_transfer_tx_id=841988ce167d5c6ae6a791c0113ef95dd57840b32275e5854a056af40eb13608
    /**
     *
     * @param params {object: {crossTransferTxId: string}}
     * @return {Promise<*>}
     */
    async isChainReadyToReceive(params) {
        const crossChainInstance = await this.crossChainInstanceInit(params);
        const {crossTransferTxId} = params;
        console.log('crossTransferTxId isChainReadyToReceive', crossTransferTxId);
        return await crossChainInstance.isChainReadyToReceive({
            crossTransferTxId
            // crossTransferTxId: '688f6386a66fae9e6994a1a8e49ff2e22534c159ed91787ad120d6179c2e35cb'
        });
    }
}
