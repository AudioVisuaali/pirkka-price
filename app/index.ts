import { beerQueries } from "./beerQueries";

const handleProcess = async (): Promise<void> => {
  const result = await beerQueries.getPirkkaPrice();

  if (!result.success) {
    console.error(result.failure);
    // eslint-disable-next-line no-console
    console.log("PIRKKA PRICE FAILED");
    process.exit(1);
  }

  // eslint-disable-next-line no-console
  console.log(`PIRKKA PRICE: ${result.value}`);
  process.exit(0);
};

handleProcess();
