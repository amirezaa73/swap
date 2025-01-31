import { signer } from './wallet.js';
import { getPriceRoute, buildTransaction } from './paraswap.js';

document.getElementById('swapBtn').addEventListener('click', executeSwap);

async function executeSwap() {
    if (!signer) {
        alert("ابتدا کیف پول را وصل کنید!");
        return;
    }

    try {
        const srcToken = document.getElementById('srcToken').value;
        const destToken = document.getElementById('destToken').value;
        const amount = document.getElementById('amount').value;

        // دریافت قیمت
        const priceData = await getPriceRoute(srcToken, destToken, amount);

        // ساخت تراکنش
        const txData = await buildTransaction(priceData.priceRoute);

        // اعتبارسنجی آدرس
        if (!ethers.utils.isAddress(txData.to)) {
            throw new Error("آدرس مقصد نامعتبر است!");
        }

        // ارسال تراکنش
        const txResponse = await signer.sendTransaction({
            to: txData.to,
            data: txData.data,
            value: txData.value,
            gasPrice: txData.gasPrice,
            gasLimit: txData.gas,
        });

        document.getElementById('status').textContent = "هش تراکنش: " + txResponse.hash;
        await txResponse.wait();
        document.getElementById('status').textContent += " - تایید شد!";

    } catch (error) {
        document.getElementById('status').textContent = "خطا: " + error.message;
    }
}
