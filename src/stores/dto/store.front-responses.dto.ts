import { ApiResponse } from '../../common/types/api.response';
import { FrontReadStore } from './front-read-store.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FrontStoreInfo extends ApiResponse<FrontReadStore> {
  @ApiPropertyOptional({
    type: () => FrontReadStore,
  })
  declare result: FrontReadStore;
}

export class FrontListStoreInfo extends ApiResponse<FrontReadStore[]> {
  @ApiPropertyOptional({
    type: () => [FrontReadStore],
  })
  declare result: FrontReadStore[];
}
