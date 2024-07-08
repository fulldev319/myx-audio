import * as ethUtil from 'ethereumjs-util';
import * as sigUtil from 'eth-sig-util';

const domain = 'Myx';
export enum PRIMARY_TYPE {
  MAIL = 'Mail',
  EIP712Domain = 'EIP712Domain'
}
const checkAddressFromSignature = async (address, signature, publicKey) => {
  let checkVerify = false;
  let recovered = '';
  if (publicKey) {
    const msgParams = {
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' }
        ],
        Mail: [
          { name: 'Address', type: 'address' },
          { name: 'Media Encryption Public Key', type: 'string' }
        ]
      },
      primaryType: PRIMARY_TYPE.MAIL,
      domain: {
        name: domain,
        version: '1.0.0-beta'
      },
      message: {
        Address: address,
        'Media Encryption Public Key': publicKey
      }
    };
    try {
      recovered = sigUtil.recoverTypedSignature({
        data: msgParams,
        sig: signature
      });
      checkVerify =
        ethUtil.toChecksumAddress(recovered) ===
        ethUtil.toChecksumAddress(address);
    } catch (err) {
      throw err;
    }
  }
  return checkVerify;
};

export default checkAddressFromSignature;
