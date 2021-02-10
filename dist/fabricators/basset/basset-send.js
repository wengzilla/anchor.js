"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fabricatebAssetSend = void 0;
var terra_js_1 = require("@terra-money/terra.js");
var validate_input_1 = require("../../utils/validate-input");
var address_1 = require("../../utils/validation/address");
var number_1 = require("../../utils/validation/number");
var fabricatebAssetSend = function (_a) {
    var address = _a.address, amount = _a.amount, bAsset = _a.bAsset, contract = _a.contract, msg = _a.msg;
    return function (addressProvider) {
        validate_input_1.validateInput([
            address_1.validateAddress(address),
            number_1.validateIsNumber(+amount),
            number_1.validateIsGreaterThanZero(+amount),
            address_1.validateAddress(contract),
        ]);
        var bAssetTokenAddress = addressProvider.bAssetToken(bAsset);
        var message = undefined;
        if (msg) {
            message = Buffer.from(JSON.stringify(msg)).toString('base64');
        }
        return [
            new terra_js_1.MsgExecuteContract(address, bAssetTokenAddress, {
                // @see https://github.com/Anchor-Protocol/anchor-bAsset-contracts/blob/cce41e707c67ee2852c4929e17fb1472dbd2aa35/contracts/anchor_basset_token/src/handler.rs#L17
                send: {
                    contract: contract,
                    amount: new terra_js_1.Int(new terra_js_1.Dec(amount).mul(1000000)).toString(),
                    msg: message,
                },
            }),
        ];
    };
};
exports.fabricatebAssetSend = fabricatebAssetSend;
//# sourceMappingURL=basset-send.js.map