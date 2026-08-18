import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsNotEmpty({ message: '电子邮箱不能为空' })
  @IsEmail({}, { message: '请输入有效的电子邮箱' })
  @MaxLength(254, { message: '电子邮箱长度不能超过 254 个字符' })
  email!: string;

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(8, { message: '密码至少需要 8 个字符' })
  @MaxLength(72, { message: '密码不能超过 72 个字符' })
  @Matches(/[A-Za-z]/, { message: '密码必须包含至少一个英文字母' })
  @Matches(/[0-9]/, { message: '密码必须包含至少一个数字' })
  @Matches(/[@$!%*?&._-]/, { message: '密码必须包含至少一个特殊字符' })
  @Matches(/^[A-Za-z0-9@$!%*?&._-]+$/, {
    message: '密码包含不支持的字符',
  })
  password!: string;
}
