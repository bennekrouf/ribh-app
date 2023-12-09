import {Cluster, clusterApiUrl, Connection} from '@solana/web3.js';
import React, {ReactNode, useEffect, useState} from 'react';
import Network from '../models/network';
import ConnectionProviderContext from '../models/connectionProviderContext';

const networks: Network[] = [
  {id: 'devnet', name: 'Devnet', endpoint: 'devnet'},
  {id: 'mainnet-beta', name: 'Mainnet Beta', endpoint: 'mainnet-beta'},
  {id: 'testnet', name: 'Testnet', endpoint: 'testnet'},
];

const ConnectionsContext = React.createContext<ConnectionProviderContext>({
  networks,
  selectNetwork(n: Network) {},
});

function ConnectionProvider(props: {children: ReactNode}) {
  const {children} = props;
  const [selectedNetwork, setSelectedNetwork] = useState<Network>(networks[0]);
  const [networkError, setNetworkError] = useState<any>();
  const [networkVersion, setNetworkVersion] = useState<any>();

  const [connection, setConnection] = useState<Connection | null>();

  useEffect(() => {
    if (!connection && selectedNetwork) {
      selectNetwork(selectedNetwork);
      return;
    }
    if (connection) {
      connection
        .getVersion()
        .then(r => setNetworkVersion(r))
        .catch(e => setNetworkError(e.message ? e.message : JSON.stringify(e)));
    }
  }, [connection, setNetworkError, setNetworkVersion]);

  const selectNetwork = (network: Network) => {
    console.log(`Select Network: ${network?.name}`);
    setNetworkError('');
    setNetworkVersion('');
    setSelectedNetwork(network);
    setConnection(() => new Connection(clusterApiUrl(network.endpoint)));
  };

  const value = {
    connection,
    networkError,
    networkVersion,
    networks,
    selectedNetwork,
    selectNetwork,
  };
  return (
    <ConnectionsContext.Provider value={value}>
      {children}
    </ConnectionsContext.Provider>
  );
}

const useConnections = () => {
  return React.useContext(ConnectionsContext)
};

export {ConnectionProvider, useConnections};
