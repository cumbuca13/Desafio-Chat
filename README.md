# 💬 Desafio Chat - NestJS + Next.js

Este projeto é uma aplicação de chat em tempo real que utiliza **WebSockets (Socket.IO)** para comunicação, **NestJS** no back-end com **Prisma/SQLite** para persistência, e **Next.js** no front-end.

---

## 🚀 O que foi implementado?

1.  **Indicador de Presença**:
    *   O console e a tela do chat exibem mensagens automáticas quando um usuário entra ou sai da sala (eventos `connection` e `disconnect`).
2.  **Estilização Condicional**:
    *   As mensagens enviadas por **"Você"** aparecem alinhadas à direita em azul.
    *   As mensagens de **outros usuários** aparecem à esquerda em cinza.
    *   Mensagens de sistema (entrada/saída) aparecem centralizadas.
3.  **Persistência (Banco de Dados)**:
    *   Implementado modelo `Message` no Prisma.
    *   Todas as mensagens são salvas no banco SQLite (`dev.db`).
    *   Ao conectar, o histórico das últimas mensagens é carregado automaticamente.

---

## 🛠️ Como rodar o projeto

### 1. Back-end (NestJS)
```bash
cd back-main
npm install
npx prisma generate
npm run start:dev
```
*O servidor rodará em `http://localhost:3000`*

### 2. Front-end (Next.js)
```bash
cd front-main
npm install
npm run dev
```
*O site rodará em `http://localhost:4000`*

---

## 📖 Como Testar
1. Acesse `http://localhost:4000`.
2. Clique em **"Abrir Chat"**.
3. Para simular outro usuário, abra uma **aba anônima** ou outro navegador e altere o **ID do Usuário** no campo na parte inferior da tela.
4. Ao atualizar a página, você verá que as mensagens anteriores continuam lá (persistência).
