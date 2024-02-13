import {
  Utf8DataVdxfObject,
  HexDataVdxfObject,
  BufferDataVdxfObject,
  PNGImageVdxfObject
} from "..";
import * as identitykeys from '../identityDataKeys';
import * as keylist from '../keys';
import bufferutils from '../../utils/bufferutils';
import createHash = require("create-hash");
import { fromBase58Check, toBase58Check } from '../../utils/address';
import varuint from '../../utils/varuint'
import { I_ADDR_VERSION, HASH160_BYTE_LENGTH } from '../../constants/vdxf';
const { BufferReader, BufferWriter } = bufferutils;

export const AttestationClassTypes = {
  BUFFER_DATA_STRING: 1,
  BUFFER_DATA_BYTES: 2,
  BUFFER_DATA_BASE64: 3,
  URL: 4,
  PNG_IMAGE: 5,
}

export const AttestationVdxfidMap = {
  [identitykeys.IDENTITYDATA_FIRSTNAME.vdxfid]: { name: "First Name", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_LASTNAME.vdxfid]: { name: "Last Name", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ATTESTOR.vdxfid]: { name: "Attestor ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDENTITY.vdxfid]: { name: "Identity", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ID.vdxfid]: { name: "ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_USERID.vdxfid]: { name: "User ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_CREATEDAT.vdxfid]: { name: "Created at", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_COMPLETEDAT.vdxfid]: { name: "Completed at", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PREVIOUSATTEMPTID.vdxfid]: { name: "Previous attempt ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_SHAREABLEURL.vdxfid]: { name: "Shareable URL", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_TEMPLATEID.vdxfid]: { name: "Template ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_TEMPLATEVERSION.vdxfid]: { name: "Template Version", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PHONENUMBER.vdxfid]: { name: "Phone Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DATEOFBIRTH.vdxfid]: { name: "Date of Birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_OVER18.vdxfid]: { name: "Over 18", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_OVER21.vdxfid]: { name: "Over 21", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_OVER25.vdxfid]: { name: "OVer 25", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IPADDRESS.vdxfid]: { name: "IP Address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL.vdxfid]: { name: "Email Address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS.vdxfid]: { name: "Home address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_STREET1.vdxfid]: { name: "Street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_STREET2.vdxfid]: { name: "Street 2", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_CITY.vdxfid]: { name: "City", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_REGION.vdxfid]: { name: "Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_POSTCODE.vdxfid]: { name: "Post Code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_COUNTRY.vdxfid]: { name: "Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDNUMBER_VALUE.vdxfid]: { name: "ID Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDNUMBER_TYPE.vdxfid]: { name: "ID Type", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_STATUS.vdxfid]: { name: "Status", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_APPROVALS_ACCEPTEDTOS.vdxfid]: { name: "Accepted Terms and Conditions", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_APPROVALS_VERIFIEDSMS.vdxfid]: { name: "SMS Verified", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_APPROVALS_KYCCHECKED.vdxfid]: { name: "KYC Checked ok", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_APPROVALS_DOCUMENTSVERIFIED.vdxfid]: { name: "Documents Verified", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_APPROVALS_SELFIECHECKED.vdxfid]: { name: "Selfie Checked", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_APPROVALS_WATCHLIST_OK.vdxfid]: { name: "identitydata.approvals.watchlist.ok", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_APPROVALS_RISKCHECKOK.vdxfid]: { name: "identitydata.approvals.riskcheckok", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ORIGINAL_FRONT.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ORIGINAL_BACK.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CROPPED_FRONT.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CROPPED_BACK.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_FACE.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_IDNUMBER.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CATEGORY.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_EXPIRATIONDATE.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ISSUING_REGION.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_DATEOFBIRTH.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ADDRESS.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_STREET1.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CITY.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_REGION.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_POSTCODE.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_COUNTRY.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_MATCHED.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_NAME_MATCHED.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_DATEOFBIRTH_MATCHED.vdxfid]: { name: "identitydata.drivinglicence", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_SELFIECHECK_SUCCESS.vdxfid]: { name: "identitydata.selfiecheck.success", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_SELFIECHECK_IMAGE.vdxfid]: { name: "identitydata.selfiecheck.image", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_SELFIECHECK_VIDEO.vdxfid]: { name: "identitydata.selfiecheck.video", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_SELFIECHECK_DRIVINGLICENCE_MATCH.vdxfid]: { name: "identitydata.selfiecheck.drivinglicence.match", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_SUCCESS.vdxfid]: { name: "identitydata.kyc.success", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_ADDRESS_MATCHED.vdxfid]: { name: "identitydata.kyc.address.matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_TYPE.vdxfid]: { name: "identitydata.kyc.type", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_NAME_MATCHED.vdxfid]: { name: "identitydata.kyc.name.matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_DATEOFBIRTH_MATCHED.vdxfid]: { name: "identitydata.kyc.dateofbirth.matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_IDNUMBER_MATCHED.vdxfid]: { name: "identitydata.kyc.idnumber.matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_PHONENUMBER_MATCHED.vdxfid]: { name: "identitydata.kyc.phonenumber.matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_AREACODE_MATCHED.vdxfid]: { name: "identitydata.kyc.areacode.matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RISKCHECK_STATUS.vdxfid]: { name: "identitydata.riskcheck.status", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RISKCHECK_USERINTERACTIONS.vdxfid]: { name: "identitydata.riskcheck.userinteractions", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RISKCHECK_FRAUDRINGOK.vdxfid]: { name: "identitydata.riskcheck.fraudringok", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RISKCHECK_BOTNOTDETECTED.vdxfid]: { name: "identitydata.riskcheck.botnotdetected", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_ISDELIVERABLE.vdxfid]: { name: "identitydata.email.isdeliverable", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_BREACHCOUNT.vdxfid]: { name: "identitydata.email.breachcount", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_FIRSTBREACHEDAT.vdxfid]: { name: "identitydata.email.firstbreachedat", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_LASTBREACHEDAT.vdxfid]: { name: "identitydata.email.lastbreachedat", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_REGISTEREDAT.vdxfid]: { name: "identitydata.email.domain.registeredat", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_FREEPROVIDER.vdxfid]: { name: "identitydata.email.domain.freeprovider", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_CUSTOM.vdxfid]: { name: "identitydata.email.domain.custom", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_DISPOSABLE.vdxfid]: { name: "identitydata.email.domain.disposable", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_TOPLEVEL_SUSPICIOUS.vdxfid]: { name: "identitydata.email.domain.toplevel.suspicious", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ORIGINAL_FRONT.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ORIGINAL_BACK.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_CROPPED_FRONT.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_CROPPED_BACK.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_FACE.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_IDNUMBER.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_CATEGORY.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_EXPIRATIONDATE.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ISSUING_REGION.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_DATEOFBIRTH.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_STREET1.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_CITY.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_REGION.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_POSTCODE.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_COUNTRY.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_NAME_MATCHED.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_DATEOFBIRTHMATCHED.vdxfid]: { name: "identitydata.idcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ORIGINAL_FRONT.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ORIGINAL_BACK.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_CROPPED_FRONT.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_CROPPED_BACK.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_FACE.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_IDNUMBER.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_CATEGORY.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_EXPIRATIONDATE.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ISSUINGREGION.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_DATEOFBIRTH.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_STREET1.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_CITY.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_REGION.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_POSTCODE.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_COUNTRY.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_NAME_MATCHED.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_DATEOFBIRTHMATCHED.vdxfid]: { name: "identitydata.passport", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ORIGINAL_FRONT.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ORIGINAL_BACK.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CROPPED_FRONT.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CROPPED_BACK.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_FACE.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_IDNUMBER.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CATEGORY.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_EXPIRATIONDATE.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ISSUINGREGION.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DATEOFBIRTH.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_STREET1.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_CITY.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_REGION.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_POSTCODE.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_COUNTRY.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_NAME_MATCHED.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DATEOFBIRTHMATCHED.vdxfid]: { name: "identitydata.residencepermit", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ORIGINAL_FRONT.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ORIGINAL_BACK.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_CROPPED_FRONT.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_CROPPED_BACK.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_FACE.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_IDNUMBER.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_CATEGORY.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_EXPIRATIONDATE.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ISSUINGREGION.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_DATEOFBIRTH.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_STREET1.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_CITY.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_REGION.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_POSTCODE.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_COUNTRY.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_NAME_MATCHED.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_DATEOFBIRTHMATCHED.vdxfid]: { name: "identitydata.residentcard", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ORIGINAL_FRONT.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ORIGINAL_BACK.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_CROPPED_FRONT.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_CROPPED_BACK.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_FACE.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_IDNUMBER.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_CATEGORY.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_EXPIRATIONDATE.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ISSUINGREGION.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_DATEOFBIRTH.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_STREET1.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_CITY.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_REGION.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_POSTCODE.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_COUNTRY.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_NAME_MATCHED.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_DATEOFBIRTHMATCHED.vdxfid]: { name: "identitydata.visa", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ORIGINALFRONT.vdxfid]: { name: "identitydata.documentverification.originalfront", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ORIGINALBACK.vdxfid]: { name: "identitydata.documentverification.originalback", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CROPPEDFRONT.vdxfid]: { name: "identitydata.documentverification.croppedfront", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CROPPEDBACK.vdxfid]: { name: "identitydata.documentverification.croppedback", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_FACE.vdxfid]: { name: "identitydata.documentverification.face", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_IDNUMBER.vdxfid]: { name: "identitydata.documentverification.idnumber", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CATEGORY.vdxfid]: { name: "identitydata.documentverification.category", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_EXPIRATIONDATE.vdxfid]: { name: "identitydata.documentverification.expirationdate", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ISSUINGCOUNTRY.vdxfid]: { name: "identitydata.documentverification.issuingcountry", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ISSUINGREGION.vdxfid]: { name: "identitydata.documentverification.issuingregion", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_DATEOFBIRTH.vdxfid]: { name: "identitydata.documentverification.dateofbirth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ADDRESS.vdxfid]: { name: "identitydata.documentverification.address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_STREET1.vdxfid]: { name: "identitydata.address.street1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_STREET2.vdxfid]: { name: "identitydata.address.street2", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_CITY.vdxfid]: { name: "identitydata.address.city", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_REGION.vdxfid]: { name: "identitydata.address.region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_POSTCODE.vdxfid]: { name: "identitydata.address.postcode", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_COUNTRY.vdxfid]: { name: "identitydata.address.country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "identitydata.documentverification.matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_NAME_MATCHED.vdxfid]: { name: "identitydata.documentverification.name.matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_DATEOFBIRTHMATCHED.vdxfid]: { name: "identitydata.documentverification.dateofbirthmatched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [keylist.ATTESTATION_TYPE.vdxfid]: { name: "Attestation Type", type: AttestationClassTypes.BUFFER_DATA_STRING },
};

export class AttestationDataType {

  dataItem: Utf8DataVdxfObject | HexDataVdxfObject | BufferDataVdxfObject | PNGImageVdxfObject;
  salt: Buffer;

  constructor(data: any, vdxfkey: string, salt?: string) {

    switch (AttestationVdxfidMap[vdxfkey].type) {
      case AttestationClassTypes.BUFFER_DATA_STRING:
        this.dataItem = new Utf8DataVdxfObject(data, vdxfkey);
        break;
      case AttestationClassTypes.BUFFER_DATA_BYTES:
        this.dataItem = new HexDataVdxfObject(data, vdxfkey);
        break;
      case AttestationClassTypes.BUFFER_DATA_BASE64:
        this.dataItem = new BufferDataVdxfObject(data, vdxfkey, "base64");
        break;
      case AttestationClassTypes.URL:
        this.dataItem = new BufferDataVdxfObject(data, vdxfkey, "utf8");
        break;
      case AttestationClassTypes.PNG_IMAGE:
        this.dataItem = new PNGImageVdxfObject(data, vdxfkey);
        break;
      default:
        this.dataItem = new HexDataVdxfObject(data, vdxfkey);
        break;
    }

    if (salt) {
      this.salt = Buffer.from(salt, "hex");
    }
  }

  dataBytelength(): number {

    let length = 0;

    length += this.dataItem.byteLength();
    length += this.salt.length;

    return length;
  }

  toBuffer(): Buffer {

    const buffer = Buffer.alloc(this.dataBytelength());
    const writer = new bufferutils.BufferWriter(buffer);
    writer.writeSlice(this.dataItem.toBuffer());
    writer.writeSlice(this.salt);

    return writer.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset = 0, vdxfkey?: string): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
    reader.offset = this.dataItem.fromBuffer(reader.buffer, reader.offset, vdxfkey);
    this.salt = reader.readSlice(32);

    return reader.offset;
  }
}

export const friendlyNames = (vdfxkey) => {

  if (vdfxkey in AttestationVdxfidMap) {

    return AttestationVdxfidMap[vdfxkey].name;

  } else {
    throw new Error("Unknown VDXF key");
  }
}

export class AttestationData {

  components: Map<number, AttestationDataType>;
  constructor(components: Map<number, AttestationDataType> = new Map()) {
    this.components = components;
  }

  dataByteLength(): number {
    let byteLength = 0;
    byteLength += varuint.encodingLength(this.components.size)

    for (const [key, item] of this.components) {
      byteLength += varuint.encodingLength(key);
      byteLength += item.dataBytelength();
    }

    return byteLength;
  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeCompactSize(this.components.size);

    for (const [key, item] of this.components) {
      bufferWriter.writeCompactSize(key);
      bufferWriter.writeSlice(item.toBuffer());
    }

    return bufferWriter.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
    const componentsLength = reader.readCompactSize();
    this.components = new Map();

    for (var i = 0; i < componentsLength; i++) {
      const key = reader.readCompactSize();
      const vdxfid = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
      const attestationData = new AttestationDataType(null, vdxfid);
      reader.offset = attestationData.fromDataBuffer(reader.buffer, reader.offset, vdxfid);

      this.components.set(key, attestationData);
    }

    return reader.offset;
  }

  size(): number {
    return this.components.size;
  }

  setDataFromJson(data: Array<AttestationDataType>, getSalt: Function) {

    if (!this.components) {
      this.components = new Map();
    }

    for (let i = 0; i < data.length; i++) {

      const item = data[i];

      if (!(item.salt instanceof Buffer) || item.salt.length !== 32) {
        if (typeof getSalt === "function") {
          item.salt = getSalt();
        } else {
          throw new Error("Salt is required to be a 32 random byte Buffer");
        }
      }

      try {
        fromBase58Check(item.dataItem.vdxfkey)
      } catch (e) {
        throw new Error("Attestation Key is required to be base58 format");
      }

      this.components.set(i, item);
    }

  }

  getHash(key): Buffer {

    let value: Buffer;

    value = this.components.get(key).toBuffer();

    return createHash("sha256").update(value).digest();
  }

}