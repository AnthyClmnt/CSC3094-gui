export * from './authorisation.service';
import { AuthorisationService } from './authorisation.service';
export * from './github.service';
import { GithubService } from './github.service';
export * from './user.service';
import { UserService } from './user.service';
export const APIS = [AuthorisationService, GithubService, UserService];
