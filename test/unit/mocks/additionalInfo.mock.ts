import { AdditionalPartyInfo } from "@/entities/additionalPartyInfo.entity";
import { CreateAdditionalInfoDTO } from "@/modules/party/presenters/party.dto";

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

export const createAdditionalInfoMock: CreateAdditionalInfoDTO = {
   name: 'teste',
   value: 1,
}

export const createAdditionalInfosMock: CreateAdditionalInfoDTO[] = [createAdditionalInfoMock]