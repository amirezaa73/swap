export let signer = null;

export async function connectWallet() {
    if (!window.ethereum) {
        alert("لطفاً متامسک را نصب کنید!");
        return;
    }

    try {
        // بررسی شبکه (اتریوم Mainnet)
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x1') {
            alert("لطفاً شبکه خود را به اتریوم Mainnet تغییر دهید!");
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

document.getElementById('connectBtn').addEventListener('click', connectWallet);
