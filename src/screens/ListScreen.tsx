import React, { useState, useEffect } from 'react'
import {
  Text,
  Pressable,
  ActivityIndicator,
  View,
  FlatList
} from 'react-native'
import Separator from '../components/Separator'
import {useAccounts, useConnections} from '../providers'

import { Connection, GetProgramAccountsFilter } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"


type Log = {
  mint: string,
  owner: string,
  type: string
}

async function getTokenAccounts(wallet: string | undefined, connection: Connection | undefined) {
  if(!wallet || !connection) return
    const filters:GetProgramAccountsFilter[] = [{ dataSize: 165 }, { memcmp: { offset: 32, bytes: wallet }}]
    const data = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
        {filters: filters}
    )
    return data.map((item, i) => ({
        mint: item.account.data.parsed.info.mint,
        owner: item.account.data.parsed.info.owner,
        type: item.account.data.parsed.type
      }))
}

const ListScreen = ({}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [logs, setLogs] = useState<Log[]>()

  const {selectedAccount} = useAccounts()
  const {connection} = useConnections()
  useEffect(() => {
    setIsLoading(false)
  }, [])

  const onRefresh = async () => {
    setIsRefreshing(true)
    setIsLoading(true)
    const data = await getTokenAccounts(selectedAccount?.publicKey.toString(), connection || undefined)
    console.log(data)
    setIsRefreshing(false)
    setIsLoading(false)
    setLogs(() => data)
  }

  const renderList = ({ item, navigation }:any) => {
    return (
      <Pressable
        onPress={() => navigation.navigate('DetailStack')}
        style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontSize: 18, color: '#000' }}>Mint : {item.mint}</Text>
        <Text style={{ fontSize: 16, color: '#000' }}>Owner : {item.owner}</Text>
      </Pressable>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <ActivityIndicator color="blue" size="large" />
      ) : (
        <>
          <FlatList
            data={logs}
            contentContainerStyle={{
              paddingVertical: 20
            }}
            keyExtractor={(item:any) => item.mint}
            ItemSeparatorComponent={Separator}
            renderItem={renderList}
            onRefresh={onRefresh}
            refreshing={isRefreshing}
          />
        </>
      )}
    </View>
  )
}

export default ListScreen;