# Guia de Instalação do Lint

Instale o pacote `@demmorou/eslint-config` em seu projeto:

```bash
npm install @demmorou/eslint-config --save
```

Crie um arquivo `.eslintrc` na raiz do seu projeto:

```bash
touch .eslintrc
```

Agora, basta extender a configuração dentro do seu arquivo `.eslintrc`:

```json
{
  "extends": "@demmorou/eslint-config"
}
```

Adicione o script para rodar lint nos arquivos do seu projeto:

```json
{
  "scripts": {
    "lint": "eslint \"src/**/*.ts\" --fix"
  }
}
```

Rode o lint:

```bash
npm run lint
```
