import { doc, getDoc } from "firebase/firestore";
import * as openpgp from "openpgp/lightweight";
import collections from "./collections";

export default class Signature {
  static async generate<T>(data: T, entityID: string) {
    const keypair = localStorage.getItem("keypair");
    const serializedKeypair = JSON.parse(
      keypair || ""
    ) as openpgp.SerializedKeyPair<string> & {
      revocationCertificate: string;
    };
    const message = await openpgp.createMessage({
      text: JSON.stringify({ data, entityID }),
    });
    const detached = await openpgp.sign({
      message,
      signingKeys: await openpgp.readPrivateKey({
        armoredKey: serializedKeypair.privateKey,
      }),
      detached: true,
    });
    return detached as string;
  }
  static async verify<T>(data: T, signature: string, entityID: string) {
    try {
      const message = await openpgp.createMessage({
        text: JSON.stringify({ data, entityID }),
      });
      const profile = await getDoc(doc(collections.profiles, entityID));
      const publicKey = profile.data()?.keys.publicKey as string;
      const verificationResult = await openpgp.verify({
        message,
        verificationKeys: await openpgp.readKey({
          armoredKey: publicKey,
        }),
        signature: await openpgp.readSignature({
          armoredSignature: signature,
        }),
      });
      const { verified } = verificationResult.signatures[0];
      return verified;
    } catch (error) {
      return false;
    }
  }
}
