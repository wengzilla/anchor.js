import {
  Coin,
  Dec,
  Coins,
  Int,
  MsgExecuteContract,
} from "@terra-money/terra.js";
import { validateInput } from "../../utils/validate-input";
import { validateAddress } from "../../utils/validation/address";
import { AddressProvider } from "../../address-provider/provider";
import { validateIsGreaterThanZero } from "../../utils/validation/number";

interface Option {
  address: string;
  bAsset: string;
  tokenAmount: string;
  nativeAmount: string;
  quote: string;
  slippageTolerance?: string;
}

export const fabricateTerraSwapProvideLiquiditybLuna = ({
  address,
  slippageTolerance,
  bAsset,
  tokenAmount,
  nativeAmount,
  quote,
}: Option) => (addressProvider: AddressProvider): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateIsGreaterThanZero(tokenAmount),
    validateIsGreaterThanZero(nativeAmount),
  ]);

  const pairAddress = addressProvider.terraswapblunaLunaPair();
  const tokenAddress = addressProvider.blunaToken(bAsset);

  const coins = new Coins([
    new Coin(quote, new Int(new Dec(nativeAmount).mul(1000000)).toString()),
  ]);
  return [
    new MsgExecuteContract(
      address,
      pairAddress,
      {
        provide_liquidity: {
          assets: [
            {
              info: {
                ANC: {
                  contract_addr: tokenAddress,
                },
              },
              amount: new Int(new Dec(tokenAmount).mul(1000000)).toString(),
            },
            {
              info: {
                native_token: {
                  denom: quote,
                },
              },
              amount: new Int(new Dec(nativeAmount).mul(1000000)).toString(),
            },
          ],
          slippage_tolerance: slippageTolerance ? slippageTolerance : undefined,
        },
      },
      coins
    ),
  ];
};