import * as identitykeys from "../../vdxf";
import { BigNumber } from '../../utils/types/BigNumber';
import { BN } from 'bn.js';
import {AttestationDataType } from "../../vdxf/classes/Attestation";
import { PersonalProfileDataStore, DataCategory } from "../../vdxf/classes/PersonalProfile";
import { DataDescriptor } from "../../vdxf/classes/DataDescriptor";
import { VectorEncodeVDXFUni, MMRDescriptor } from "../../vdxf/classes/DataDescriptor";


describe('Create a personal info request', () => {
  test('serialize datadescriptor with nested datadescriptor', async () => {

    const profileData = new PersonalProfileDataStore();

    const personalDataCategory = DataDescriptor.fromJson({
      version: 1,
      "flags": 2,
      "objectdata": {
        "i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv": {
          "version": 1,
          "flags": 96,
          "mimetype": "text/plain",
          "objectdata": {
            "message": "John"
          },
          "label": "i4GqsotHGa4czCdtg2d8FVHKfJFzVyBPrM"
        }
      },
      "salt": "4f66603f256d3f757b6dc3ea44802d4041d2a1901e06005028fd60b85a5878a2"
    });

    const testserali = personalDataCategory.toBuffer();
    //profileData.data.personal = personalDataCategory;

    // const contractDataCategory = profileData.data.contact;

    // contractDataCategory.data = [
    //   AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_EMAIL.vdxfid, "abc@def.com"),
    //   AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_PHONENUMBER.vdxfid, "123-456-7890")
    // ];

    // const LocationDataCategory = profileData.data.locations;

    // LocationDataCategory.data = [
    //   AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_STREET1.vdxfid, "123 Main St"),
    //   AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_STREET2.vdxfid, "Cobham"),
    //   AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_CITY.vdxfid, "Anytown"),
    //   AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_REGION.vdxfid, "AnyState"),
    //   AttestationDataType.getDataItem(identitykeys.IDENTITYDATA_HOMEADDRESS_POSTCODE.vdxfid, "12345")
    // ];

    // const personalDataBuffer = profileData.toDataBuffer();

    // const personalData2 = new PersonalProfileDataStore();
    // personalData2.fromDataBuffer(personalDataBuffer);

    // expect(personalData2.toBuffer().toString('hex')).toEqual(profileData.toBuffer().toString('hex'));
  });

  test('serialize mmrdescriptor', async () => {

    const mmrdescriptor = {
      "version": 1,
      "objecthashtype": 5,
      "mmrhashtype": 1,
      "mmrroot": {
        "version": 1,
        "flags": 0,
        "objectdata": "30395e0868b1953477e14bb5c16349622239a94115a4d1f02b72b6ecf8b1c79c"
      },
      "mmrhashes": {
        "version": 1,
        "flags": 0,
        "objectdata": "41d826d3c6cbbc3a96992670d2f604e959fd1a8c014102f1eac8f180bee7fb256b801b219e20612fbc9f5e99da111a8364d1197ff3e3fbef8259770f618dacee9489e8cd2cd5dd77d36ede6c42cebdabd85a5b5e8af60b"
      },
      "datadescriptors": [
        {
          "version": 1,
          "flags": 2,
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
          "salt": "4f66603f256d3f757b6dc3ea44802d4041d2a1901e06005028fd60b85a5878a2"
        },
        {
          "version": 1,
          "flags": 2,
          "objectdata": {
            "i4GC1YGEVD21afWudGoFJVdnfjJ5XWnCQv": {
              "version": 1,
              "flags": 96,
              "mimetype": "text/plain",
              "objectdata": {
                "message": "Monkins"
              },
              "label": "iHybTrNB1kXRrjsCtJXd6fvBKxepqMpS5Z"
            }
          },
          "salt": "62fae0c46b2ad1177749e25fd6d48ccb40213d3cc72e4b2b0dc533039cbe8314"
        }
      ]
    }

    const mmrdescriptorBuffer = MMRDescriptor.fromJson(mmrdescriptor);

    const mmrbuffer = mmrdescriptorBuffer.toBuffer();


  });

});
