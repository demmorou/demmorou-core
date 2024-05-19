# Guia de Instalação do Logger

O `Logger` é uma classe que permite a criação de logs personalizados em uma aplicação Node.js. Para usar o `Logger`, siga as etapas abaixo:

## 1. Instalação

Instale o pacote `@demmorou/logger` em seu projeto:

```bash
npm install @demmorou/logger --save
```

## 1. Importação e uso

Importe a classe `Logger` e defina as LoggerOptions no momento da instanciação.

```typescript
import { Logger, LoggerOptions } from 'logger';

// Defina as opções do logger
const options: LoggerOptions = {
  app_name: 'MinhaApp',
  version: '1.0.0',
  isDev: true,
  env: 'development',
};

// Instancie o Logger com as configurações da sua aplicação
const logger = new Logger(options);
```

Se preferir, você pode extender a classe `Logger` para uma outra classe na sua aplicação:

```typescript
import { Logger, LoggerOptions } from 'logger';

export class MyLogger extends Logger {
  constructor() {
    super({
      app_name: 'MinhaApp',
      version: '1.0.0',
      isDev: true,
      env: 'development',
    })
  }
}
```

## Uso básico
Agora que você instanciou o Logger, você pode usá-lo para fazer logs em diferentes níveis, como info, warn e error.

```typescript
// Exemplo de uso do Logger
logger.info('Esta é uma mensagem informativa.');
logger.warn('Aviso: algo pode estar errado.');
logger.error('Ocorreu um erro inesperado.');
```

## Exemplo com Nest.js
```typescript
// logger.service.ts
import { Inject } from '@nestjs/common';
import { Logger } from '@demmorou/logger';

import { environments } from '../config/enviroments';
import { AppConfigService } from '../config/config.service';

export class AppLogger extends Logger {
  // Injeção do config service da minha aplicação.
  constructor(@Inject(AppConfigService) config: AppConfigService) {
    super({
      app_name: config.appName,
      version: '1.0.0',
      env: config.environment,
      isDev: config.environment === environments.development,
    });
  }
}
```

No modulo de logger:

```typescript
// logger.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppLogger } from './logger.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class AppLoggerModule {}
```

Usando dentro de um logger interceptor:

```typescript
import { AppLogger } from '../logger/logger.service';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // obtém contexto http da request
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    // define momento de início da request
    res.reqStartedAt = Date.now();

    // define um unique id para request - usando uuid
    const requestId = randomUUID();
    req.requestId = requestId;
    res.setHeader('x-request-id', requestId);

    // adiciona um context à instancia do logger - ele apareerá em todos os logs a desta request
    // assim é possível rastreá-la do início ao fim
    this.logger.addContext({ uuid: requestId });

    // mensagem de log de início da requisição
    this.logger.info('HTTP request started', { req });
    return next
      .handle()
      // mensagem de log de fim da requisição
      .pipe(tap(() => this.logger.info('HTTP request finished', { req, res })));
  }
}
```

Quando a sua API processar uma requisição, aparecerá esses logs:

```js
[application-name] info   2024-04-30 09:17:38 HTTP request started - {
  metadata: {
    uuid: '62fa4ec9-24d4-443d-bea1-a9f5d5462ac9',
    req: {
      id: '62fa4ec9-24d4-443d-bea1-a9f5d5462ac9',
      method: 'POST',
      path: '/api/auth/login',
      ip: '::1'
    },
    env: 'develop',
    app_name: 'application-name',
    version: '0.0.1'
  }
}
[application-name] info   2024-04-30 09:17:38 User authentication started - {
  metadata: {
    uuid: '62fa4ec9-24d4-443d-bea1-a9f5d5462ac9',
    env: 'develop',
    app_name: 'application-name',
    version: '0.0.1'
  }
}
[application-name] info   2024-04-30 09:17:38 User sucessfully authenticated - {
  metadata: {
    uuid: '62fa4ec9-24d4-443d-bea1-a9f5d5462ac9',
    env: 'develop',
    app_name: 'application-name',
    version: '0.0.1'
  }
}
[application-name] info   2024-04-30 09:17:38 HTTP request finished - {
  metadata: {
    uuid: '62fa4ec9-24d4-443d-bea1-a9f5d5462ac9',
    req: {
      id: '62fa4ec9-24d4-443d-bea1-a9f5d5462ac9',
      method: 'POST',
      path: '/api/auth/login',
      ip: '::1'
    },
    res: { status: 201, time: '58ms' },
    env: 'develop',
    app_name: 'application-name',
    version: '0.0.1'
  }
}
```