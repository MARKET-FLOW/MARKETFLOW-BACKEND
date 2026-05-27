import { ApiResponse } from '../../common/types/api.response';
import { FrontReadStore } from './front-read-store.dto';
import { ApiProperty } from '@nestjs/swagger';

export class FrontStoreInfo extends ApiResponse<FrontReadStore> {
  @ApiProperty({
    type: FrontReadStore,
  })
  declare result: FrontReadStore;
}

export class FrontStoreNotFoundResponse extends ApiResponse<null> {}

export class FrontListStoreInfo extends ApiResponse<FrontReadStore[]> {
  @ApiProperty({
    type: [FrontReadStore],
  })
  declare result: FrontReadStore[];
}
