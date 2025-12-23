import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(16)
  username: string;

  /*
    A valid password should include the following:
    - at least 8 characters, at most 16 characters long
    - at least 1 uppercase character
    - at least 1 numeric character
    - at least 1 non-alpha numeric character like: `! @ # $ % ^ &`
  */
  @IsString()
  @MinLength(8)
  @MaxLength(16)
  @Matches(
    /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9!@#$%^&*]{8,16}$/,
    {
      message: 'Your password is too weak',
    }
  )
  password: string;
}
