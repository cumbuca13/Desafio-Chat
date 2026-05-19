import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private prisma: PrismaService) {}

  async handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
    
    // Indicador de Presença: Mensagem ao entrar
    this.server.emit('presence', { message: `Um novo usuário entrou no chat (${client.id})` });

    // Persistência: Carregar histórico ao conectar
    const history = await this.prisma.message.findMany({
      include: { user: true },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });
    
    client.emit('history', history);
  }

  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
    
    // Indicador de Presença: Mensagem ao sair
    this.server.emit('presence', { message: `Um usuário saiu do chat (${client.id})` });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() data: { content: string; userId: number },
    @ConnectedSocket() client: Socket,
  ) {
    // Persistência: Salvar cada nova mensagem no banco
    const newMessage = await this.prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
      },
      include: { user: true },
    });

    // Emitir para todos os usuários
    this.server.emit('receiveMessage', newMessage);
  }
}
