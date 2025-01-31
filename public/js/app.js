async function executeSwap() {
    if (!signer) {
        alert("ابتدا کیف پول را وصل کنید!");
        return;
    }

    try {
        console.log("### مرحله ۱: دریافت مقادیر از فرم ###");
        const srcToken = document.getElementById('srcToken').value;
        const destToken = document.getElementById('destToken').value;
        const amount = document.getElementById('amount').value;
        console.log("مقادیر ورودی:", { srcToken, destToken, amount });

        // --------------------------------------------
        console.log("### مرحله ۲: دریافت قیمت از Paraswap ###");
        const priceData = await getPriceRoute(srcToken, destToken, amount);
        console.log("پاسخ دریافت قیمت:", priceData);
        if (!priceData.priceRoute) {
            throw new Error("پاسخ قیمت نامعتبر است!");
        }

        // --------------------------------------------
        console.log("### مرحله ۳: ساخت تراکنش ###");
        const txData = await buildTransaction(priceData.priceRoute);
        console.log("داده‌های تراکنش ساخته‌شده:", txData);
        
        // اعتبارسنجی آدرس
        console.log("### مرحله ۴: اعتبارسنجی آدرس مقصد ###");
        if (!ethers.utils.isAddress(txData.to)) {
            throw new Error(`آدرس مقصد نامعتبر: ${txData.to}`);
        }

        // --------------------------------------------
        console.log("### مرحله ۵: ارسال تراکنش ###");
        console.log("جزئیات تراکنش:", {
            to: txData.to,
            data: txData.data,
            value: txData.value,
            gasPrice: txData.gasPrice,
            gasLimit: txData.gas,
        });

        const txResponse = await signer.sendTransaction({
            to: txData.to,
            data: txData.data,
            value: txData.value,
            gasPrice: txData.gasPrice,
            gasLimit: txData.gas,
        });
        console.log("پاسخ ارسال تراکنش:", txResponse);

        // --------------------------------------------
        console.log("### مرحله ۶: انتظار برای تأیید تراکنش ###");
        document.getElementById('status').textContent = "هش تراکنش: " + txResponse.hash;
        const receipt = await txResponse.wait();
        console.log("رسید تأیید تراکنش:", receipt);
        document.getElementById('status').textContent += " - تایید شد!";

    } catch (error) {
        console.error("### خطا ###", error);
        document.getElementById('status').textContent = "خطا: " + error.message;
    }
}
