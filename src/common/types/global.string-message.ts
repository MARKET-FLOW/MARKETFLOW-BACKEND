import { ApiProperty } from '@nestjs/swagger';


export class GlobalStringMessage {
  @ApiProperty({
    type: () => String,
    description: 'Message de réponse pour chaine de caractère littérale',
  })
  message!: string;
}
