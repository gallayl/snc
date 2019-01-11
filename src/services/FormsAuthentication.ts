import {
  AuthenticationService,
  ConstantContent,
  LoginState,
  ODataResponse,
  Repository,
} from "@sensenet/client-core";
import { ObservableValue } from "@sensenet/client-utils";
import { User } from "@sensenet/default-content-types";
export class FormsAuthentication implements AuthenticationService {
  public state: ObservableValue<LoginState> = new ObservableValue(
    LoginState.Unknown,
  );

  public currentUser: ObservableValue<User> = new ObservableValue<User>(
    ConstantContent.VISITOR_USER,
  );

  /**
   *
   */
  constructor(private repository: Repository) {}
  public async dispose(): Promise<void> {
    /** */
  }
  public async checkForUpdate(): Promise<boolean> {
    return false;
  }
  public async login(username: string, password: string): Promise<boolean> {
    try {
      const user = await this.repository.executeAction<
        { username: string; password: string },
        ODataResponse<User>
      >({
        body: {
          username,
          password,
        },
        method: "POST",
        idOrPath: ConstantContent.PORTAL_ROOT.Id,
        name: "Login",
      });
      this.currentUser.setValue(user.d);
      return user.d.Id !== ConstantContent.VISITOR_USER.Id ? true : false;
    } catch (error) {
      return false;
    }
  }
  public async logout(): Promise<boolean> {
    await this.repository.executeAction({
      method: "POST",
      idOrPath: ConstantContent.PORTAL_ROOT.Id,
      name: "Logout",
      body: {},
    });
    this.currentUser.setValue(ConstantContent.VISITOR_USER);
    return true;
  }
}
