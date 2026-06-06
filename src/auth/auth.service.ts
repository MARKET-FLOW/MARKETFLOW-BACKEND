import { Injectable } from '@nestjs/common';
import { UserAuthDto } from './dto/create-auth.dto';
import { ServiceResult } from 'src/common/types/service.result';
import { AuthRepository } from './auth.repository';
import { ErrorMessage } from 'src/common/types/error.message';
import { verifyPassword } from 'src/common/utils/password.hash';
import { ErrorType } from 'src/common/types/error-type.enum';

@Injectable()
export class AuthService {
  constructor(private readonly authRepo: AuthRepository){}

  async serviceLogin(authData: UserAuthDto): Promise<ServiceResult<string>>{

    const authRepoResponse = await this.authRepo.findUserByFields('username', authData.username)
    if (authRepoResponse.isError){
      return ServiceResult.error_service(
        authRepoResponse.error,
        authRepoResponse.statusCode
      )
    }

    if (!await verifyPassword(authRepoResponse.data.passwordHash, authData.password)){
      return ServiceResult.error_service(
        new ErrorMessage(
          ErrorType.NOT_FOUND,
          `Utilisateur avec username ${authData.username} non trouvé`
        )
      )
    }    

    // on génère les tokens ici et on retourn un message de succès

    return ServiceResult.success_service(
      `Utilisateur ${authData.username} connecté avec succès !`
    )
  }
}
