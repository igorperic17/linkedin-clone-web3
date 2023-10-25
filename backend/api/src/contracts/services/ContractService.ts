import { Injectable } from '@nestjs/common';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { GasPrice } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stringToPath } from '@cosmjs/crypto';
import { MyProjectClient } from '../generated/MyProject.client';
import { CredentialEnum } from '../generated/MyProject.types';

export const CONTRACT_ADDRESS =
  'testcore10uguy40xuhw43cwecpgl8j898es58qlazvmg5z3ds9x5x6xu8srq7nqpsy';

const coreumAccountPrefix = 'testcore'; // the address prefix (different for different chains/environments)
const coreumHDPath = "m/44'/990'/0'/0/0"; // coreum HD path (same for all chains/environments)
const coreumDenom = 'utestcore'; // core denom (different for different chains/environments)
const coreumRpcEndpoint = 'https://full-node.testnet-1.coreum.dev:26657'; // rpc endpoint (different for different chains/environments)
const senderMnemonic =
  'wall document federal spatial fun banana spell horn actor video rabbit sign detect goddess card comic enough manual guide sketch nice cup salad rare'; // put mnemonic here

@Injectable()
export class ContractsService {
  constructor() {}

  async storeVc(credential: CredentialEnum) {
    const client = await this.getClient();
    const executeResult = await client.issueCredential(
      { credential },
      {
        amount: [{ denom: coreumDenom, amount: '100000' }],
        gas: '1000000',
      },
      'issue VC',
      [{ denom: coreumDenom, amount: '100' }], // TODO - remove fee?
    );
    console.log(executeResult);
  }

  async test() {
    const client = await this.getClient();
    const executeResult = await client.register(
      {
        did: 'value',
        username: 'value',
        bio: 'tururu',
      },
      'auto',
      'Registration',
      [{ denom: coreumDenom, amount: '100' }],
    );
    console.log(executeResult);
  }

  private async getClient() {
    console.log('preparing sender wallet');
    const senderWallet = await DirectSecp256k1HdWallet.fromMnemonic(
      senderMnemonic,
      {
        prefix: coreumAccountPrefix,
        hdPaths: [stringToPath(coreumHDPath)],
      },
    );
    const [sender] = await senderWallet.getAccounts();
    console.log(`sender address: ${sender.address}`);

    const senderClient = await SigningCosmWasmClient.connectWithSigner(
      coreumRpcEndpoint,
      senderWallet,
      { gasPrice: GasPrice.fromString('0.0625utestcore') },
    );

    return new MyProjectClient(senderClient, sender.address, CONTRACT_ADDRESS);
  }
}
