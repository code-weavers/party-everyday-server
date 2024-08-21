import { AdditionalPartyInfo } from "@/entities/additionalPartyInfo.entity";
import { AdditionalInfoDTO, CreateAdditionalInfoDTO } from "@/modules/party/presenters/party.dto";

export const additionalInfoMock: AdditionalPartyInfo = {
   id: '1',
   partyId: '1',
   name: 'teste',
   value: 1,
   createdAt: new Date(),
   updatedAt: new Date(),
}

export const additionalInfosMock: AdditionalPartyInfo[] = [
   {
      id: '1',
      partyId: '1',
      name: 'teste',
      value: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
   }
]

const additionalInfo: AdditionalInfoDTO = {
   name: 'teste',
   value: 1,
}

const additionalInfos: AdditionalInfoDTO[] = [additionalInfo]

export const createAdditionalInfoMock: CreateAdditionalInfoDTO = {
   additionalInfo: additionalInfos
}
export const createAdditionalInfosMock: CreateAdditionalInfoDTO[] = [createAdditionalInfoMock]