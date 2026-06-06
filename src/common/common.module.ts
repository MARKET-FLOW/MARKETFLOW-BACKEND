import { Module, Global } from '@nestjs/common';
import { CookieService } from './cookies/cookie.service';

@Global() 
@Module({
  providers: [CookieService],
  exports: [CookieService],
})
export class CommonModule {}