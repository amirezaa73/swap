async function executeSwap() {
  try {
    console.log("### مرحله ۱: دریافت مقادیر ###");
    const srcToken = document.getElementById('srcToken').value;
    const destToken = document.getElementById('destToken').value;
    const amount = document.getElementById('amount').value;

    console.log("### مرحله ۲: دریافت قیمت ###");
    const priceData = await getPriceRoute(srcToken, destToken, amount);
    if (!priceData.priceRoute) throw new Error("پاسخ قیمت نامعتبر است!");

    console.log("### مرحله ۳: ساخت تراکنش ###");
    const txData = await buildTransaction(priceData.priceRoute);
    console.log("txData:", txData);

    console.log("### مرحله ۴: تنظیم Gas ###");
    const gasPrice = ethers.utils.parseUnits("20", "gwei"); // 20 Gwei
    const gasLimit = 300000;

    console.log("### مرحله ۵: ارسال تراکنش ###");
    const txResponse = await signer.sendTransaction({
      to: txData.to,
      data: txData.data,
      value: txData.value,
      gasPrice,
      gasLimit,
    });

    console.log("TX Hash:", txResponse.hash);
    document.getElementById('status').textContent = `هش تراکنش: ${txResponse.hash}`;

    console.log("### مرحله ۶: انتظار برای تأیید ###");
    const receipt = await txResponse.wait();
    console.log("Receipt:", receipt);
    document.getElementById('status').textContent += " - تایید شد!";

  } catch (error) {
    console.error("خطای کامل:", error);
    document.getElementById('status').textContent = `خطا: ${error.message}`;
  }
}
