import { ApiProperty } from "@nestjs/swagger";
import { FrontReadUser } from "./read.user.";
import { ApiResponse } from "src/common/types/api.response";

export class FrontUserInfos extends ApiResponse<FrontReadUser> {
  @ApiProperty({
    type: () => FrontReadUser,
    description: 'On retourne les données a la création du user',
  })
  declare result: FrontReadUser;
}

export class ListFrontUserInfos extends ApiResponse<FrontReadUser[]> {
  @ApiProperty({
    type: () => [FrontReadUser],
    // isArray: true,
    description: 'On retourne une liste de users de type FrontReadUser',
  })
  declare result: FrontReadUser[];
}
