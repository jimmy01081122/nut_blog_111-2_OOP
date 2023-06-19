import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';

import { uniqueid } from '../../utils/uniqueid.util';
import { SettingService } from '../setting/setting.service';
import { SMTPService } from '../smtp/smtp.service';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly settingService: SettingService,
    private readonly smtpService: SMTPService
  ) {}

  createToken(user: Partial<User>) {
    const accessToken = this.jwtService.sign(user);
    return accessToken;
  }

  async login(user: Partial<User>) {
    const data = await this.userService.login(user);
    const token = this.createToken({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    return Object.assign(data, { token });
  }

  async loginWithoutPasswd(user: Partial<User>) {
    const data = await this.userService.loginWithoutPasswd(user);
    const token = this.createToken({
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    });
    return Object.assign(data, { token });
  }

  async checkAdmin() {
    return true;
  }

  async validateUser(payload: User) {
    const user = await this.userService.findById(payload.id);
    return user;
  }

  async loginWithGithub(code) {
    if (!code) {
      throw new HttpException('請輸入Gitub授權碼', HttpStatus.BAD_REQUEST);
    }

    try {
      const tokenResponse = (await axios({
        method: 'post',
        url:
          'https://github.com/login/oauth/access_token?' +
          `client_id=${this.configService.get('GITHUB_CLIENT_ID')}&` +
          `client_secret=${this.configService.get('GITHUB_CLIENT_SECRET')}&` +
          `code=${code}`,
        headers: {
          accept: 'application/json',
        },
      })) as any;
      const accessToken = tokenResponse.data.access_token;
      const result = (await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
          accept: 'application/json',
          Authorization: `token ${accessToken}`,
        },
      })) as any;

      if (result.data.email) {
        const user = {
          name: result.data.name,
          avatar: result.data.avatar_url,
          email: result.data.email,
          type: 'github',
        };

        const existUser = await this.userService.findByConditions(user);

        if (!existUser) {
          const password = `wipi_${uniqueid()}_${result.data.email}`;
          await this.userService.createUser({ ...user, password });
          const setting = await this.settingService.findAll(true);
          const emailMessage = {
            from: setting.smtpFromUser,
            to: result.data.email,
            subject: 'Github 用戶登錄通知',
            html: `您好，您使用了 Github 登錄了 NTU_Blog。NTU_Blog 已為您創建用戶，使用者名稱：${result.data.name}， 用戶密碼：${password}，請及時登錄系統修改密碼`,
          };
          this.smtpService.create(emailMessage).catch(() => {
            console.log(`通知用戶 ${result.data.name}（${result.data.email}），但發送郵件通知失敗`);
          });
        }

        const res = await this.loginWithoutPasswd(user);
        return res;
      } else {
        throw new HttpException('未獲取到您的公開郵件地址，無法使用Github登錄', HttpStatus.BAD_REQUEST);
      }
    } catch (e) {
      throw new HttpException(e.message || e, HttpStatus.BAD_REQUEST);
    }
  }
}
