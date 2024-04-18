import * as identitykeys from "../../vdxf";
import { BigNumber } from '../../utils/types/BigNumber';
import { BN } from 'bn.js';
import {AttestationDataType } from "../../vdxf/classes/Attestation";
import { PersonalProfileDataStore, DataCategory } from "../../vdxf/classes/PersonalProfile";
import { CDataDescriptor } from "../../vdxf/classes/DataDescriptor";
describe('Create a personal info request', () => {
  test('attestation request with reply', async () => {


    const profileData = new PersonalProfileDataStore();
    // requested data from user.
    const personalDataCategory = new CDataDescriptor({
      "version": new BN(1),
      "flags": new BN(2),
      "objectdata": {
        "i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv": {
          "version": 1,
          "flags": 96,
          "mimetype": "text/plain",
          "objectdata": {
            "message": "Chris"
          },
          "label": "i4GqsotHGa4czCdtg2d8FVHKfJFzVyBPrM"
        }
      },
      "salt": Buffer.from("4f66603f256d3f757b6dc3ea44802d4041d2a1901e06005028fd60b85a5878a2", 'hex')
    });

    profileData.data.personal = personalDataCategory;

    const contractDataCategory = profileData.data.contact;

    contractDataCategory.data = [
      AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_EMAIL.vdxfid, "abc@def.com"),
      AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_PHONENUMBER.vdxfid, "123-456-7890")
    ];

    const LocationDataCategory = profileData.data.locations;

    LocationDataCategory.data = [
      AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_STREET1.vdxfid, "123 Main St"),
      AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_STREET2.vdxfid, "Cobham"),
      AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_CITY.vdxfid, "Anytown"),
      AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_REGION.vdxfid, "AnyState"),
      AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_POSTCODE.vdxfid, "12345")
    ];

    const personalDataBuffer = profileData.toDataBuffer();

    const personalData2 = new PersonalProfileDataStore();
    personalData2.fromDataBuffer(personalDataBuffer);

    expect(personalData2.toBuffer().toString('hex')).toEqual(profileData.toBuffer().toString('hex'));
  });

});
