import {Connection} from '@solana/web3.js';
import Network from './network';

export interface ConnectionProviderContext {
  connection?: Connection | null;
  networkError?: any;
  networkVersion?: {'feature-set': number; 'solana-core': string};
  networks: Network[];
  selectedNetwork?: Network;
  selectNetwork: (network: Network) => void;
}

export default ConnectionProviderContext