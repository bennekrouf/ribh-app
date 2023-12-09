import {useState} from 'react'
import bs58 from 'bs58'
import {Alert, Linking} from 'react-native'

const buildUrl = (path: string, params: URLSearchParams) =>
      `https://phantom.app/ul/v1/${path}?${params.toString()}`

const connect = async (dappKeyPair) => {
    // const params = new URLSearchParams({
    //   dapp_encryption_public_key: bs58.encode(dappKeyPair.public),
    //   cluster: "devnet", // "mainnet-beta",
    //   app_url: "https://phantom.app"
    //   // redirect_link: onConnectRedirectLink,
    // })

    // const url = buildUrl("connect", params)

    // const supported = await Linking.canOpenURL(url)
    // if (supported) {
    //   await Linking.openURL(url)
    // } else {
    //   Alert.alert(`Don't know how to open this URL: ${url}`)
    // }
}

module.exports = {
    connect
}