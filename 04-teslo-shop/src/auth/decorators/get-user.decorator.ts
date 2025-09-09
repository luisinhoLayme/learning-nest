import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {

    const req = ctx.switchToHttp().getRequest()
    const user = req.user

    // console.log(data)

    if (!user)
      throw new InternalServerErrorException('User not found (request)')

    // return data === 'email' ? user.email : user
    return data ? user[data] : user
  }
)
