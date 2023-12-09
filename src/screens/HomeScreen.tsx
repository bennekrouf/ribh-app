import React, {useLayoutEffect, useState} from 'react'
import {ScrollView, StyleSheet, Text, Alert, Button, View} from 'react-native'
import {connect, useSelector} from 'react-redux'
import {AppStyles} from '../AppStyles'
import {Configuration} from '../Configuration'
import { firebase } from '@react-native-firebase/storage'
import {Section} from '../components';
// import {ConnectionProvider} from '../providers';
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;
import {launchCamera} from 'react-native-image-picker'

import {useAccounts, Account, useConnections} from '../providers'
import spl, { AuthorityType, createMint, createSetAuthorityInstruction, getOrCreateAssociatedTokenAccount, mintTo, createTransferCheckedInstruction } from '@solana/spl-token'
import { Transaction, sendAndConfirmTransaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import Network from '../models/network'

function HomeScreen({navigation}:any) {
  const {selectedAccount} = useAccounts()
  const {connection, selectedNetwork} = useConnections()
  const [token, setToken] = useState<PublicKey>()
  const [tokenAccount, setTokenAccount] = useState<spl.Account>()
  const auth = useSelector((state:any) => state.auth)

  const [isTokenCreation, setIsTokenCreation] = useState(false)
  const [isTokenAccountCreation, setIsTokenAccountCreation] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [isTransactionCreation, setIsTransactionCreation] = useState(false)
  const [isTransactionSending, setIsTransactionSending] = useState(false)
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Mayo',
    })
  }, [])

  const onPressScan = () => {
    if(selectedAccount) {
      setToken(undefined)

      setTokenAccount(undefined)
      setIsTokenAccountCreation(false)
      setIsMinting(false)
      setIsTransactionCreation(false)
      setIsTransactionSending(false)

      setIsTokenCreation(false)
      takePhotoAndSave(undefined)
    } else {
      Alert.alert(`Select an account`)
    }
  }

  const onPressNewEvent = () => {
    if(!selectedAccount) {
      Alert.alert(`Select an account`)
    } else if(!token) {
      Alert.alert(`No token, create an NFT before adding new transactions`)
    } else {
      setIsTransactionCreation(false)
      setIsTransactionSending(false)
      takePhotoAndSave(token)
    }
  }

  const onCreateToken = async(selectedAccount:Account, connection:any, selectedNetwork:Network | undefined) => {
    if(selectedAccount) {
      try {
        console.log('0/4: Token creation start')
        setIsTokenCreation(true)
        const mint = await createMint(
          connection,
          selectedAccount,
          selectedAccount.publicKey,
          selectedAccount.publicKey,
          0
        )
        setToken(() => (mint))

        console.log('Token :')
        console.log(`https://explorer.solana.com/address/${mint.toString()}?cluster=${selectedNetwork?.endpoint}`)

        console.log('1/4: Create token account')
        setIsTokenAccountCreation(true)
        const associatedTokenAccount = await getOrCreateAssociatedTokenAccount(
          connection,
          selectedAccount,
          mint,
          selectedAccount.publicKey
        )
        if(!associatedTokenAccount) return
        setTokenAccount(() => associatedTokenAccount)

        console.log('2/4: Mint NFT')
        setIsMinting(true)
        await mintTo(
          connection,
          selectedAccount,
          mint,
          associatedTokenAccount.address,
          selectedAccount,
          1
        )

        return {
          mint,
          associatedTokenAccount
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      Alert.alert(`Select an account`)
    }
  }

  const addTransaction = async (selectedAccount:Account, connection:any, selectedNetwork:Network | undefined, tokenAddress:PublicKey) => {
    console.log('3/4: Create transaction')
    let transaction = new Transaction()
    .add(createSetAuthorityInstruction(
      tokenAddress,
      selectedAccount.publicKey,
      AuthorityType.MintTokens,
      null
    ))

    try {
      console.log('4/4: Send transaction')
      const tx = await sendAndConfirmTransaction(connection, transaction, [selectedAccount])
      console.log('Transaction :')
      console.log(`https://explorer.solana.com/tx/${tx}?cluster=${selectedNetwork?.endpoint}`)
    
      return tx
    } catch (error) {
        console.log(error)      
    }
  }

  const secondaryStorageBucket = firebase.app().storage('gs://mayo-98893.appspot.com')
  const takePhotoAndSave = async(token: PublicKey | undefined) => {
    if (!selectedAccount) return 
    try {
      const response = await launchCamera({
        mediaType: 'photo',
        // videoQuality: 'medium',
        includeBase64: false
      })

      if (response.didCancel) {
        Alert.alert('User cancelled image picker')
      } else if (response.errorCode) {
        Alert.alert('ImagePicker Error: ', response.errorMessage)
      } else {
        if (!response || !response.assets) return
        const img = response.assets[0]
        const source = { uri: img.uri }
        const fileName = img.fileName;
        let res
        if (!token) { // It means that we call takePhotoAndSave with an existing token 
          res = await onCreateToken(selectedAccount, connection, selectedNetwork)
          token = res?.mint
        }
        if (!token) {
          Alert.alert('Error in token creation')
          return
        }
        const tx = await addTransaction(selectedAccount, connection, selectedNetwork, token)
        const reference = secondaryStorageBucket.ref(`/${auth.user?.email}/${selectedAccount?.id}/${token?.toString()}/${fileName}`)
        reference.putFile(source.uri || '', {customMetadata: {
          tx: tx || 'no-token'
        }}).then((res) => {
          Alert.alert('Transaction created and image uploaded!')
        })
      }
    } catch (error:any) {
      Alert.alert(error.message)
      console.log(error)
    }
  }

  return (
    <ScrollView style={styles.container}>
    <View>
      <Section>
        <Text style={styles.title}></Text>      
        <Text style={styles.title}>Welcome {auth.user?.fullname ?? 'User'}</Text>
      </Section>
      <Section>
        {/* <Text>Create a new one</Text> */}
        <Button
          // containerStyle={styles.buttonContainer}
          // style={styles.buttonText}
          title="Take a photo"
          onPress={() => onPressScan()}
          ></Button>
      </Section>
       <Section>
        {/* <Text>Create a new one</Text> */}
        {/* <Button
          containerStyle={styles.buttonContainer}
          style={styles.buttonText}
          title="Create token"
          onPress={async () => onCreateToken()}
          >
        </Button> */}
      </Section>
      <Section>
      {selectedAccount ? 
        <Text>Selected account: {selectedAccount.name}</Text>:<Text>No account selected</Text>
      }
       </Section>
      <Section>
      </Section>
        {isTokenCreation ? <Text>0/4: Token creation start</Text>:''}
        {isTokenAccountCreation ? <Text>1/4: Create token account</Text>:''}
        {isMinting ? <Text>2/4: Mint NFT</Text>:''}
        {isTransactionCreation ? <Text>3/4: Create transaction</Text>:''}
        {isTransactionSending ? <Text>4/4: Send transaction</Text>:''}
      <Section>
      {token ? <Text>Token: {token.toString()}</Text>: ''}
      {/* {
        token ? 
        <Button
          title="New event on this token"
          onPress={() => onPressNewEvent()}
          ></Button>:<Text></Text>
      } */}
      {/* <Text style={styles.title}>Add information to an item (SCAN)</Text> */}
      {/* <Button
        containerStyle={styles.buttonContainer}
        style={styles.buttonText}
        title="NEW"
        onPress={() => onPressNew()}>
      </Button> */}

      {/* <ConnectionProvider endpoint='http://127.0.0.1:8899'>
        <WalletProvider wallet={wallets} autoconnect>

        </WalletProvider>
      </ConnectionProvider> */}
      </Section>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: AppStyles.buttonWidth.main,
    backgroundColor: AppStyles.color.greenBlue,
    borderRadius: AppStyles.borderRadius.small,
    padding: 50,
    marginTop: 60,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: AppStyles.color.white,
    fontSize: 40
  },
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: Configuration.home.listing_item.offset,
  },
  title: {
    fontWeight: 'bold',
    color: AppStyles.color.title,
    fontSize: 25,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 5,
  },
})

const mapStateToProps = (state:any) => ({
  user: state.auth.user,
})

export default connect(mapStateToProps)(HomeScreen)
