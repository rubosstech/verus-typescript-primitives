import { ATTESTATION_READ_REQUEST, IDENTITYDATA_NAME, IDENTITYDATA_FIRSTNAME, IDENTITYDATA_PERSONAL_DETAILS, IDENTITYDATA_LASTNAME, IDENTITYDATA_ATTESTOR, IDENTITYDATA_IDENTITY, ATTESTATION_TYPE } from "../../vdxf";
import { Attestation, LoginConsentRequest } from "../../vdxf/classes";
import { RedirectUri, RequestedPermission } from "../../vdxf/classes/Challenge";
import { Context } from "../../vdxf/classes/Context";
import { CPartialAttestationProof } from "../../vdxf/classes/Attestation";
import { AttestationData, AttestationDataType } from "../../vdxf/classes/attestationData";
import * as idkeys  from "../../vdxf/identityDataKeys";
import { PersonalData } from "../../vdxf/classes/PersonalData";

describe('Create a personal info request', () => {
  test('attestation request with reply', async () => {


    let nameMap = new Array<AttestationDataType>();
    // requested data from user.
    nameMap.push(new AttestationDataType("", IDENTITYDATA_FIRSTNAME.vdxfid, ""));
    nameMap.push(new AttestationDataType("", IDENTITYDATA_LASTNAME.vdxfid, ""));
    nameMap.push(new AttestationDataType("", IDENTITYDATA_IDENTITY.vdxfid, ""));

    let personalMap = new Array<AttestationDataType>();
    personalMap.push(new AttestationDataType("", IDENTITYDATA_ATTESTOR.vdxfid, ""));
    personalMap.push(new AttestationDataType("", ATTESTATION_TYPE.vdxfid, ""));

    const personalData = new PersonalData({
      type: PersonalData.TYPE.REQUEST,
      id: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV",
      data: {
        [IDENTITYDATA_NAME.vdxfid]: nameMap,
        [IDENTITYDATA_PERSONAL_DETAILS.vdxfid]: personalMap
      },
      linkedAttestation: "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV"
    });

    const personalDataBuffer = personalData.toDataBuffer();

    const personalData2 = new PersonalData();
    personalData2.fromDataBuffer(personalDataBuffer);

    expect(personalData2.toBuffer().toString('hex')).toEqual(personalData.toBuffer().toString('hex'));
  });

});
