import {Cluster} from '@solana/web3.js';

export interface Network {
  id: string;
  name: string;
  endpoint: Cluster;
}

export default Network