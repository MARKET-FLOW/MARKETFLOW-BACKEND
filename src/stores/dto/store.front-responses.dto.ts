import { ApiResponseData } from '../../common/types/api.response.data';
import { FrontReadStore } from './front-read-store.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FrontStoreInfo extends ApiResponseData<FrontReadStore> {
  @ApiProperty({
    type: FrontReadStore,
  })
  declare result: FrontReadStore;
}

export class FrontStoreNotFoundResponse extends ApiResponseData<null> {}

export class FrontListStoreInfo extends ApiResponseData<FrontReadStore[]> {
  @ApiProperty({
    type: [FrontReadStore],
  })
  declare result: FrontReadStore[];
}
