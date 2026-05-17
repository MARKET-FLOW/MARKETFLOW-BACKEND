import { ApiProperty } from "@nestjs/swagger";
import { ApiResponse } from 'src/common/types/api.response';

export class GlobalStringMessage extends ApiResponse<string> {
  @ApiProperty({
    type: () => String,
    description: 'Message de réponse pour chaine de caractère littérale',
  })
  declare result: string
}