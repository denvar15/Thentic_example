import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from '@chakra-ui/react';
import {
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from '@chakra-ui/react'
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import { MdCheckCircle, MdSettings } from 'react-icons/all';
import { Button, ButtonGroup } from '@chakra-ui/react'
import { Divider } from '@chakra-ui/react'
import * as axios from 'axios';
import { Input } from '@chakra-ui/react'

let arr = ["firstContract", "secondContract", "thirdContract"];
let arr_short = ["F", "S", "T"];

const App = () => {
  let [deployedFirst, setDeployedFirst] = useState(0);
  let [deployedSecond, setDeployedSecond] = useState(0);
  let [deployedThird, setDeployedThird] = useState(0);
  let [link, setLink] = useState('No link, press deploy/mint and then click to deploy/mint');
  let [contracts, setContracts] = useState([]);
  let [nfts, setNFTs] = useState([]);
  let [wallet, setWallet] = useState("0xe45Ba4475C256d713B6A20C7d2552D3793e37854")

  const fecthContracts = () => {
    axios.get("https://thentic.tech/api/contracts", {params: {
        key: 'vbgr1DYbGwkynwx8vjNuOqwXzAdD3WMw',
        chain_id: '4'
      }}).then((res) => {
      setContracts(res.data.contracts)
      console.log(res)
    })
  }

  const showNFTs = () => {
    axios.get("https://thentic.tech/api/nfts", {params: {
        key: 'vbgr1DYbGwkynwx8vjNuOqwXzAdD3WMw',
        chain_id: '4'
      }}).then((res) => {
      setNFTs(res.data.nfts)
      console.log("NFTs", res)
    })
  }

  const deploy = (numb) => {
      axios.post('https://thentic.tech/api/nfts/contract', {
        key: 'vbgr1DYbGwkynwx8vjNuOqwXzAdD3WMw',
        chain_id: '4',
        name: arr[numb-1],
        short_name: arr_short[numb-1],
      })
        .then(function (response) {
          setLink(response.data.transaction_url)
          if (numb === 1) {
            setDeployedFirst(1)
          } else if (numb === 2) {
            setDeployedSecond(1)
          } else {
            setDeployedThird(1)
          }
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  const mintNFT = () => {
    let res = []
    for (let i = 0; i < contracts.length; i++) {
      if (contracts[i].contract) {
        res.push(contracts[i].contract)
      }
    }
    let elem = res[Math.round(Math.random() * res.length)]
    console.log(elem, res)
    axios.post('https://thentic.tech/api/nfts/mint', {
      key: 'vbgr1DYbGwkynwx8vjNuOqwXzAdD3WMw',
      chain_id: '4',
      contract: elem,
      nft_id: 0,
      nft_data: JSON.stringify({
        description: "It's actually a bison?",
        external_url: "https://austingriffith.com/portfolio/paintings/", // <-- this can link to a page for the specific file too
        image: "https://sun9-85.userapi.com/s/v1/if1/sIZa6xkZqOYGxZ9hsBGl7F7ybidrMOJRapgweYYjZWJKBUxl4Ddcw4tubcRXza9rWgsexfSy.jpg?size=450x447&quality=96&type=album",
        name: "Buffalo",
        attributes: [
          {
            trait_type: "BackgroundColor",
            value: "green",
          },
          {
            trait_type: "Eyes",
            value: "googly",
          },
          {
            trait_type: "Stamina",
            value: 42,
          },
        ],
      }),
      to: wallet
    })
      .then(function (response) {
        setLink(response.data.transaction_url)
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={8}>
            <Text>
              Thentic <Code fontSize="xl">API</Code> example
            </Text>

            <Link
              color="teal.500"
              href={link}
              fontSize="2xl"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link}
            </Link>
            <Input placeholder='Your wallet' />
            <Button colorScheme='blue' onClick={setWallet.bind(this)}>Set wallet</Button>
            <Button colorScheme='blue' onClick={fecthContracts.bind(this)}>Fetch contracts</Button>
            <Button colorScheme='blue' onClick={showNFTs.bind(this)}>Show NFTs</Button>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                <Button colorScheme='green' onClick={deploy.bind(this, 1)}>Deploy first contract</Button>
                <Text as='b' style={{marginLeft:10}}>
                  {deployedFirst}
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                <Button colorScheme='green' onClick={deploy.bind(this, 2)}>Deploy second contract</Button>
                <Text as='b' style={{marginLeft:10}}>
                  {deployedSecond}
                </Text>
              </ListItem>
              <ListItem>
                <ListIcon as={MdCheckCircle} color='green.500' />
                <Button colorScheme='green' onClick={deploy.bind(this, 3)}>Deploy third contract</Button>
                <Text as='b' style={{marginLeft:10}}>
                  {deployedThird}
                </Text>
              </ListItem>
              <Divider />
              <ListItem>
                <ListIcon as={MdSettings} color='blue.500' />
                <Button colorScheme='blue' onClick={mintNFT.bind(this)}>Get random</Button>
              </ListItem>
              <Divider />
              {nfts.map(nft => <div key={nft}> <h1>{nft.contract}</h1> <img alt="1" src={JSON.parse(nft.data).image}/></div>)}
            </List><List spacing={3}>
          </List>
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
