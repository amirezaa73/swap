import { signer } from './wallet.js';

export async function getPriceRoute(srcToken, destToken, amount) {
    const priceUrl = `/api/paraswap?path=prices/&srcToken=${srcToken}&destToken=${destToken}&amount=${amount}&network=1&side=SELL`;
    const response = await fetch(priceUrl);
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}

export async function buildTransaction(priceRoute) {
    const txUrl = '/api/paraswap?path=transactions/1&ignoreChecks=true';
    const response = await fetch(txUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...priceRoute,
            userAddress: await signer.getAddress(),
            receiver: await signer.getAddress(),
            slippage: 1,
            deadline: Math.floor(Date.now() / 1000) + 300
        })
    });
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}
