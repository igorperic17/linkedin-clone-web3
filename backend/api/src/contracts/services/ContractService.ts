import { Injectable } from '@nestjs/common';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import {
  GasPrice,
} from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stringToPath } from '@cosmjs/crypto';
import { MyProjectClient } from '../generated/MyProject.client';

@Injectable()
export class ContractsService {
  constructor() {}

  async test() {
    const coreumAccountPrefix = 'testcore'; // the address prefix (different for different chains/environments)
    const coreumHDPath = "m/44'/990'/0'/0/0"; // coreum HD path (same for all chains/environments)
    const coreumDenom = 'utestcore'; // core denom (different for different chains/environments)
    const coreumRpcEndpoint = 'https://full-node.testnet-1.coreum.dev:26657'; // rpc endpoint (different for different chains/environments)
    const senderMnemonic =
      'salon artist proud evil misery young total grit nephew pulse hungry identify wage sunny another action board stove stem glide must squirrel tag master'; // put mnemonic here

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

    const client = new MyProjectClient(
      senderClient,
      sender.address,
      'testcore1vhmj54h6dcttmlstnqcwmfxy0cwjh3k05wr852l3a76fgn300s0seefzf2', // TODO - move to config!
    );
    console.log('trying to executre from', sender.address);
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
}
