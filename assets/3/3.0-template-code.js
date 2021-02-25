'use strict'

const Libp2p = require('libp2p')

const TCP = require('libp2p-tcp')
const WS = require('libp2p-websockets')
const WStar = require('libp2p-webrtc-star')
const Wrtc = require('wrtc')
const Plaintext = require('libp2p/src/insecure/plaintext') // TODO: replace plaintext with `libp2p-noise`

const multiaddr = require('multiaddr')

// TODO: require `libp2p-noise`

const WebrtcStar = new WStar({ wrtc: Wrtc })

// TODO: modify options to replace plaintext in `connEncryption` to noise
let options = {
    modules: {
        transport: [ TCP, WS, WStar ],
        connEncryption: [ Plaintext ]
    },
    config: {
        transport: {
            [transportKey]: {
                Wrtc
            }
        }
    }
}

const bootstrapAddress = multiaddr('/ip4/0.0.0.0/tcp/63785/ipfs/QmWjz6xb8v9K4KnYEwP5Yk75k5mMBCehzWFLCvvQpYxF3d');

async function onStart(libp2p) {
    libp2p.dial(bootstrapAddress, (err) => {
        if (err) return console.error(err)
    })
}

async function main() {
    // Create a libp2p instance
    let libp2p = await Libp2p.create(options)

    libp2p.on('peer:connect', (peerInfo) => {
        console.info(`Connected to ${peerInfo.id.toB58String()}!`)
    })

    libp2p.peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0')
    libp2p.peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0/ws')

    await libp2p.start();
    console.info('Libp2p Started');
    libp2p.peerInfo.multiaddrs.forEach(ma => console.log(ma.toString()));
    onStart(libp2p);
}


main()