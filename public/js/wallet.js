export async function connectWallet() {
    if (!window.ethereum) {
        alert("لطفاً متامسک را نصب کنید!");
        return;
    }

    try {
        // بررسی شبکه آربیتروم (ChainID = 42161)
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0xA4B1') { // 0xA4B1 = 42161 در هگز
            alert("لطفاً شبکه خود را به آربیتروم تغییر دهید!");
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0xA4B1',
                    chainName: 'Arbitrum One',
                    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                    blockExplorerUrls: ['https://arbiscan.io/'],
                    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
                }],
            });
            return;
        }

        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        document.getElementById('status').textContent = "متصل شد: " + await signer.getAddress();
    } catch (error) {
        alert("اتصال ناموفق: " + error.message);
    }
}
