# Summary

- [About](#about)
- [Features](#features)
- [Tech Stack](#stack)
- [Installation](#install)
- [Scenarios](#scenarios)
	* [Creating ERC20 Token](#creating-token) 
	* [Creating IDO](#creating-ido)
	* [Sending Project Token To Sale Contract](#sending-token-to-sale)
	* [Participate IDO](#participate)
- [Payment Token](#payment-token)
- [TODO](#todo)
- [Contact Me](#contact-me)


<a id = 'about' />

## About
This application is a public launchpad where anyone can create their ERC20 token, and raise their project in a decentralized way. Or participate in other sales with an official payment token which can be requested every 10 minutes. 

<a id = 'features' />

## Features
- Create your ERC20 token with a name , symbol and total supply.
- Participate other sales.
- Create your sale with desired parameters
-  Keep track of all the sales and tokens which is created by the user. 
- See all participated sales on one page.
- All the payments in Payment Token (contract), can request 10 PTK only after 10 minutes.
- No backend, fully decentralized. Query blockchain for sale owner and sale informations
- Minimum participate amount  : 1 PTK
- Maximum participate amount : 10 PTK

<a id = 'stack' />

## Stack

- Solidity 
- React.js
- web3.js
- Ganache-cli
- Truffle


<a id ='install'/>

## Installation

#### Install Truffle 
```
npm install -g truffle
```
### Install Ganache-cli
```
npm install -g ganache-cli
```

### Start Ganache-cli with networkId 1337
```
ganache-cli --networkId 1337
```

### Clone this repository
```
git clone https://github.com/BeratOz01/sample-ido-factory
```

### Install Dependencies
```
cd sample-ido-factory
npm install
```

### Compile & Migrate Contract
```
truffle compile 
truffle migrate --reset --network development
```

### Client 
```
cd client
npm install 
npm run start
```

* You need to connect localhost:8545 and import accounts from ganache-cli with private keys for send transaction. 


<a id = 'scenarios' />

## Scenarios

<a id = 'creating-token'/>

### Creating ERC20 Token 
* User can create ERC20 tokens by not exceeding a total of 5 created tokens.
* This tokens can be sold in sales. But cannot be used as payment token. For payment token check <a id ='payment_token'>here</a>.
*   As seen in the image below, user needs to enter,
	*	name ,
	*	symbol,
	*	total supply of the token.
* After this generation, token contract will mint all of the tokens to the owner so the owner can send this project tokens to a related sale for distribution. Also, users can see information about tokens on the Portfolio page, 'Created Tokens' section.

* User can create token from this 'Create Your IDO' tab. ![tokenCreation](https://user-images.githubusercontent.com/77115599/167294787-00ee83ab-f322-4c2a-acab-bc1ca6f582bf.png)
* Token Creation Modal
<img src= 'https://user-images.githubusercontent.com/77115599/167294873-33f19353-a19d-446b-914f-685e94cadeef.png'/>



<a id = 'creating-ido'/>

### Creating IDO
* User can create their own IDO sale from 'Create Your IDO' tab.
* User needs to enter
	* name of sale
	* For vesting
		* Number Of Portions
		* Time Between Portions (in seconds)
		* Price of token in Payment Token (wei)
		* Project Token
			* Project token can be selected in 3 way,
				* First way, user can enter any ERC20 token address can be created outside of the applications.
				* Second way, user can use sample project token without creating.
				* Third way, user can select project token from created tokens which is described above.
* After creation, sale will be on the home page and portfolio page in My Sales sections.
* On the Home page, sales will appear by assigning a picture depending on the index of sales.

Sample Created Sale
![sample_created_sale](https://user-images.githubusercontent.com/77115599/167295298-6087faa6-54d8-4be9-b91c-d74ef3997cdd.png)

<a id = 'sending-token-to-sale' />

### Sending Project Token To Sale
* After creating ERC20 token and Sale contract. These contracts information will take place on Portfolio Page in related sections. 
* If user create ERC20 token from this application, these created tokens will be in Portfolio. 

***Sample***
![sample_created_tokens](https://user-images.githubusercontent.com/77115599/167295414-68b3f1c8-dc6b-4d11-97ad-e4c70d7bba15.png)

* After creating sale user has to send enough amount of project token to sale contract. Otherwise sale contract will throw an error. So in 'Created Tokens' section. Users can send project tokens to related sale contracts. 

***Token Send Modal***
![Screen Shot 2022-05-08 at 15 10 54](https://user-images.githubusercontent.com/77115599/167295519-9ee058b9-d7a1-4636-9fc6-6bc7fc7aedde.png)
* Application will show contracts where the selected token is the project token.


<a id = 'participate' />

### Participate IDO
* After sending enough project token to sale contract anyone can participate our IDO, if there is enough amount of project token inside sale contract.
* User must has [Payment Token](#payment-token) to participate IDO.

***Sale Details***
![Screen Shot 2022-05-08 at 15 19 17](https://user-images.githubusercontent.com/77115599/167295814-87c9e99a-e13d-40a0-a3a6-8228dd465853.png)

* After user enter desired amount of Payment Token to input.
* Buy Modal will pop-up and buyer need to approve enough amount of payment token to sale contract. Then buy  project token

***Buy Modal***

![buy-modal](https://user-images.githubusercontent.com/77115599/167295889-01e21175-65e8-4273-8796-b4f7b7ba5fd2.png)

*   After purchasing and closing buy modal , the page will refresh itself and vesting table will pop-up. If there is a portion that can be withdraw , withdraw button will be active. And update table information after withdraw transaction.

***Vesting Table***
![vesting-table](https://user-images.githubusercontent.com/77115599/167296113-5af2f966-caf6-4ba8-ba0b-aa7202383bd3.png)
* When user participate IDO, this table and more information will take place in 'Portfolio' page, in 'Participated Sales'. 

***Portfolio - Participated Sales***
![Screen Shot 2022-05-08 at 15 32 20](https://user-images.githubusercontent.com/77115599/167296263-843ade7f-68fa-46ab-9db6-6135d846be7d.png)

*** Portfolio - Participated Sales After Withdraw***
![Screen Shot 2022-05-08 at 15 33 07](https://user-images.githubusercontent.com/77115599/167296284-43404d90-fec9-4584-af4b-dd6a7f0deb94.png)




	






<a id = 'payment-token'/>

## Payment Token
- There will be one official Payment Token for all Launchpad.
- Users can request this Payment Token from Home page.
![Screen Shot 2022-05-08 at 15 36 20](https://user-images.githubusercontent.com/77115599/167296428-5eb3c0ac-be56-4474-abcb-3950136149e9.png)
- But every address can request payment token in every 10 minutes.
- [Token Contract]('https://google.com.tr')



<a id = 'todo' />

## TODO
* Responsive UI
* Better error handling


<a id = 'contract-me/>

### Contact Me
<p align="center">
<a href="https://www.linkedin.com/in/beratozturk/" target="_blank" >
  <img alt="Linkedin" src="https://img.shields.io/badge/Linkedin--%23F8952D?style=social&logo=linkedin">
</a>
<a href="mailto:mehmetberatozturk@outlook.com" target="_blank" >
  <img alt="Email" src="https://img.shields.io/badge/Email--%23F8952D?style=social&logo=gmail">
</a> 
</p>
