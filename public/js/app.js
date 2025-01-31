import { getPriceRoute, buildTransaction } from './paraswap.js';

document.getElementById('swapBtn').addEventListener('click', executeSwap);

async function executeSwap() {
    if (!signer) {
        alert("ابتدا کیف پول را وصل کنید!");
        return;
    }

    try {
        // بررسی موجودی ETH
        const balance = await signer.getBalance();
        const minBalance = ethers.utils.parseEther("0.005"); // حداقل ۰.۰۰۵ ETH
        if (balance.lt(minBalance)) {
            throw new Error("موجودی کافی برای پرداخت کارمزد نیست!");
        }

        // دریافت مقادیر از فرم
        const srcToken = document.getElementById('srcToken').value;
        const destToken = document.getElementById('destToken').value;
        const amount = document.getElementById('amount').value;

        // دریافت قیمت و ساخت تراکنش
        const priceData = await getPriceRoute(srcToken, destToken, amount);
        if (!priceData.priceRoute) throw new Error("پاسخ قیمت نامعتبر است!");
        const txData = await buildTransaction(priceData.priceRoute);

        // اعتبارسنجی آدرس قرارداد Paraswap
        const paraswapAddress = "0xDEF171Fe48CF0115B1d80b88dc8eAB59176FEe57";
        if (txData.to.toLowerCase() !== paraswapAddress.toLowerCase()) {
            throw new Error("آدرس قرارداد نامعتبر است!");
        }

        // ارسال تراکنش با تنظیمات Gas
        const txResponse = await signer.sendTransaction({
            to: txData.to,
            data: txData.data,
            value: txData.value,
            gasPrice: ethers.utils.parseUnits("25", "gwei"), // 25 Gwei
            gasLimit: 350000, // 350,000 Gas
        });

        document.getElementById('status').textContent = "هش تراکنش: " + txResponse.hash;
        await txResponse.wait();
        document.getElementById('status').textContent += " - تایید شد!";

    } catch (error) {
        document.getElementById('status').textContent = "خطا: " + error.message;
    }
}
