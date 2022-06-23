# Getting Started

Run the development server:

```bash
$ yarn

$ yarn dev
```

# Prepare Environment

## Chat Messaging

Rgister and create Messaging App in [GetStream](https://getstream.io).

You can easily get `API_KEY` and `SECRET_KEY`.

Then, you can find the owner account(will create channels and manage members) in [Users Page](https://dashboard.getstream.io/app/1194471/chat/explorer?path=users).

It will be used for realtime chat frame.

## Firebase

Rgister and create Web App in [Firebase](https://console.firebase.google.com/).

Select the development mode and allow all rules for now (change it to production mode when deploying the app).

You can find the firebase config in project setting.

It will be used for storing profile data and access token to messaging app.

## Infura

Rgister and create the project in [Infura](https://infura.io/).

You can find the `INFURA_KEY` in project setting.

It will be used for connecting wallet module.

## Alchemy

Register and create the project in [Alchemy](https://alchemy.com/).

You can find the `API_KEY` and `PROVIDER_RUL` in project setting.

For testing, please select the network `Rinkey` and get the proper `API_KEY` and `PROVIDER_RUL`.

When deploying production, you can easily change it to `Mainnet` based payment plan you selected.

It will be used for checking if the current account holds the specific NFT or not.

## ENV Variables

Now that you can initialize the `env` variables.

Copy `env.template` and paste as `.env.local`.

Fill in all variables with the exact values you got so far.

The following ones are sample `.env` file content(**Devis** made).

You can easily initialize `.env` with the following content for taking a look app working.

```bash
NEXT_PUBLIC_INFURA_KEY=ef788e3273ca47ea9a479ee7939a6eb1
NEXT_PUBLIC_CHAIN_ID=4
NEXT_PUBLIC_ALCHEMY_API_KEY=MlDC2ikcsZRhEk3hGiiyvusCQ-Gao2L6
NEXT_PUBLIC_ALCHEMY_API_ETH_PROVIDER_URL=https://eth-rinkeby.alchemyapi.io/v2
NEXT_PUBLIC_FIREBASE_apiKey=AIzaSyAOqR_sqXuSRx_oL92SttoCipn8jFN7tHc
NEXT_PUBLIC_FIREBASE_authDomain=op3n-6564b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_projectId=op3n-6564b
NEXT_PUBLIC_FIREBASE_storageBucket=op3n-6564b.appspot.com
NEXT_PUBLIC_FIREBASE_messagingSenderId=93827044415
NEXT_PUBLIC_FIREBASE_appId=1:93827044415:web:5198a810a03321af3b948a
NEXT_PUBLIC_FIREBASE_measurementId=G-HXGBDW4VS2
NEXT_PUBLIC_GETSTREAM_API_KEY=n9dksv9cukbn
NEXT_PUBLIC_GETSTREAM_API_SECRECT_KEY=rtqx3grredknseqnq7da4wduzqygrpb6e6vs44r2p36sas7fka29x3bvx94p9dtf
NEXT_PUBLIC_GETSTREAM_OWNER_ID=spreadmycode
```

# Usage

## Create Account

The first time you visit the site, it will make you `Connect Wallet`.

Then, it will require create the profile.

It requires `avatar`, `userId` and `userName`.

The created profile will represent you in chatroom, you know, this profile will be chatroom account.

Right after submitting `Save` button, it will store your profile on firestore as well as calling the server side API to create the token(access token to messaging app).

This token will be also stored on firestore according to your connected wallet address.

Your unique id is your wallet address in firestore, on the other hand, your typed id will be your identifier in messaging app.

Of courase, website will check typed id is duplicated or is already taken by other users.

## Register Collection

It means that you register collection.

At the same time, you will create the channel which allows only your collection NFT holders get in.

Right after clicking `Register Collection`, it will show modal to type `Contract Address` and `Collection Name`.

Of course, website will check `Contract Address` is vaild or not.

Also it will check `Collection Name` is unique or is already taken by other collections.

Because this `Collection Name` will be name of your channel as well as identifier of your channel.

## Get in Channel

Right after registering channel, you can see your channel if you hold the specific NFT in your wallet now.

If not, you can't see any channels.

**Devis** already created two channels according to ERC721A and ERC1155 contracts he made for `AsyncPlayground`.

You can purchase the NFT in [Playground](https://asyncplayground.vercel.app/).

ERC1155 is public sale now and ERC721A requires whitelist due to be a pre-sale.

After purchasing the NFT, please refresh the website then you can find the specific channel according to purchased NFT's collection.

Let's Enjoy.