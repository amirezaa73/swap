export let signer = null;

export async function connectWallet() {
    if (!window.ethereum) {
        alert("لطفاً متامسک را نصب کنید!");
        return;
    }

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        document.getElementById('status').textContent = "متصل شد: " + await signer.getAddress();
    } catch (error) {
        alert("اتصال ناموفق: " + error.message);
    }
}

// رویداد کلیک برای دکمه اتصال
document.getElementById('connectBtn').addEventListener('click', connectWallet);
